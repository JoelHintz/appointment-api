# Extend the Appointment API

## Context

This project contains a small **NestJS** Appointment API in a public administration context. The application already manages **offices** and **appointments**.

Appointments always start on the hour and have a fixed duration of one hour. They need to have a office assigned.

## Task

Implement an endpoint that returns **available appointment slots** for a selected office on a given date.

The feature should integrate into the existing API style and project structure.  
Some implementation details are intentionally left open. Inspect the codebase before making design decisions.

## Working Mode

- Work in groups of **2–3 students**
- One working setup per group is sufficient
- If you are not familiar with NestJS or TypeORM, ask Claude to walk you through an existing endpoint first

## Requirements

- Provide a suitable **REST endpoint**
- Handle input and output properly
- Add Swagger/OpenAPI documentation (sufficient for manual testing)
- Implement **validation** where appropriate (e.g. date format, allowed values, completeness)
- Add **focused unit tests** for the most important behavior
- Keep business logic simple and readable

## Acceptance Criteria

- The endpoint can be called via Swagger
- The endpoint returns **available appointment slots** for one office and one day
- Only valid hourly slots are returned (based on the existing appointment rules)
- Already booked times are **excluded**
- Invalid or incomplete input is handled appropriately
- Meaningful unit tests are added
- The implementation follows the existing project style
- You can explain the main parts of your solution

## Tips for Working with Claude Code

- Reference files or folders using `@` (e.g. `@src/appointments`)
- Ask Claude to inspect existing code **before** proposing new code
- Request a **short plan**, review it, then proceed step by step
- Write your own short prompts - do not paste this entire task file into Claude

## Before You Finish

As a group, verify the following:

- **Explain it**
  Can everyone explain the chosen endpoint and where the business logic is implemented?

- **Run the tests**
  Run `npm run test`. Do all tests pass?

- **Test in Swagger**  
  Try your endpoint with both valid and invalid input

- **Review the diff**  
  Run `git diff` together. Is anything unexpected?

You may push your solution to a new branch if you want to keep it.
