-- =============================================================================
-- Novus Talent: Phase 2/3 (employers, search requests, shortlist + release)
-- Core privacy rule: employers NEVER see a candidate's name or contact details
-- until Novus releases that candidate. Employers get candidate data only
-- through the SECURITY DEFINER functions below, which blank those fields
-- until shortlist.released_at is set. Employers have no direct table access
-- to profiles (other than their own), applications or shortlist.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Search requests: the public "Open a search" form on /employers
-- ---------------------------------------------------------------------------
create type public.search_request_status as enum ('new', 'contacted', 'active', 'closed');

create table public.search_requests (
  id uuid primary key default gen_random_uuid(),
  company text not null check (char_length(company) between 2 and 200),
  contact_name text not null check (char_length(contact_name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254 and email like '%@%'),
  phone text not null default '' check (char_length(phone) <= 30),
  roles text not null check (char_length(roles) between 2 and 2000),
  location text not null default '' check (char_length(location) <= 200),
  status public.search_request_status not null default 'new',
  staff_notes text not null default '' check (char_length(staff_notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index search_requests_created_idx on public.search_requests (created_at desc);

create trigger search_requests_updated_at before update on public.search_requests
  for each row execute function public.set_updated_at();

alter table public.search_requests enable row level security;

-- Anyone can submit a request (status must start at 'new', no staff notes).
create policy "search_requests: anyone submits"
  on public.search_requests for insert to anon, authenticated
  with check (status = 'new' and staff_notes = '');

-- Only staff read and update them.
create policy "search_requests: staff read"
  on public.search_requests for select to authenticated
  using ((select public.is_staff()));

create policy "search_requests: staff update"
  on public.search_requests for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

-- ---------------------------------------------------------------------------
-- Employers (client companies) and their invited users
-- ---------------------------------------------------------------------------
create table public.employers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 200),
  notes text not null default '' check (char_length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger employers_updated_at before update on public.employers
  for each row execute function public.set_updated_at();

create table public.employer_members (
  employer_id uuid not null references public.employers (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (employer_id, user_id)
);

create index employer_members_user_idx on public.employer_members (user_id);

-- Invite links. Staff create one per email and send the link themselves.
create table public.employer_invites (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers (id) on delete cascade,
  email text not null check (char_length(email) between 3 and 254 and email like '%@%'),
  token uuid not null unique default gen_random_uuid(),
  accepted_by uuid references public.profiles (id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default now() + interval '14 days',
  created_at timestamptz not null default now()
);

create index employer_invites_employer_idx on public.employer_invites (employer_id);

-- Which employer a job is for. Lives in the staff-only job_internal table so
-- the public jobs feed can't reveal the client.
alter table public.job_internal
  add column employer_id uuid references public.employers (id) on delete set null;

create index job_internal_employer_idx on public.job_internal (employer_id);

-- Employer IDs the current user belongs to (bypasses RLS; returns only the caller's).
create or replace function public.my_employer_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select employer_id from public.employer_members where user_id = (select auth.uid());
$$;

revoke execute on function public.my_employer_ids() from public;
grant execute on function public.my_employer_ids() to authenticated;

alter table public.employers enable row level security;
alter table public.employer_members enable row level security;
alter table public.employer_invites enable row level security;

create policy "employers: staff all"
  on public.employers for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

create policy "employers: members read own company"
  on public.employers for select to authenticated
  using (id in (select public.my_employer_ids()));

create policy "employer_members: staff all"
  on public.employer_members for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

create policy "employer_members: read own membership"
  on public.employer_members for select to authenticated
  using (user_id = (select auth.uid()));

-- Invites: staff only. Accepting goes through accept_employer_invite().
create policy "employer_invites: staff all"
  on public.employer_invites for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

-- Accept an invite: the logged-in user's email must match the invite.
-- Links them to the employer and makes a plain candidate account an employer
-- account (staff accounts keep their staff role).
create or replace function public.accept_employer_invite(p_token uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_email text;
  v_invite public.employer_invites%rowtype;
begin
  if v_uid is null then
    return 'not_logged_in';
  end if;

  select * into v_invite from public.employer_invites where token = p_token;
  if not found then
    return 'invalid';
  end if;
  if v_invite.accepted_at is not null then
    return case when v_invite.accepted_by = v_uid then 'ok' else 'used' end;
  end if;
  if v_invite.expires_at < now() then
    return 'expired';
  end if;

  select email into v_email from auth.users where id = v_uid;
  if lower(coalesce(v_email, '')) <> lower(v_invite.email) then
    return 'wrong_email';
  end if;

  insert into public.employer_members (employer_id, user_id)
  values (v_invite.employer_id, v_uid)
  on conflict do nothing;

  update public.employer_invites
  set accepted_by = v_uid, accepted_at = now()
  where id = v_invite.id;

  update public.profiles set role = 'employer'
  where id = v_uid and role = 'candidate';

  return 'ok';
end;
$$;

revoke execute on function public.accept_employer_invite(uuid) from public;
grant execute on function public.accept_employer_invite(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Shortlist: applicants Novus puts forward to the employer for a job.
-- Employers see these ONLY through the functions below.
-- ---------------------------------------------------------------------------
create table public.shortlist (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications (id) on delete cascade,
  years_experience smallint check (years_experience between 0 and 60),
  summary text not null default '' check (char_length(summary) <= 500),
  released_at timestamptz,
  released_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger shortlist_updated_at before update on public.shortlist
  for each row execute function public.set_updated_at();

alter table public.shortlist enable row level security;

create policy "shortlist: staff all"
  on public.shortlist for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));
-- No employer policy on purpose: employers use the functions below.

-- Searches (jobs) for the caller's employer(s), with counts.
create or replace function public.employer_searches()
returns table (
  job_id uuid,
  title text,
  industry public.industry,
  city text,
  state text,
  job_status public.job_status,
  employer_name text,
  shortlisted bigint,
  released bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select j.id, j.title, j.industry, j.city, j.state, j.status, e.name,
         count(s.id),
         count(s.id) filter (where s.released_at is not null)
  from public.jobs j
  join public.job_internal ji on ji.job_id = j.id
  join public.employers e on e.id = ji.employer_id
  left join public.applications a on a.job_id = j.id
  left join public.shortlist s on s.application_id = a.id
  where ji.employer_id in (select employer_id from public.employer_members where user_id = (select auth.uid()))
  group by j.id, e.name
  order by j.updated_at desc;
$$;

-- Shortlisted candidates for one of the caller's jobs.
-- Name, email, phone and resume are NULL until Novus releases the candidate.
create or replace function public.employer_candidates(p_job_id uuid)
returns table (
  shortlist_id uuid,
  label text,
  trade public.industry,
  years_experience smallint,
  summary text,
  released_at timestamptz,
  full_name text,
  email text,
  phone text,
  has_resume boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  with mine as (
    select ji.job_id
    from public.job_internal ji
    where ji.job_id = p_job_id
      and ji.employer_id in (select employer_id from public.employer_members where user_id = (select auth.uid()))
  ),
  ranked as (
    select s.*, a.trade, a.candidate_id, a.resume_path,
           row_number() over (order by s.created_at, s.id) as n
    from public.shortlist s
    join public.applications a on a.id = s.application_id
    where a.job_id in (select job_id from mine)
  )
  select r.id,
         -- Candidate A, B, ... Z, then AA, AB, ...
         'Candidate ' ||
           case when r.n <= 26 then chr((64 + r.n)::int)
                else chr((64 + ((r.n - 1) / 26))::int) || chr((65 + ((r.n - 1) % 26))::int) end,
         r.trade,
         r.years_experience,
         r.summary,
         r.released_at,
         case when r.released_at is not null then p.full_name end,
         case when r.released_at is not null then p.email end,
         case when r.released_at is not null then p.phone end,
         r.released_at is not null and r.resume_path is not null
  from ranked r
  join public.profiles p on p.id = r.candidate_id
  order by r.n;
$$;

-- Resume path for a RELEASED candidate on the caller's job (else NULL).
create or replace function public.employer_resume_path(p_shortlist_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select a.resume_path
  from public.shortlist s
  join public.applications a on a.id = s.application_id
  join public.job_internal ji on ji.job_id = a.job_id
  where s.id = p_shortlist_id
    and s.released_at is not null
    and ji.employer_id in (select employer_id from public.employer_members where user_id = (select auth.uid()));
$$;

-- Storage check: may the caller (an employer) read this resume file?
create or replace function public.employer_can_read_resume(p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.shortlist s
    join public.applications a on a.id = s.application_id
    join public.job_internal ji on ji.job_id = a.job_id
    where a.resume_path = p_name
      and s.released_at is not null
      and ji.employer_id in (select employer_id from public.employer_members where user_id = (select auth.uid()))
  );
$$;

revoke execute on function public.employer_searches() from public;
revoke execute on function public.employer_candidates(uuid) from public;
revoke execute on function public.employer_resume_path(uuid) from public;
revoke execute on function public.employer_can_read_resume(text) from public;
grant execute on function public.employer_searches() to authenticated;
grant execute on function public.employer_candidates(uuid) to authenticated;
grant execute on function public.employer_resume_path(uuid) to authenticated;
grant execute on function public.employer_can_read_resume(text) to authenticated;

create policy "resumes: employer reads released"
  on storage.objects for select to authenticated
  using (bucket_id = 'resumes' and public.employer_can_read_resume(name));

-- Supabase grants EXECUTE on new functions to anon by default; logged-out
-- visitors have no use for these, so remove it explicitly.
revoke execute on function public.my_employer_ids() from anon;
revoke execute on function public.accept_employer_invite(uuid) from anon;
revoke execute on function public.employer_searches() from anon;
revoke execute on function public.employer_candidates(uuid) from anon;
revoke execute on function public.employer_resume_path(uuid) from anon;
revoke execute on function public.employer_can_read_resume(text) from anon;
