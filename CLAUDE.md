# CLAUDE.md

## Project
This repository contains a **NestJS + TypeScript** hands-on project for an **Appointment API / Appointment Service** in a public administration context. The API exposes REST-endpoints to find appointments that can be booked for preconfigured public offices.

Goals:
- teach a clean NestJS backend structure
- expose a small REST API through Swagger
- validate requests with DTOs
- persist data with SQLite + TypeORM
- cover the basics with unit and e2e/integration tests

## Stack
- NestJS
- TypeScript
- REST
- Swagger / OpenAPI via `@nestjs/swagger`
- SQLite + TypeORM
- `class-validator` + `class-transformer`
- Jest

Default DB driver: `better-sqlite3`

## Behavior guidelines for Claude
Optimize for:
- clarity over cleverness
- teaching value over abstraction
- simple, reviewable increments
- explicit code over magic
- consistency with NestJS defaults

Do **not** introduce heavy frameworks, complex abstractions, or production-only complexity unless explicitly requested.

## Naming Conventions

- Use **English** for code, comments, API routes, Swagger descriptions, and tests.
- Prefer **clear, explicit names** over short or clever ones.
- Keep naming consistent across controller, service, DTO, entity, mapper, and tests.
- Use standard NestJS file naming:
  - `appointments.controller.ts`
  - `appointments.service.ts`
  - `appointments.module.ts`
  - `appointments.mapper.ts`
- Use **singular** names for entities and DTO classes:
  - `Appointment`
  - `Office`
  - `CreateAppointmentDto`
  - `UpdateAppointmentDto`
  - `FindAppointmentsDto`
  - `AppointmentResponseDto`
- Use **plural** names for feature folders and routes
- Use conventional CRUD-style method names where possible:
  - `create`
  - `findAll`
  - `findOne`
  - `update`
  - `delete`
- Use descriptive helper method names.
- Use `Id` suffix for foreign key fields in DTOs (e.g. `officeId`).
- Return **response DTOs**, not entities, from controllers/services.

## File Structure

Use a **feature-first structure**. Keep each feature self-contained.

src/
├── app.module.ts
├── main.ts
├── appointments/
|   └── dto/
|   └── entity/
|   └── appointments.controller.ts
|   └── appointments.service.ts
|   └── appointments.module.ts
|   └── appointments.controller.spec.ts
|   └── appointments.service.spec.ts
├── common/
|   └── config/
|   └── validation/
|   └── utils/

## API Route Conventions

- Use **English** for all route names, query parameters, and Swagger descriptions.
- Use **plural, lowercase, resource-oriented** route names:
  - `/appointments`
  - `/offices`
- Prefer **nouns** in routes, not verbs.
- Use standard REST-style endpoints where possible:
  - `POST /appointments`
  - `GET /appointments`
  - `GET /appointments/:id`
  - `PATCH /appointments/:id`
  - `DELETE /appointments/:id`
- Keep routes **predictable and consistent** across features.
- Use **query parameters** for filtering, pagination, and optional search criteria.
- Use **path parameters** only for resource identification.
- Avoid action-style routes unless there is a strong domain reason.
- Keep route names short, explicit, and easy to understand.
- Return DTO-based responses, not entities.

### Route Design Rules

- One route should represent **one clear responsibility**.
- Prefer flat routes unless a nested route expresses a real ownership relationship.
- Keep filtering in query parameters, not in custom endpoint names.
- Use consistent naming for ids and references:
  - `:id`
  - `officeId`
- Reuse the same route conventions across all modules.

### Query Parameter Rules

- Use query parameters for optional filters such as:
  - `limit`
  - `status`
  - `officeId`
- Keep query parameter names aligned with DTO field names.
- Prefer explicit names over abbreviations.

### HTTP Semantics

- `GET` for read operations
- `POST` for create operations
- `PATCH` for partial updates
- `PUT` only for full replacement if actually needed
- `DELETE` for deletion

### Documentation

