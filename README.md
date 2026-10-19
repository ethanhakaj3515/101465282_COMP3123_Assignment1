# COMP3123 Assignment 1 — Secure Employee API

Node.js, Express, MongoDB, and Mongoose API with JWT authentication and per-user employee ownership.

## Setup

1. Install Node.js 20 or newer and MongoDB locally, or create a MongoDB Atlas database.
2. Run `npm install`.
3. Copy `.env.example` to `.env`; set `MONGODB_URI` and replace `JWT_SECRET` with a unique random secret of at least 32 characters. Never commit `.env`.
4. Start MongoDB, then run `npm start` (or `npm run dev`). The API listens on port 3000 by default.
5. Import `postman/COMP3123-Assignment1.postman_collection.json` into Postman and set `baseUrl` to `http://localhost:3000`.

Database name is fixed to `comp3123_assignment1`. The health route is `GET /health`.

## Endpoints

| Method | Route | Auth | Success |
| --- | --- | --- | --- |
| POST | `/api/v1/user/signup` | No | 201 |
| POST | `/api/v1/user/login` | No | 200 with JWT |
| GET | `/api/v1/emp/employees` | Bearer JWT | 200 |
| POST | `/api/v1/emp/employees` | Bearer JWT | 201 |
| GET | `/api/v1/emp/employees/:eid` | Bearer JWT | 200 |
| PUT | `/api/v1/emp/employees/:eid` | Bearer JWT | 200 |
| DELETE | `/api/v1/emp/employees?eid=<id>` | Bearer JWT | 204 |

Employee queries always include the authenticated user's ID. A record owned by another user is returned as 404, including update and delete attempts. The client cannot set the owner.

## Security and operations

Passwords are hashed with bcrypt and excluded from response serialization. JWTs are signed with `JWT_SECRET`, expire after `JWT_EXPIRES_IN`, and are sent in `Authorization: Bearer <token>`. Helmet sets security headers, `express-validator` checks input, the API is rate limited, and a stricter limit protects signup and login. Exceeding a limit returns 429. Logs are JSON lines in `logs/app.log`; they omit tokens, passwords, and request bodies. Vercel deployments may have an ephemeral/read-only filesystem, so use the platform's logs for persistent operational records. The health endpoint confirms process liveness, not database readiness.

## Verification and submission notes

Run `npm test` for the automated API checks (15 checks passed). The Postman collection includes success, validation, authentication, ownership, and rate-limit scenarios. A real Postman desktop run on October 19, 2026 passed 23 assertions across 20 requests with no failures. A subsequent Postman request returned 429 after additional login attempts exhausted the authentication limit. Another programmatic HTTP run passed 24 checks covering ownership in both directions, invalid/expired JWTs, employee validation, and Helmet headers. Local evidence is in the accompanying evidence document and screenshots. Vercel deployment and MongoDB Atlas interface screenshots remain outstanding.

For Vercel, set `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `NODE_ENV` in project environment settings, then deploy. `vercel.json` routes requests to the serverless entry point. Do not publish database credentials.

Public repository: https://github.com/ethanhakaj3515/101465282_COMP3123_Assignment1

The source ZIP excludes `node_modules` and credentials. Supply the accompanying evidence document and add the deployed URL after hosting is complete. No D2L submission has been made.
