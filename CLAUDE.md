# CLAUDE.md: appointment-api

## Project

This repository contains a small **NestJS + TypeScript** Appointment API for a public administration context.

The API manages appointments for preconfigured public offices.

Domain rules:

- An appointment belongs to exactly one office.
- A slot is identified by a calendar `date` and a full `startHour`; `endHour` is
  always `startHour + 1`.
- An office must not have two appointments in the same slot.

`TASK.md` is the participant-facing index; the exercises are one file per task
under `tasks/`. Trainer material lives in `workshop/`.

The workshop is held in German, so everything a participant reads is written in
German: `TASK.md`, `tasks/`, `SETUP.md` and `workshop/`. Everything an agent
reads stays English: the code and the agent definitions and skills under
`.claude/`.

**Participants build the agentic tooling themselves.** `.claude/` therefore holds
exactly one worked example — the `reviewer` agent with its `module-review` skill
— plus three deliberately empty scaffolds that the groups fill in during task 3:
the `architect` and `developer` agents and the `nest-feature-module` skill, which
is the build-side counterpart to `module-review` and the skill the developer
agent is meant to lean on. Do not complete those scaffolds and do not add
ready-made prompt files to the participant material; producing them is the
exercise. The finished versions are kept trainer-side under `workshop/reference/`
and `workshop/prompts/`.

There is deliberately **no skill that orchestrates architect → developer →
reviewer**, and adding one would be a regression. A skill cannot enforce the two
human checkpoints that are the point of task 3, its body would be a call sequence
rather than knowledge, and auto-triggering it would fire during ordinary work.
The rule the workshop teaches is: agent = role, skill = knowledge, sequence =
command or done by hand. `workshop/TRAINER_GUIDE.md` §3.4 has the full reasoning.

This branch is the **development branch**: it carries the task material **and**
the reference solutions (task 1, task 2, task 3 and the optional
`contact-requests/` module) and `workshop/`. The task 3 solution is the only one
that changes the base app beyond a new folder: `applicants/` plus the nullable
`Appointment.applicant` relation and the `applicantId` field on the create DTO.
The Architecture section below describes the participant-facing base app and
deliberately does not list the solution modules. `main` is
the participant state and must never receive `src/` or `test/` from here —
`workshop/RELEASE_TO_MAIN.md` has the branch map, the inventory and the recipes.
Keep that inventory current whenever you add a task or a solution.

## Stack

- NestJS
- TypeScript
- REST
- Swagger / OpenAPI via `@nestjs/swagger`
- SQLite + TypeORM
- `class-validator` + `class-transformer`
- Jest

Default DB driver: `better-sqlite3`.

## Architecture

Two feature modules under `src/`, wired together by `src/app.module.ts`, which also
configures the single TypeORM connection (`better-sqlite3`, `synchronize: true`,
`autoLoadEntities: true`). `src/main.ts` — not the modules — installs the global
`ValidationPipe` (`whitelist`, `transform`, `forbidNonWhitelisted`) and mounts
Swagger at `/api`.

