# CLAUDE.md: appointment-api

## Project

This repository contains a small **NestJS + TypeScript** Appointment API for a public administration context.

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

## Guidelines

- Follow the existing code style and project structure.
- Optimize for clarity and teaching value.
- Avoid unnecessary abstractions and new dependencies.

## Where to Look

Inspect the existing code in `src/appointments/` and `src/offices/` before adding anything.

## Note for Claude

When helping with this hands-on session, explain existing patterns before generating new code. If a plan gets too large, suggest simplifying it.
