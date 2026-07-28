# Course Enrollment API — SOLUTION (private, instructor only)

Answer key for the C3 practice test. **Never share this repo with students.**

## Run it

```bash
npm install
cp .env.example .env    # edit DATABASE_URL
npm run migrate         # creates tables
npm run seed            # loads fixed test data
npm run dev             # http://localhost:3000
```

Then open `requests.http` (VS Code REST Client) and click through every
request — all expected results are written next to each one.

The student-facing version of this project (stubs + docs) lives in the
**starter** repo.

## Deploying to Vercel + Neon (so s2-plan-2-enrollment students can hit a live API)

This repo already has `api/index.js` + `vercel.json` (routes every request
through the Express app as one serverless function) and a `postinstall`
script that runs `prisma generate` on Vercel's build.

1. **Neon**: create a project at neon.tech (any region). On the project's
   Dashboard → Connection Details, copy **both**:
   - the **Pooled connection** string (host ends in `-pooler`)
   - the **Direct connection** string (no `-pooler`)
2. **Run the migration once, from your machine, against Neon's direct
   connection**:
   ```bash
   # temporarily put the Neon DIRECT string in .env as DATABASE_URL
   npm run migrate:deploy   # prisma migrate deploy — applies existing migrations, no prompts
   npm run seed              # loads the fixed test data students will query
   ```
   Restore your local `.env` back to your local Postgres string afterwards
   if you still need it for local dev.
3. **GitHub**: create a new **private** repo (e.g. `plan-2-enrollment-solution`),
   then from this folder:
   ```bash
   git remote add origin <your-new-repo-url>
   git push -u origin main
   ```
4. **Vercel**: on vercel.com → Add New Project → import that GitHub repo.
   Before the first deploy, set one Environment Variable:
   - `DATABASE_URL` = Neon's **pooled** connection string (append
     `?pgbouncer=true&connection_limit=1` if Neon didn't already include
     query params) — this is what the deployed app uses at request time.
   Deploy. Vercel gives you a URL like `https://plan-2-enrollment-solution.vercel.app`.
5. **Verify**: `curl https://<your-app>.vercel.app/api/courses` should
   return the seeded courses. Give students this base URL for
   s2-plan-2-enrollment's `VITE_API_URL` / `src/api.js`.

Every future `git push` to `main` auto-redeploys via Vercel's GitHub
integration — no need to repeat step 4.
