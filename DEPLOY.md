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

## 5. Connect novustalent.co (optional)
1. In Vercel, open **Project → Settings → Domains** and add `novustalent.co` and `www.novustalent.co`.
2. Vercel shows the DNS records to add (usually an A record for the root domain and a CNAME for `www`). Add them at your domain registrar.
3. HTTPS is set up automatically once DNS resolves.
4. In Supabase, open **Authentication → URL Configuration** and set the Site URL to `https://novustalent.co`.
