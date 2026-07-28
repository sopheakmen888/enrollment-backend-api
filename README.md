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