- Document all routes with Swagger.
- Keep summaries short and explicit.
- Ensure request DTOs, response DTOs, and route behavior stay aligned.

## DTO conventions
Rules:
- request DTOs define the API input contract
- response DTOs define the outward-facing response shape
- do **not** expose TypeORM entities directly from controllers unless there is a deliberate reason
- prefer explicit manual mapping between entity and response DTO
- keep DTOs small and readable

## Date/time conventions
Use **ISO-8601 strings** in the API contract:
- `startsAt`
- `endsAt`

Rules:
- show ISO date-time examples in Swagger
- validate date-time input explicitly
- avoid overcomplicating time zone handling unless the task explicitly requires it

## Validation
Enable global validation in `main.ts`.

Preferred configuration:
- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

Rules:
- validate body DTOs and query DTOs
- prefer standard `class-validator` decorators
- keep validation readable and beginner-friendly
- do not bypass validation with `any` or raw payload handling unless explicitly requested

## Swagger / OpenAPI
Swagger is the primary manual testing surface.

Configure Swagger in `main.ts`.
Use it to:
- expose the API
- document endpoints and DTOs
- provide example payloads where helpful
- manually verify the endpoints during development

Use a project-aligned title such as `Appointment API`.

## Persistence
Use TypeORM with SQLite.

Rules:
- keep persistence local-friendly and simple
- prefer a file-based SQLite database for the workshop
- register entities through NestJS modules
- inject repositories using standard NestJS/TypeORM patterns
- if `synchronize` is used, treat it as a local workshop convenience, not production guidance

## Entity conventions
Keep the entities simple.
Do not add relations, advanced indexing, or domain events unless explicitly requested.

## Service and controller responsibilities
Controllers should:
- receive input
- rely on DTO validation
- delegate to the service
- return response DTOs

Services should:
- implement create / find / update logic
- keep logic explicit and understandable
- perform mapping where appropriate

Do not place business logic in controllers.

## TypeORM conventions
Use standard NestJS repository injection patterns.

Rules:
- import entities in their corresponding module using `TypeOrmModule.forFeature([])`
- only import entities if needed (e.g. for a modelling a relationship) to reduce dependencies
- inject the repository into the service
- keep repository usage easy to read and explain
- avoid a custom repository layer unless there is a clear benefit

## Testing
The project should include:
- unit tests
- e2e/integration tests

Priorities:
1. service unit tests for core behavior
2. e2e tests for endpoint behavior and validation
3. a few clear invalid-input tests

Rules:
- keep tests readable and educational
- prefer a few strong examples over many shallow tests
- when implementing a feature, add or update tests in the same change

## Code style
- prefer straightforward TypeScript
- keep functions short and purposeful
- use explicit return types when they improve clarity
- avoid unnecessary generics and helper layers
- avoid premature abstraction
- keep comments sparse and useful

## Dependency policy
When suggesting a new dependency:
- prefer built-in NestJS features or already-installed libraries first
- justify why a new dependency is necessary
- avoid adding packages for convenience only

Avoid unless explicitly requested:
- heavy mapper frameworks
- CQRS/event-sourcing frameworks
- advanced pagination packages
- extra infrastructure such as queues, caching, or microservices

## Definition of done
A change is complete when most of the following apply:
- the code builds
- the endpoint works in Swagger
- validation is active where relevant
- response shapes are intentional
- tests cover the change appropriately
- the implementation stays understandable for workshop participants

## Safe change policy
Do not:
- rename core project concepts without reason
- replace the chosen tech stack
- add a frontend
- add auth unless explicitly requested
- add background jobs, messaging, or caching
- optimize for production complexity in a workshop-first example

## Useful commands
Prefer these commands when relevant:
- `npm run start:dev`
- `npm run test`
- `npm run test:e2e`
- `npm run lint`

If a command is missing from `package.json`, inspect the project before assuming it exists.

## Preferred implementation order
1. project structure
2. Swagger setup
3. SQLite + TypeORM configuration
4. entity + DTOs
5. controller + service for create / find / update
6. validation
7. tests
