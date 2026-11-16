<div align="center">

# BriefPilot API

### A backend for turning software project briefs into structured analyses, plans, and proposals.

[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-12-ea2845?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle-4169e1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Version](https://img.shields.io/badge/version-0.0.1-informational)](https://github.com/Soorena1090/BriefMate)

</div>

## Preview

<!-- TODO: Add a project screenshot at docs/screenshot.png. -->
![BriefPilot API preview - screenshot to be added](docs/screenshot.png)

No live demo URL is currently documented.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Usage](#usage)
  - [API Routes](#api-routes)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author and Contact](#author-and-contact)
- [Acknowledgments](#acknowledgments)

## About

BriefPilot API is a NestJS backend for organizing software project work around a client brief. It lets authenticated users manage projects and briefs, then uses a Groq-hosted language model to generate a structured brief analysis, implementation plan, and client proposal. Generated AI results are validated and stored with their related project data in PostgreSQL.

## Features

- 🔐 Register and log in with email/password; use JWT bearer tokens on protected routes.
- 📁 Create, view, update, and delete user-owned projects.
- 📝 Store one brief per project and retrieve or update it.
- 🔎 Generate and list structured analyses of project briefs.
- 🗺️ Generate and list implementation plans from the latest analysis.
- 📄 Generate and list proposals from an analysis and its plan.
- 🤖 Generate text with a Groq-compatible chat completion API.
- ✅ Validate request bodies and AI-generated JSON structures.

## Tech Stack

| Group | Technologies |
| --- | --- |
| Frontend | None in this repository; this project is an API. |
| Backend | Node.js 22 (Docker base image), TypeScript 6, NestJS 12, Express |
| Database | PostgreSQL, `pg`, Drizzle ORM and Drizzle Kit |
| AI and validation | Groq API through the OpenAI SDK, Zod, `class-validator`, `class-transformer` |
| Authentication | Passport, `passport-jwt`, `@nestjs/jwt`, `bcrypt` |
| Developer tools | npm, Vitest, Supertest, Oxlint, Prettier, Docker |

Dependency versions are recorded in [package-lock.json](package-lock.json). Node.js 22 is the version used by the Dockerfile; the package does not declare a separate Node.js engine constraint.

## Architecture

```text
.
├── src/
│   ├── auth/                 # Registration, login, JWT strategy and guard
│   ├── projects/             # Project CRUD routes and service
│   ├── briefs/               # Per-project brief routes and service
│   ├── analyses/             # Brief analysis generation and history
│   ├── project-plans/        # Implementation plan generation and history
│   ├── proposals/            # Proposal generation and history
│   ├── ai/                   # Groq provider, prompts, DTOs and Zod schemas
│   ├── database/             # PostgreSQL pool, Drizzle setup and schema
│   ├── users/                # User persistence service
│   ├── app.module.ts         # Root NestJS module
│   └── main.ts               # Bootstrap, CORS, validation and HTTP listener
├── drizzle/                  # PostgreSQL migration SQL and migration metadata
├── test/                     # End-to-end tests
├── .env.sample               # Environment variable template
├── Dockerfile                # Multi-stage production image
├── drizzle.config.ts         # Drizzle Kit PostgreSQL configuration
├── package.json              # Scripts and dependency declarations
└── vitest.config*.ts          # Unit and end-to-end test configuration
```

The API controllers authenticate requests where required, services enforce project ownership and coordinate persistence, and the AI workflows validate generated JSON before saving it.

## Getting Started

### Prerequisites

- Node.js 22 and npm.
- A running PostgreSQL database. The repository does not pin a PostgreSQL server version or provision a database.
- A Groq API key and a model identifier available to that key.

### Installation

1. Install dependencies and create a local environment file:

   ```bash
   npm ci
   cp .env.sample .env
   ```

2. Edit `.env` and set `DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`, and `GROQ_MODEL`. See the variable table below.
3. Apply the checked-in database migrations:

   ```bash
   npm run db:migrate
   ```

4. Start the development server:

   ```bash
   npm run start:dev
   ```

The API listens on `http://localhost:3000` by default. Configure a different port with `PORT`.

### Environment Variables

The `.env.sample` file lists these settings. Replace the example placeholders with values for your environment; keep `.env` out of version control.

| Variable | Description | Example | Required |
| --- | --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection URL used by the `pg` pool and Drizzle migrations. | `postgresql://USER:PASSWORD@localhost:5432/briefpilot` | Yes |
| `JWT_SECRET` | Secret used to sign and verify JWTs. Use a private, sufficiently random value. | `replace-with-a-long-random-secret` | Yes |
| `GROQ_API_KEY` | API key for the configured Groq endpoint. | `your-groq-api-key` | Yes |
| `GROQ_MODEL` | Model identifier accepted by the Groq API. | `your-enabled-model-id` | Yes |
| `PORT` | HTTP port. Defaults to `3000` when unset in a local run. | `3000` | No |
| `FRONTEND_URL` | Additional allowed CORS origin; the two localhost port-5173 origins are also allowed. | `http://localhost:5173` | No |
| `NODE_ENV` | Conventional Node.js environment setting; the application does not read it directly. | `development` | No |

`GROQ_API_KEY` and `GROQ_MODEL` are read when the AI provider is initialized. `JWT_SECRET` is required when the authentication module is initialized. Configure them before starting the API.

### Running Locally

For development with file watching:

```bash
npm run start:dev
```

For a production-mode local run, build first:

```bash
npm run build
npm run start:prod
```

The `start:prod` script runs `node dist/main`. Apply database migrations separately before using database-backed endpoints.

## Usage

Protected routes require an `Authorization: Bearer <access-token>` header. Register and log in first:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"correct-horse-battery"}'
```

Registration returns a message and a user object containing `id`, `email`, and `createdAt` (not the password hash). Log in to receive a token:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"correct-horse-battery"}'
```

The login response has this shape:

```json
{
  "accessToken": "<JWT>",
  "tokenType": "Bearer"
}
```

Access tokens expire after one hour.

Set `TOKEN` to the returned JWT and create a project. Copy the returned project `id` into `PROJECT_ID` for the following requests:

```bash
TOKEN="<JWT>"
curl -X POST http://localhost:3000/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Client portal","description":"A portal for a client project"}'
```

Create a brief (30–10,000 characters), then run the generation steps in order:

```bash
PROJECT_ID="<project-uuid>"

curl -X POST "http://localhost:3000/projects/$PROJECT_ID/brief" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Build a secure client portal where customers can review project progress and exchange project updates with their team."}'

# Create an analysis from the project's brief.
curl -X POST "http://localhost:3000/projects/$PROJECT_ID/analyses" \
  -H "Authorization: Bearer $TOKEN"

# Generate a plan from the latest analysis.
curl -X POST "http://localhost:3000/projects/$PROJECT_ID/plan" \
  -H "Authorization: Bearer $TOKEN"

# Generate a proposal from the latest analysis and its plan.
curl -X POST "http://localhost:3000/projects/$PROJECT_ID/proposals" \
  -H "Authorization: Bearer $TOKEN"
```

Generation endpoints return the saved record. An analysis includes `summary`, `requirements`, and `questions`; a plan includes `title`, `overview`, `phases`, `deliverables`, `assumptions`, and `risks`; a proposal includes `introduction`, `projectUnderstanding`, `scopeIn`, `scopeOut`, `deliverables`, `timeline`, and `assumptions`.

### API Routes

All routes below are relative to the server origin. Registration, login, the health routes, and `/database-check` are public. All other routes require a valid bearer token.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Return service health status. |
| `GET` | `/health/db` | Check the database connection. |
| `GET` | `/database-check` | Return database/schema diagnostics. |
| `POST` | `/auth/register` | Register with email and password. |
| `POST` | `/auth/login` | Log in and receive a JWT. |
| `GET` | `/auth/me` | Return the authenticated user identity. |
| `GET`, `POST` | `/projects` | List or create the authenticated user's projects. |
| `GET`, `PATCH`, `DELETE` | `/projects/:id` | Read, update, or delete an owned project. |
| `GET`, `POST`, `PATCH`, `DELETE` | `/projects/:projectId/brief` | Read, create, update, or delete the project's brief. |
| `GET`, `POST` | `/projects/:projectId/analyses` | List analyses or analyze the current brief. |
| `GET`, `POST` | `/projects/:projectId/plan` | List or generate project plans. |
| `GET`, `POST` | `/projects/:projectId/proposals` | List or generate proposals. |
| `POST` | `/ai/test` | Generate a text response for a prompt. |

The global validation pipe rejects unknown request fields and transforms validated inputs. Project titles must be 3–150 characters; project descriptions are limited to 2,000 characters; brief content must be 30–10,000 characters. See the DTOs in `src/` for request constraints.

The current `/health/db` implementation may fail: its database helper accesses `result.row`, while node-postgres query results expose `rows`. Do not rely on this route as a readiness check until that is corrected.

## Testing

Run the Vitest suites and related checks with the package scripts:

```bash
npm test
npm run test:e2e
npm run test:cov
npm run lint
```

End-to-end tests use `vitest.config.e2e.ts`; the API's required environment variables must be configured for application initialization.

## Deployment

The repository includes a multi-stage Dockerfile based on `node:22-bookworm-slim`. Build and run the image with an environment file:

```bash
docker build -t briefpilot-api .
docker run --rm --env-file .env -p 3000:3000 briefpilot-api
```

The provided `.env.sample` sets `PORT=3000`, which overrides the image's `PORT=7860`; the command above maps port `3000` accordingly. The image runs the compiled application as the non-root `node` user. If you omit `PORT` from the environment file, map the image's default port `7860` instead. Apply Drizzle migrations from an environment with the development dependencies installed before deploying a schema that requires them:

```bash
npm ci
npm run db:migrate
```

## Roadmap

- [x] User authentication and user-owned project management.
- [x] Project briefs, AI-generated analyses, implementation plans, and proposals.
- [x] PostgreSQL persistence and checked-in Drizzle migrations.

No upcoming work is currently documented in the repository.

## Contributing

Contributions are welcome. Fork the repository, create a focused branch, make and test your change, then open a pull request with a concise description and relevant context. Run the tests and linter before submitting. No commit-message convention is documented; use clear, descriptive commit messages.

## License

No `LICENSE` file is present, and `package.json` currently declares the package as `UNLICENSED`. TODO: Choose and add a license before redistributing this project.

## Author and Contact

- GitHub: [Soorena1090/BriefMate](https://github.com/Soorena1090/BriefMate)
- Name, LinkedIn, and email: TODO — add the maintainer's preferred contact details.

## Acknowledgments

- [NestJS](https://nestjs.com/) for the application framework.
- [Drizzle ORM](https://orm.drizzle.team/) for PostgreSQL access and migrations.
- [Groq](https://groq.com/) for the configured language-model API.
- [Vitest](https://vitest.dev/) for unit and end-to-end test execution.
