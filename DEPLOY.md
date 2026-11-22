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
