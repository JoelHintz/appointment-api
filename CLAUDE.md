# CLAUDE.md: appointment-api

## Project

This repository contains a **NestJS + TypeScript** hands-on project for an **Appointment API** in a public administration context.

The API manages appointments for preconfigured public offices.

Domain rules:

- An appointment belongs to exactly one office.
- Appointments are booked for fixed one-hour slots.
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

Existing route examples:

- `GET /appointments`
- `GET /appointments/:id`
- `POST /appointments`
- `PATCH /appointments/:id`
- `DELETE /appointments/:id`
- `GET /offices`
- `GET /offices/:id`

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

Use ISO-8601 strings in the API contract.

Rules:

- Validate date and date-time input where relevant.
- Show useful examples in Swagger.
- Keep time zone handling simple unless explicitly required.

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

### Useful Commands

Use existing package scripts only.

Common commands:

- `npm run start:dev`
- `npm run test`
- `npm run test:e2e`
- `npm run lint`

If a command is missing, inspect `package.json` before assuming it exists.
