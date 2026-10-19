# COMP3123 Assignment 1 — Local API run summary

Executed the saved Postman collection with Newman against the API running locally on `127.0.0.1`. The collection inserted synthetic sample users in the dedicated `comp3123_assignment1` database. This summary omits request and response bodies, credentials, and JWTs.

- Requests: 20 (failed: 0)
- Assertions: 23 (failed: 0)

| Request | Result | Assertion checks |
|---|---:|---:|
| GET health | HTTP 200 | 2/2 PASS |
| Signup User A | HTTP 201 | 2/2 PASS |
| Duplicate User A (409) | HTTP 409 | 1/1 PASS |
| Signup User B | HTTP 201 | 1/1 PASS |
| Invalid Signup (400) | HTTP 400 | 1/1 PASS |
| Login User A | HTTP 200 | 2/2 PASS |
| Login User B | HTTP 200 | 1/1 PASS |
| Invalid Login (401) | HTTP 401 | 1/1 PASS |
| List without JWT (401) | HTTP 401 | 1/1 PASS |
| Create Employee A | HTTP 201 | 1/1 PASS |
| List User A Employees | HTTP 200 | 1/1 PASS |
| Get User A Employee | HTTP 200 | 1/1 PASS |
| Update User A Employee | HTTP 200 | 1/1 PASS |
| Create Employee B | HTTP 201 | 1/1 PASS |
| User A Cannot Read User B Employee (404) | HTTP 404 | 1/1 PASS |
| User A Cannot Update User B Employee (404) | HTTP 404 | 1/1 PASS |
| User A Cannot Delete User B Employee (404) | HTTP 404 | 1/1 PASS |
| Invalid Employee ID (400) | HTTP 400 | 1/1 PASS |
| Delete User A Employee (204) | HTTP 204 | 1/1 PASS |
| Repeat login 11 times to observe 429 | HTTP 401 | 1/1 PASS |

The collection covers health, signup/login validation, missing authentication, employee create/read/update/delete, invalid IDs, and cross-user access isolation. The separate manual rate-limit scenario is documented in the collection; this run made one request for that scenario and did not repeat it to trigger `429`.

## Live Vercel verification — October 19, 2026

The deployed health route `GET https://101465282-comp-3123-assignment1.vercel.app/health` returned HTTP 200. A separate synthetic-account HTTP run against the hosted API passed all 7 checks: signup (201), login (200), employee create (201), list (200), read (200), update (200), and delete (204). No access token, password, or request body is included in this report. The live health screenshot is in `outputs/assignment-evidence`. Atlas showed the access-list entry as active; its screenshot was omitted because the page also displayed an unrelated home network address.