- **offices/** — `GET /offices` (list) and `GET /offices/:id/availability`.
  `OfficesSeedService` implements `OnApplicationBootstrap` and inserts
  `INITIAL_OFFICE_DATA` once, only when the table is empty, so restarts do not
  duplicate offices. `Office` stores `opensAtHour` / `closesAtHour` as integers.
- **appointments/** — CRUD without delete (`POST`, `GET`, `GET /:id`, `PATCH /:id`).
  `AppointmentsModule` also imports the `Office` repository so it can load and
  attach the related office.

The split is deliberate: **shape rules live in the DTOs, business rules in the
services.**

- `date` and `startHour` are constrained in `CreateAppointmentDto` — a calendar
  date via `@Matches`, an hour via `@IsInt() @Min(0) @Max(23)`. Nothing else can
  even be expressed, so the services never re-check the shape.
- `endHour` is derived as `startHour + 1` in the service, behind the validation.
- Overlap prevention is an equality check on office, `date` and `startHour`. On
  update the edited appointment is excluded via `ignoredAppointmentId`.
- Availability builds hourly slots between `opensAtHour` and `closesAtHour` and
  drops the ones already booked.

Entities are never returned directly: `AppointmentMapper` (static methods) maps to
`AppointmentResponseDto`; `OfficesService` maps inline.

## General Guidelines

Optimize for:

- clarity over cleverness
- teaching value over abstraction
- simple, reviewable changes
- explicit code over magic
- standard NestJS patterns

Avoid:

- unnecessary abstractions
- production-only complexity
- new dependencies unless clearly justified
- frontend, auth, queues, caching, microservices, or background jobs unless explicitly requested

## Language and Naming

- Use **English** for code, comments, routes, Swagger docs, DTOs, and tests.
- Follow the naming style already used in the project.
- Use clear and explicit names.
- Use plural names for feature folders and routes, e.g. `appointments`, `offices`.
- Use singular names for entities and DTO classes, e.g. `Appointment`, `Office`, `CreateAppointmentDto`.

## File Structure

Use the existing feature-first structure.

Before creating new files, inspect the existing `appointments` and `offices` modules and follow their conventions.

Do not introduce a new architectural style for the workshop task.

## API Routes

Use REST-style, resource-oriented routes.

Existing routes:

- `GET /appointments`
- `GET /appointments/:id`
- `POST /appointments`
- `PATCH /appointments/:id`
- `GET /offices`
- `GET /offices/:id/availability`

There is deliberately no `DELETE` and no bare `GET /offices/:id`.

Rules:

- Use nouns, not verbs.
- Use lowercase plural route names.
- Use path parameters for resource identity.
- Use query parameters for filtering and optional criteria.
- Avoid action-style routes like `/searchAppointments` or `/getAvailableSlots`.
- Return DTOs, not TypeORM entities.

When implementing a new endpoint, choose a route that fits the existing REST style and the requested use case.

## DTOs and Mapping

- Use DTOs intentionally for public API input and output.
- Do not expose TypeORM entities directly from controllers.
- Keep response shapes simple and easy to understand in Swagger.

## Date and Time

**There is deliberately no timestamp in the API contract.** A slot is a calendar
day plus a full hour in local time of the office, so the contract carries `date`
(`"2026-06-20"`) and `startHour` (`9`) as separate fields, and the API never
converts between time zones. This is unusual for a REST API and is a modelling
decision, not an oversight: an instant can express values the domain does not
have — half hours, seconds, offsets — and every one of them would need to be
rejected or normalised somewhere.

Rules:

- Constrain a date explicitly with `@Matches(/^\d{4}-\d{2}-\d{2}$/)`. Do **not**
  use `@IsISO8601()` or `@IsDateString()` for a date-only field — they also
  accept full date-times like `2026-06-30T12:00:00Z`.
- Constrain an hour with `@IsInt() @Min(0) @Max(23)`.
- Show useful examples in Swagger.

## Validation

Use DTO validation for request shapes and service-level validation for business rules.

Business rules belong in services.

Avoid `any` and raw payload handling unless explicitly requested.

## Persistence

Use TypeORM with SQLite.

Rules:

- Keep persistence simple and local-friendly.
- Use repositories via `@InjectRepository`.
- Register feature entities with `TypeOrmModule.forFeature`.
- `synchronize: true` is acceptable for this workshop, but not production guidance.

Entity relationship:

- `Appointment` has a `ManyToOne` relation to `Office`.
- `Office` does not need a reverse appointments relation unless explicitly required.

## Controllers and Services

Controllers should:

- receive input
- rely on DTO validation
- delegate to services
- return response DTOs

Services should:

- contain business logic
- validate domain rules
- use repositories
- perform mapping where appropriate

Do not place business logic in controllers.

## Swagger

Swagger is the primary manual testing surface.

Document new public endpoints sufficiently so they can be tested in Swagger.

Use the title: `Appointment API`.

## Testing

Keep tests small, focused, and readable. They should cover the most important behavior, not every possible edge case. Prefer a few meaningful tests over many repetitive tests.

### Code Style

- Prefer straightforward TypeScript.
- Keep functions short and purposeful.
- Use explicit return types where helpful.
- Avoid unnecessary generics and helper layers.
- Keep comments sparse and useful.
- Prefer readability over clever abstractions.

### Dependency Policy

Before adding a dependency:

- check whether NestJS, TypeORM, or existing libraries already solve the problem
- justify the dependency
- avoid packages used only for convenience

Avoid unless explicitly requested:

- mapper frameworks
- CQRS/event sourcing
- advanced pagination packages
- additional infrastructure libraries

### Definition of Done

A change is complete when:

- the code builds
- the endpoint works in Swagger
- the main behavior is covered by focused unit tests
- the implementation remains understandable for workshop participants

This is the standard for the **reference solutions in this repository**, not the
acceptance criteria the participants work against. The task texts under `tasks/`
deliberately make writing tests an optional extension, because mixed-level groups
spend the time on Jest mock mechanics instead of on the learning goal. Keep the
reference solutions tested anyway — they are the trainer's safety net.

### Useful Commands

Use existing package scripts only.

- `npm run start:dev` — run with watch; Swagger UI at http://localhost:3000/api
- `npm run build`
- `npm test` — unit tests (Jest, `*.spec.ts` under `src/`)
- `npm test -- offices.service` — run one file; `npm test -- -t "slot"` by test name
- `npm run test:cov` — unit tests with coverage
- `npm run lint` — note: this runs `eslint --fix` and rewrites files in place

The SQLite file (`data/appointments.db`, gitignored) is created and migrated on
first run via `synchronize: true`; delete it to reset local state. If a command is
missing, inspect `package.json` before assuming it exists.
