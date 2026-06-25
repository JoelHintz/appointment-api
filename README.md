# Appointment API

This repository contains a small **NestJS + TypeScript** backend project for a hands-on session on AI-assisted software engineering with Claude Code.

The application models a simplified appointment booking service for public administration. Citizens can book appointments at preconfigured public offices, such as a citizens office office.

## What the App Can Do

The API provides endpoints to manage:

- **Offices**: public offices where appointments can be booked
- **Appointments**: one-hour appointments assigned to one office

Core rules:

- An appointment belongs to exactly one office.
- An appointment always lasts exactly one hour.
- Appointments start at a full hour.
- An office cannot have two appointments at the same start time.
- Seed data creates initial offices for the workshop.

The intended student task is to implement an endpoint that returns available appointment slots for an office.

## Tech Stack

- NestJS
- TypeScript
- REST
- Swagger / OpenAPI
- SQLite + TypeORM
- class-validator / class-transformer
- Jest

## Getting Started

Install dependencies:

```bash
npm ci
```

Start the API in development mode:

```bash
npm run start:dev
```

Open Swagger UI:

```txt
http://localhost:3000/api
```

## Useful Commands

```bash
npm run start:dev
npm run test
npm run test:e2e
npm run lint
```

If a command is not available, check `package.json` first.

## Workshop Context

This project is intentionally small and backend-focused. It does not include authentication, a frontend, production infrastructure, queues, caching, or complex deployment setup.

The goal is to practice how Claude Code can help implement a clearly scoped backend feature while still requiring students to review, understand, test, and validate the generated code.

## Suggested Claude Code Task

A prepared prompt is available at:

```txt
prompts/availability-endpoint.prompt.md
```

Use it in Claude Code to implement the availability endpoint.
