# Task: Implement Office Availability Endpoint

You are working in a NestJS + TypeScript Appointment API.

Please implement:

```http
GET /offices/:id/availability?date=2026-06-30
```

## Goal

Return all available one-hour appointment slots for the selected office on the given date.

## Domain Rules

- An appointment belongs to exactly one office.
- An appointment always lasts exactly one hour.
- An appointment starts at a full hour.
- An office must not have overlapping appointments.
- Adjacent appointments are allowed.
- Availability must exclude already booked slots.

## Implementation Requirements

- Follow the existing feature-first project structure.
- Use the existing Office and Appointment entities.
- Add a query DTO for the `date` parameter.
- Add a response DTO for availability slots.
- Add Swagger decorators.
- Add or update unit tests.
- Keep the implementation simple and readable.
- Do not introduce new dependencies.
- Do not add authentication, frontend code, caching, queues, or production-only abstractions.

## Before Editing

First inspect the existing controller, service, DTO, entity, and test patterns.

Then propose a short implementation plan.

After that, implement the change.

## Expected Response Shape

```json
[
  {
    "officeId": 1,
    "startsAt": "2026-06-30T08:00:00.000Z",
    "endsAt": "2026-06-30T09:00:00.000Z"
  }
]
```

## Validation

The endpoint should reject invalid dates.

## Tests

Cover at least:

- returns slots when no appointments exist
- excludes occupied one-hour slots
- allows adjacent slots
- returns an empty array if no slot is available
- rejects invalid date query
