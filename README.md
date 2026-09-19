# Maaş Radar

Anonymous salary transparency platform for Turkey. People share what they
actually earn, and everyone else gets to walk into a negotiation knowing what
the market pays.

Salary data in Turkey is mostly hearsay — job postings say "market rate" and
candidates guess. Maaş Radar turns scattered anecdotes into something you can
filter, compare and cite.

## Features

**Pay data**
- Anonymous salary submissions — company, role, sector, city, years of
  experience, monthly pay, annual bonus, work arrangement, education level
- Freelance day and hour rates, broken down by remote / hybrid / on-site
- Search and filtering across every dimension
- Company rankings and trend charts

**Company intelligence**
- Company reviews rated 1–5 on culture, work-life balance, management, career
  growth and pay/benefits, with pros and cons
- Interview experiences — difficulty, outcome, the process and the questions asked
- A community forum with posts, comments and likes

**Calculators**
- Gross-to-net salary calculator
- Inflation-adjusted pay comparison
- Cost-of-living comparison between cities
- Seniority and career-path projections
- Education ROI estimator
- Offer comparison

**Give to get** — you contribute a data point before you can browse the detailed
breakdowns, which is what keeps the dataset from going stale.

## Tech stack

| | |
|---|---|
| Framework | Next.js (App Router) with React Server Components |
| Language | TypeScript |
| Data | Prisma ORM over SQLite |
| Charts | Recharts |
| Styling | Tailwind CSS |

Mutations go through Next.js server actions (`src/lib/actions.ts`,
`src/lib/forumActions.ts`) rather than API routes.

## Data model

Six Prisma models: `Salary`, `FreelanceRate`, `ForumPost`, `ForumYorum`,
`Interview` and `CompanyReview`. No user accounts — nothing submitted is tied to
an identity, which is the point. Gender is optional and nullable.

See [`prisma/schema.prisma`](prisma/schema.prisma).

## Running locally

```bash
git clone https://github.com/selimdogann/maas-radar.git
cd maas-radar
npm install
```

Create a `.env` file:

```
DATABASE_URL="file:./dev.db"
```

Then set up the database and start the dev server:

```bash
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000.

## Project layout

```
src/
├── app/            # routes — one folder per page
│   ├── maaslar/        # salary listings
│   ├── maas-ekle/      # submit a salary
│   ├── sirketler/      # company reviews
│   ├── mulakat/        # interview experiences
│   ├── freelance/      # freelance rates
│   ├── forum/          # community forum
│   ├── net-maas/       # gross-to-net calculator
│   ├── enflasyon/      # inflation comparison
│   └── ...
├── components/     # shared UI
└── lib/            # server actions, stats, db client
```

## Status

Personal project, actively developed. The schema and seed data are illustrative —
this is not a production deployment and the numbers in `dev.db` are not real
submissions.
