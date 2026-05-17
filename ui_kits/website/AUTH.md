# PYVEX — Auth (Clerk) integration

This folder wires the PYVEX login page to **Clerk** using the publishable key only.

## Files

- `clerk.js` — Loads the Clerk browser SDK on demand. Exposes `window.loadClerk()` and `window.clerkErrMessage()`. Contains the publishable key (safe to embed).
- `LoginPage.jsx` — React component. Handles sign-in, sign-up, email-OTP verification, OAuth (Google + Apple), forgot-password, and post-auth redirect.
- `login.html` — Mounts `LoginPage`. Loads `clerk.js` before the JSX.
- `verify.html` — OAuth redirect target. Calls `clerk.handleRedirectCallback()` and forwards to `index.html`.

## Keys

| Key | Type | Where it lives |
|---|---|---|
| `pk_test_aW1tdW5lLWJpc29uLTE4...` | Publishable | `clerk.js` — safe in frontend, used to identify the Clerk instance. |
| `sk_test_...` | **Secret** | **NEVER in this codebase.** Belongs on your server, behind auth. **Rotate immediately** — it was pasted in chat. |

The JWKS public key (`-----BEGIN PUBLIC KEY-----...`) is used by your **backend** to verify session JWTs issued by Clerk. Don't ship it to the frontend.

## Flow

```
                                    ┌──────────────────────────────────┐
                                    │  login.html  (mounts LoginPage)  │
                                    └────────────┬─────────────────────┘
                                                 │
                                  ┌──────────────┼──────────────┐
                                  ▼              ▼              ▼
                            Google / Apple  Email + pwd      Sign up
                            (OAuth)         signIn.create    signUp.create
                                  │              │              │
                                  │              │              ▼
                                  │              │       prepareEmailAddress
                                  │              │       Verification
                                  │              │              │
                                  ▼              │              ▼
                         verify.html             │       6-digit OTP form
                         handleRedirect          │              │
                         Callback                │              ▼
                                  │              │       attemptEmail
                                  │              │       Verification
                                  ▼              ▼              ▼
                              ┌──────────────────────────────────────┐
                              │  clerk.setActive({session}) → index  │
                              └──────────────────────────────────────┘
```

## What you still need to configure in Clerk dashboard

1. **Enable Google & Apple OAuth** under *User & Authentication → Social connections*.
2. **Add redirect URLs.** Under *Paths*, add `https://<your-domain>/ui_kits/website/verify.html` to the allowed redirect URLs (and `http://localhost:...` for local testing).
3. **Email verification.** Should be on by default for new sign-ups via email code.

## Demo-mode fallback

If the SDK fails to load (offline, blocked CDN, etc.), the page silently falls back to a demo flow — the submit button still works, the success screen still appears, but no real user is created. The bottom-right status pill changes from `CLERK · LIVE` to `DEMO MODE` so you can tell at a glance.

## Backend session verification (Node example)

When your backend receives an API request from a signed-in user, verify the session token using the JWKS public key:

```js
import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// In your request handler:
const session = await clerk.verifyToken(req.headers.authorization?.replace('Bearer ', ''));
// → { sub: 'user_xxx', sid: 'sess_xxx', ... }
```

Never bundle `CLERK_SECRET_KEY` into the frontend.
