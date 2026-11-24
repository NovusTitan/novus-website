# Push to GitHub and deploy on Vercel

## 1. Create the GitHub repo
1. Go to https://github.com/new
2. Name it `novus-talent`, set it to **Private**, and leave "Add a README" **unchecked**.
3. Click **Create repository**.

## 2. Push the code
From the `novus-talent` folder:

```bash
git remote add origin https://github.com/YOUR-USERNAME/novus-talent.git
git branch -M main
git push -u origin main
```

`.env.local` is git-ignored, so your Supabase keys never reach GitHub.

## 3. Create the Supabase project (if you haven't)
1. Go to https://supabase.com/dashboard and click **New project**.
2. Open **Project Settings → API** and copy the **Project URL** and the **anon public** key.
3. Paste both into `.env.local` for local development.

## 4. Deploy on Vercel
1. Go to https://vercel.com/new and sign in with GitHub.
2. **Import** the `novus-talent` repo. Vercel detects Next.js automatically.
3. Open **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. You'll get a `*.vercel.app` URL in about a minute.

Every push to `main` redeploys automatically, and other branches get preview URLs.

## 5. Connect novustalent.co (pending)
Status: `novustalent.co` and `www.novustalent.co` are already added in Vercel (Project → Settings → Domains). They show
"Invalid Configuration" until the DNS records below exist. That's harmless; the site keeps working at
https://novus-website-ochre.vercel.app.

The domain's DNS is managed at **name.com**. Log in, go to My Domains → novustalent.co → Manage DNS Records, then:

1. **Delete** only these, if present:
   - an A record with a blank or `@` host
   - any record with host `www`
   - an ALIAS or ANAME record on the blank host

   **Do not touch MX or TXT records** (email).
2. **Add** these two records:

   | Type  | Host (name.com) | Answer |
   |-------|-----------------|--------|
   | A     | *(leave blank)* | `216.198.79.1` |
   | CNAME | `www`           | `6a1f65cebad71e18.vercel-dns-017.com` |

   These values come from Vercel's Domains page. If Vercel shows different values later, use Vercel's.
3. Turn off any **URL Forwarding** on the domain at name.com.
4. Wait 5–10 minutes, then click **Refresh** on both domains in Vercel until they show "Valid Configuration".
5. In Supabase, go to Authentication → URL Configuration and set **Site URL** to `https://www.novustalent.co`.

**Lost the name.com login?**
1. Check the registrar at https://lookup.icann.org.
2. Search your email for "name.com".
3. Use "Forgot password" at name.com.
4. Or contact name.com support to prove ownership.

## 6. Set up the live database for the job board (one time)
The job board needs its tables in your **hosted** Supabase project. Until this is done, the site still works, but it shows "no open jobs".

1. **Create the tables and security rules.**
   1. In Supabase, open **SQL Editor** and click **New query**.
   2. Open `supabase/migrations/20261122000000_job_board.sql` on GitHub, click **Raw**, and copy everything.
   3. Paste it into the SQL Editor and click **Run**. You should see "Success. No rows returned."

   Run it **once**. Running it a second time errors, because the tables already exist, and that's harmless.
2. **Tell Supabase where the site lives.** Open **Authentication → URL Configuration**:
   - **Site URL:** `https://novus-website-ochre.vercel.app`. Change it to `https://www.novustalent.co` once the domain is connected.
   - **Redirect URLs:** add `https://novus-website-ochre.vercel.app/**`. When the domain is live, also add `https://www.novustalent.co/**`.
3. **Email templates.** These make the links in emails work from any phone or email app. Open **Authentication → Emails → Templates**:
   - **Confirm signup:** set the subject to "Confirm your Novus account". Replace the body with the contents of `supabase/templates/confirmation.html`.
   - **Reset password:** set the subject to "Reset your Novus password". Replace the body with the contents of `supabase/templates/recovery.html`.
4. **Make yourself a recruiter.**
   1. Create an account on the site (Log in → Create an account).
   2. Run this in the SQL Editor, using your own email:
      ```sql
      update public.profiles set role = 'recruiter' where email = 'you@example.com';
      ```
   3. Log in again. **My account** now shows a **Recruiter dashboard** button (`/admin/jobs`).

### Before real job seekers sign up: email sending
Supabase's built-in email only sends a few emails per hour, and it's meant for testing. Pick one:
- **Recommended:** connect a real email service such as Resend (free tier) under **Authentication → Emails → SMTP Settings**.
- **Stopgap:** turn off **Confirm email** under **Authentication → Sign In / Providers → Email**. People can then apply right after signing up, without confirming. The trade-off is that email addresses aren't verified.

## 7. Employers update (run once, after section 6)
1. In Supabase, open **SQL Editor** and click **New query**.
2. Paste everything from `supabase/migrations/20261124000000_employers.sql` and click **Run**.

This adds search requests, employer accounts, invite links and the shortlist. It doesn't change anything you already set up.

**Rule for future database changes:** every file in `supabase/migrations/` runs once, in date order.
