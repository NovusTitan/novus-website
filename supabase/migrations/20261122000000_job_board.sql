-- =============================================================================
-- Novus Talent: Phase 1 (job board)
-- Tables: profiles, jobs, job_internal, applications + private "resumes" storage.
-- Every table has row-level security (RLS). Read the policy comments before changing.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Roles
-- candidate: job seekers (default for anyone who signs up)
-- recruiter / admin: Novus staff. Set by hand in Supabase, never self-assigned.
-- employer: reserved for Phase 3 (invite-only). Nothing grants it yet.
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('candidate', 'recruiter', 'admin', 'employer');

create type public.industry as enum (
  'Engineering',
  'Architecture',
  'Data Centers & Critical Infrastructure',
  'Construction',
  'Telecommunications'
);

create type public.job_status as enum ('draft', 'open', 'closed');
create type public.employment_type as enum ('Full-time', 'Contract', 'Contract-to-hire', 'Part-time');
create type public.pay_period as enum ('hour', 'year');
create type public.application_status as enum ('new', 'reviewing', 'interviewing', 'placed', 'not_selected');

-- Shared trigger: keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: one row per signed-up user
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'candidate',
  full_name text not null default '' check (char_length(full_name) <= 120),
  email text not null default '',
  phone text not null default '' check (char_length(phone) <= 30),
  trade public.industry,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Is the current user Novus staff? SECURITY DEFINER so policies can call it
-- without recursing through profiles' own RLS.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('recruiter', 'admin')
  );
$$;

-- anon needs EXECUTE too because the public jobs policy calls it (it returns false for anon).
revoke execute on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated;

-- Create the profile automatically when someone signs up.
-- Name and phone come from sign-up metadata; role is ALWAYS 'candidate' here.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120),
    left(coalesce(new.raw_user_meta_data ->> 'phone', ''), 30)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profiles.email in sync if a user changes their email.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = coalesce(new.email, '') where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

alter table public.profiles enable row level security;

-- Users see their own profile; staff see everyone.
create policy "profiles: read own or staff"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_staff()));

-- Users can edit their own profile...
create policy "profiles: update own"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ...but only these columns. Role and email can't be changed through the API.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, phone, trade) on public.profiles to authenticated;
-- No insert/delete policies: profiles are created by the trigger only.

-- ---------------------------------------------------------------------------
-- jobs: public job posts (Novus staff create them)
-- ---------------------------------------------------------------------------
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 120),
  industry public.industry not null,
  city text not null check (char_length(city) between 2 and 80),
  state text not null check (state ~ '^[A-Z]{2}$'),
  employment_type public.employment_type not null default 'Full-time',
  pay_min numeric(10, 2) check (pay_min >= 0),
  pay_max numeric(10, 2) check (pay_max >= 0),
  pay_period public.pay_period,
  summary text not null default '' check (char_length(summary) <= 300),
  description text not null default '' check (char_length(description) <= 10000),
  requirements text not null default '' check (char_length(requirements) <= 10000),
  status public.job_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pay_range check (pay_min is null or pay_max is null or pay_max >= pay_min),
  constraint pay_period_required check ((pay_min is null and pay_max is null) or pay_period is not null)
);

create index jobs_open_idx on public.jobs (status, published_at desc);

create trigger jobs_updated_at before update on public.jobs
  for each row execute function public.set_updated_at();

-- Stamp published_at the first time a job opens.
create or replace function public.jobs_set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'open' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

create trigger jobs_published_at before insert or update of status on public.jobs
  for each row execute function public.jobs_set_published_at();

alter table public.jobs enable row level security;

-- Anyone (even logged out) can read OPEN jobs. Drafts and closed jobs are staff-only
-- (plus: candidates see jobs they applied to; that policy is defined after applications).
create policy "jobs: public reads open"
  on public.jobs for select to anon, authenticated
  using (status = 'open' or (select public.is_staff()));

create policy "jobs: staff insert"
  on public.jobs for insert to authenticated
  with check ((select public.is_staff()));

create policy "jobs: staff update"
  on public.jobs for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

create policy "jobs: staff delete"
  on public.jobs for delete to authenticated
  using ((select public.is_staff()));

-- ---------------------------------------------------------------------------
-- job_internal: confidential details (client company, notes). Staff only.
-- Kept in its own table so it can never leak through the public jobs feed.
-- ---------------------------------------------------------------------------
create table public.job_internal (
  job_id uuid primary key references public.jobs (id) on delete cascade,
  client_name text not null default '' check (char_length(client_name) <= 200),
  notes text not null default '' check (char_length(notes) <= 5000),
  updated_at timestamptz not null default now()
);

create trigger job_internal_updated_at before update on public.job_internal
  for each row execute function public.set_updated_at();

alter table public.job_internal enable row level security;

create policy "job_internal: staff only"
  on public.job_internal for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

-- ---------------------------------------------------------------------------
-- applications: a candidate applying to a job
-- ---------------------------------------------------------------------------
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  candidate_id uuid not null references public.profiles (id) on delete cascade default auth.uid(),
  trade public.industry,
  note text not null default '' check (char_length(note) <= 2000),
  resume_path text check (resume_path is null or resume_path like candidate_id::text || '/%'),
  status public.application_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);

create index applications_job_idx on public.applications (job_id, created_at desc);
create index applications_candidate_idx on public.applications (candidate_id, created_at desc);

create trigger applications_updated_at before update on public.applications
  for each row execute function public.set_updated_at();

-- Helpers for policies that would otherwise reference each other in a loop
-- (applications -> jobs -> applications). SECURITY DEFINER reads skip RLS, and
-- each returns only a yes/no for the current user.
create or replace function public.job_is_open(p_job_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.jobs where id = p_job_id and status = 'open');
$$;

create or replace function public.has_applied(p_job_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.applications
    where job_id = p_job_id and candidate_id = (select auth.uid())
  );
$$;

revoke execute on function public.job_is_open(uuid) from public;
revoke execute on function public.has_applied(uuid) from public;
grant execute on function public.job_is_open(uuid) to authenticated;
grant execute on function public.has_applied(uuid) to authenticated;

alter table public.applications enable row level security;

-- Candidates see only their own applications; staff see all.
create policy "applications: read own or staff"
  on public.applications for select to authenticated
  using (candidate_id = (select auth.uid()) or (select public.is_staff()));

-- Candidates can apply for themselves, to open jobs only, starting at status 'new'.
create policy "applications: candidate applies to open job"
  on public.applications for insert to authenticated
  with check (
    candidate_id = (select auth.uid())
    and status = 'new'
    and public.job_is_open(job_id)
  );

-- Only staff can change an application (e.g. its status).
create policy "applications: staff update"
  on public.applications for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

-- No delete policy: applications are kept.

-- Candidates can still see a job they applied to after it closes (for "My applications").
create policy "jobs: candidate reads jobs they applied to"
  on public.jobs for select to authenticated
  using (public.has_applied(id));

-- ---------------------------------------------------------------------------
-- Storage: private "resumes" bucket. 5 MB max, PDF and Word only.
-- Files live at resumes/<user id>/<file>. No public URLs.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

create policy "resumes: upload own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "resumes: read own or staff"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'resumes'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_staff()))
  );
