/* PYVEX — Clerk auth loader.
 *
 * Uses ONLY the publishable key, which is safe to embed in frontend.
 * The secret key (sk_test_...) MUST live on your server, never here.
 */

const CLERK_PUBLISHABLE_KEY = 'pk_test_bm90YWJsZS10b3VjYW4tNTkuY2xlcmsuYWNjb3VudHMuZGV2JA';
const CLERK_FRONTEND_API    = 'https://notable-toucan-59.clerk.accounts.dev';

/**
 * Loads the Clerk browser SDK once and resolves with the singleton instance.
 *
 * The Clerk script auto-initializes `window.Clerk` when you include the
 * `data-clerk-publishable-key` attribute. We then just call `.load()` on it.
 * Do NOT do `new Clerk(...)` after — that creates a second, broken instance.
 */
var _clerkPromise = null;
function loadClerk() {
  if (_clerkPromise) return _clerkPromise;

  _clerkPromise = new Promise((resolve, reject) => {
    // Already loaded?
    if (window.Clerk && window.Clerk.loaded) {
      resolve(window.Clerk);
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-clerk-publishable-key', CLERK_PUBLISHABLE_KEY);
    script.src = `${CLERK_FRONTEND_API}/npm/@clerk/clerk-js@5/dist/clerk.browser.js`;

    script.onload = async () => {
      try {
        if (!window.Clerk) {
          reject(new Error('Clerk SDK loaded but window.Clerk is undefined.'));
          return;
        }
        if (!window.Clerk.loaded) {
          await window.Clerk.load();
        }
        resolve(window.Clerk);
      } catch (err) {
        console.error('[Clerk] load() failed:', err);
        reject(err);
      }
    };

    script.onerror = () => {
      reject(new Error(`Failed to load Clerk SDK from ${script.src}. Check the frontend API URL and your network.`));
    };

    document.head.appendChild(script);
  });

  return _clerkPromise;
}

/** Friendly error message extractor for ClerkAPIResponseError. */
function clerkErrMessage(err) {
  if (!err) return 'Something went wrong. Try again.';
  if (Array.isArray(err.errors) && err.errors.length) {
    const e = err.errors[0];
    return e.longMessage || e.message || 'Auth error.';
  }
  return err.message || 'Something went wrong. Try again.';
}

Object.assign(window, {
  loadClerk,
  clerkErrMessage,
  CLERK_PUBLISHABLE_KEY,
  CLERK_FRONTEND_API,
});
