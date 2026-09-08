---
name: module-review
description: Review a change to the Appointment API - a bug fix, a new endpoint, or a new feature module - against the project conventions in CLAUDE.md and the domain rules. Use when asked to review the current diff, check the working tree before a demo, or vet code the developer agent produced. Produces a severity-grouped findings list and does not edit code.
---

# Module review

A repeatable checklist for reviewing an uncommitted change to this repo. Follow
it top to bottom. Report, do not fix.

## 1. See the change

```bash
git status
git diff
npm test
npm run build
```

Note failures immediately — a failing suite or build is the first finding.

## 2. Read for context

Open every changed file in full. Open the sibling it should resemble
(`src/offices/*` or `src/appointments/*`). A new module should be almost boring
to read next to the existing ones.

## 3. Checklist

**Structure & naming**
- [ ] Feature-first: one folder under `src/`, `dto/` and `entity/` subfolders.
- [ ] Plural folder and route names; singular entity and DTO class names.
- [ ] Module registered in `app.module.ts`; entities via `TypeOrmModule.forFeature`.
- [ ] Files mirror the existing modules (controller, service, mapper or inline
      map, `*.spec.ts`).

**Layering**
- [ ] Business rules are in the service, not the controller or the DTOs.
- [ ] Controller only receives input, delegates, returns a DTO.
- [ ] No TypeORM entity is returned from a controller.

**DTOs & validation**
- [ ] Request shapes validated with `class-validator` decorators.
- [ ] Date-only values constrained with `@Matches(/^\d{4}-\d{2}-\d{2}$/)` — not
      just `@IsISO8601()` / `@IsDateString()`, which also accept
      `2026-06-30T12:00:00Z` and then break naive date parsing.
- [ ] Numeric path/body fields are actually numbers (`@Type(() => Number)` +
      `@IsInt()` / `@Min()`), not unvalidated `any`.
- [ ] Response DTOs are simple and readable in Swagger.

**Domain rules**
- [ ] Appointments start on a full hour, UTC (minutes/seconds/ms all zero).
- [ ] `endsAt` is derived as `startsAt + 60 min`, never taken from input.
- [ ] Overlap prevention: exact `startsAt` equality per office; on update the
      edited row is excluded.
- [ ] Availability treats `opensAt` / `closesAt` as UTC hours (documented
      simplification) and drops already-booked slots.

**REST & Swagger**
- [ ] Nouns not verbs; path params for identity; query params for filters.
- [ ] No accidental `DELETE`, no bare `GET /offices/:id`.
- [ ] New endpoints have `@ApiTags`, `@ApiOperation`, response types, and
      `@ApiQuery` where relevant — enough to test in `/api`.

**Tests**
- [ ] Focused unit tests added in the existing style (mocked repositories,
      `test/testdata.factory.ts` helpers where they fit).
- [ ] At least one happy path and one rejection/not-found case.
- [ ] `npm test` green.

**Scope & dependencies**
- [ ] No new npm packages unless clearly justified.
- [ ] No auth, frontend, caching, queues, background jobs.
- [ ] No unrelated refactors mixed into the diff.
- [ ] `npm run lint` was **not** run as part of the change (it rewrites files);
      if the diff shows mass reformatting, flag it.

## 4. Report

One-line verdict: `APPROVE` / `APPROVE WITH NITS` / `CHANGES REQUESTED`.

Then:
- **Blockers** — must fix before demo or commit.
- **Should fix** — real problems, not blocking for a workshop.
- **Nice to have** — style, naming, extra tests.
- **Good** — one or two things done well.

Each finding as `file:line — problem — suggested fix`. Keep it short.
