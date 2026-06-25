# CLAUDE.md: appointment-api

## Project

This repository contains a **NestJS + TypeScript** hands-on project for an **Appointment API** in a public administration context.

The API manages appointments for preconfigured public offices.

Domain rules:

- An appointment belongs to exactly one office.
- An appointment must start at a full hour and is always exactly one hour long.
- An office must not have overlapping appointments.

## Stack

- NestJS
- TypeScript
- REST
- Swagger / OpenAPI via `@nestjs/swagger`
- SQLite + TypeORM
- `class-validator` + `class-transformer`
- Jest

Default DB driver: `better-sqlite3`.

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
- Use clear, explicit names.
- Use plural names for feature folders and routes, e.g. `appointments`, `offices`.
- Use singular names for entities and DTO classes, e.g. `Appointment`, `Office`, `CreateAppointmentDto`.
- Use standard NestJS file names, e.g. `appointments.controller.ts`, `appointments.service.ts`, `appointment.entity.ts`.
- Use conventional method names: `create`, `findAll`, `findOne`, `update`, `remove`.
- Use `Id` suffix for references in DTOs, e.g. `officeId`.

## File Structure

Use a feature-first structure.

```txt
src/
├── app.module.ts
├── main.ts
├── appointments/
│   ├── dto/
│   ├── entities/
│   ├── appointments.controller.ts
│   ├── appointments.service.ts
│   ├── appointments.module.ts
│   ├── appointments.controller.spec.ts
│   └── appointments.service.spec.ts
├── offices/
│   ├── dto/
│   ├── entities/
│   ├── offices.controller.ts
│   ├── offices.service.ts
│   ├── offices.seed.ts
│   ├── offices.module.ts
│   ├── offices.controller.spec.ts
│   ├── offices.service.spec.ts
│   └── offices.seed.spec.ts
└── common/
    ├── config/
    ├── validation/
    └── utils/
```

## API Routes

Use REST-style, resource-oriented routes.

Examples:

- `GET /appointments`
- `GET /appointments/:id`
- `POST /appointments`
- `PATCH /appointments/:id`
- `DELETE /appointments/:id`
- `GET /offices`
- `GET /offices/:id`
- `GET /offices/:id/availability`

Rules:

- Use nouns, not verbs.
- Use lowercase plural route names.
- Use path parameters for resource identity.
- Use query parameters for filtering and optional criteria.
- Avoid action-style routes like `/searchAppointments` or `/getAvailableSlots`.
- Return DTOs, not TypeORM entities.

## DTOs and Mapping

- Request DTOs define API input.
- Response DTOs define API output.
- Keep DTOs small and explicit.
- Prefer manual mapping between entities and response DTOs.
- Do not expose TypeORM entities directly from controllers.

## Date and Time

Use ISO-8601 strings in the API contract.

Rules:

- Validate date-time input.
- Show ISO examples in Swagger.
- Keep time zone handling simple unless explicitly required.

## Validation

Use DTO validation for request shapes and service-level validation for business rules.

Business rules belong in services:

- appointment duration must be exactly one hour
- appointment end must be after start
- office must exist
- office must not be double-booked

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
- `Office` does not need a reverse `appointments` relation unless explicitly required.

## Seed Data

Office seed data is inserted automatically on application startup if no offices exist.

Rules:

- Keep seed data simple.
- Seed only master data such as offices.
- Do not introduce a production seed framework.

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

Rules:

- Configure Swagger in `main.ts`.
- Document all public endpoints.
- Add concise summaries and useful examples.
- Keep Swagger docs aligned with DTOs and behavior.

Use the title: `Appointment API`.

## Testing

The project should include unit tests.

Priorities:

1. service tests for core business rules
2. controller tests for delegation and response behavior

Important cases:

- valid appointment creation
- invalid start time
- overlapping appointments
- adjacent appointments
- missing office
- invalid DTO input

Keep tests readable and educational.

## Code Style

- Prefer straightforward TypeScript.
- Keep functions short and purposeful.
- Use explicit return types where helpful.
- Avoid unnecessary generics and helper layers.
- Keep comments sparse and useful.
- Prefer readability over clever abstractions.

## Dependency Policy

Before adding a dependency:

- check whether NestJS, TypeORM, or existing libraries already solve the problem
- justify the dependency
- avoid packages used only for convenience

Avoid unless explicitly requested:

- mapper frameworks
- CQRS/event sourcing
- advanced pagination packages
- additional infrastructure libraries

## Definition of Done

A change is complete when:

- the code builds
- the endpoint works in Swagger
- validation is active where relevant
- response DTOs are used intentionally
- tests cover the main behavior
- the implementation remains understandable for workshop participants

## Useful Commands

Use existing package scripts only.

Common commands:

- `npm run start:dev`
- `npm run test`
- `npm run test:e2e`
- `npm run lint`

If a command is missing, inspect `package.json` before assuming it exists.
