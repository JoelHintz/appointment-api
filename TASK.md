# Extend the Appointment API

## Context

This project contains a small **NestJS** Appointment API in a public administration context. The application already manages offices and appointments.

Your task is to extend the existing API with a feature for appointment availability.

## Task

Add an API endpoint that allows a client to find available appointment slots for one office on one selected day.

The feature should fit into the existing API style and project structure. Some details are intentionally left open, so inspect the codebase before deciding how to implement it.

## Requirements

Your solution should include:

- a suitable REST endpoint
- clear input and output handling
- Swagger/OpenAPI documentation for manual testing
- validation where it is relevant
- unit tests for the most important behavior
- simple and readable business logic

## Acceptance Criteria

Your work is complete when:

- the endpoint can be called from Swagger
- the endpoint returns available slots for one office and one day
- already booked times are not returned as available
- invalid or incomplete input is handled reasonably
- meaningful unit tests were added or updated
- the implementation follows the existing project style
- you can explain the main parts of the solution

## Working with Claude Code in VS Code

Claude Code is available inside VS Code through the Claude Code panel. You can use it to ask questions about the project, inspect files, plan changes, edit code, and run commands.

Useful hints:

- Ask Claude to inspect relevant files before changing code.
- Reference files or folders with `@` when useful.
- Ask for a short plan before implementation.
- Review the plan and the generated changes before accepting them.
- If the solution becomes too large, ask Claude to simplify it.
- Do not paste this entire task file as your prompt. Write your own prompt based on your understanding.

## Reflection

After completing the task, briefly consider:

- Where did Claude Code help?
- What did you need to review or correct?
- Would you trust the result without running or reading it?
