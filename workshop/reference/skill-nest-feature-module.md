---
name: nest-feature-module
description: How a feature module is built in this Appointment API — file layout, module wiring, DTO and validation conventions, mapping, and test style. Use when adding a new entity with endpoints, or when checking whether an existing module follows the project's structure.
---

# Feature modules in this project

Every feature is one folder under `src/`, plural name, mirroring `offices/` and
`appointments/`. A new module should be almost boring to read next to them.

## File layout

```
src/<features>/
  <features>.module.ts       registers controller, service, entities
  <features>.controller.ts   receives input, delegates, returns DTOs
  <features>.service.ts      all business rules live here
  <features>.mapper.ts       optional; OfficesService maps inline instead
  entity/<feature>.entity.ts singular class name
  dto/create-<feature>.dto.ts
  dto/update-<feature>.dto.ts
  dto/find-<features>.dto.ts optional query DTO
  dto/<feature>-response.dto.ts
  *.spec.ts                  next to the file under test
```

## Wiring

`TypeOrmModule.forFeature([...])` in the feature module for every entity the
module's repositories touch — including foreign ones (`AppointmentsModule` also
registers `Office`). Then add the module to `imports` in `src/app.module.ts`.
`autoLoadEntities: true` picks the entity up; `synchronize: true` creates the
table on next start.

The global `ValidationPipe` is installed in `src/main.ts`, not in the modules.
Do not add a second one.

## Entities

Singular class name, `@PrimaryGeneratedColumn()` id, `!` on every property.
Timestamps are **ISO-8601 strings in plain string columns**, not `Date`.
Enums use `@Column({ type: 'simple-enum', enum: X, default: ... })`.
Relations are `@ManyToOne` with an explicit `@JoinColumn({ name: '<x>Id' })`.

## DTOs and validation

- Request shapes are validated with `class-validator`. Update DTOs derive from
  the create DTO via `PartialType` from `@nestjs/swagger`, which carries the
  validators over and makes them optional.
- Numeric fields need `@Type(() => Number)` alongside `@IsInt()` / `@Min()`.
  Without `@Type` a string like `"abc"` survives validation and reaches the
  repository.
- `@IsISO8601()` and `@IsDateString()` also accept full date-times. For a
  date-only value constrain it explicitly with
  `@Matches(/^\d{4}-\d{2}-\d{2}$/)`.
- Every property needs `@ApiProperty` / `@ApiPropertyOptional` with a realistic
  `example`, because Swagger is the manual testing surface.
- Fields the server owns (derived timestamps, initial status) do **not** belong
  in the create DTO at all.

## Services

All domain invariants live here — not in DTOs, not in the database. The service
injects repositories via `@InjectRepository`, throws `NotFoundException` for
unknown ids and `BadRequestException` for violated rules, and maps to response
DTOs before returning.

The rule of thumb: if a check needs to know the *stored* state of a record, it
cannot be a DTO decorator and must be a service check.

## Controllers

Thin. `@ApiTags` on the class, `@ApiOperation` plus a response type on each
route, `@ApiQuery` for optional query parameters. `@Param('id', ParseIntPipe)`
for path ids. No business logic, ever.

## Routes

Nouns, lowercase plural, path params for identity, query params for filters.
There is deliberately no `DELETE` and no bare `GET /offices/:id`.

## Tests

Unit tests with mocked repositories provided through `getRepositoryToken(X)` in a
`Test.createTestingModule`. Reuse the factories in `test/testdata.factory.ts`
where they fit. Cover the important behaviour — one happy path, one rejection,
one not-found — not every branch.

## Out of scope

No new dependencies. No auth, frontend, caching, queues, or background jobs. No
`npm run lint` as part of a change: it runs `eslint --fix` and rewrites files.
