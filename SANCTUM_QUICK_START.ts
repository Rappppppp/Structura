/**
 * QUICK START - SANCTUM COOKIE-BASED AUTH
 * Simple setup and testing guide
 */

const QUICK_SETUP = `
BEFORE RUNNING FRONTEND:
========================

1. Laravel Side Setup (5 minutes)
   a) composer require laravel/sanctum
   b) php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
   c) php artisan migrate
   d) Update .env:
      SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173
      SESSION_DOMAIN=localhost
   e) Create API routes with Sanctum middleware (see SANCTUM_SETUP_GUIDE.ts)

2. Frontend Side Setup (Already Done ✅)
   a) ✅ .env.local configured with VITE_API_BASE_URL
   b) ✅ src/lib/api.client.ts with Sanctum support
   c) ✅ AuthContext with initializeSanctum()
   d) ✅ QueryClientProvider in main.tsx
   e) ✅ All API services created
   f) ✅ All hooks created

3. Verify Setup
   a) npm install (should have axios already installed)
   b) npm run dev
   c) Open http://localhost:5173
   d) Check browser DevTools Network tab during login

4. Test Login Flow
   a) Go to /login
   b) Enter test credentials
   c) Network tab should show:
      - GET /sanctum/csrf-cookie ✅
      - POST /api/auth/login ✅
   d) After login, you should see user profile
   e) Check cookies are being sent with subsequent requests
`;

const WHAT_HAPPENS_WHEN_YOU_LOGIN = `
1. User submits login form
   ↓
2. src/contexts/AuthContext.tsx → handleLogin() called
   ↓
3. useLoginMutation() executes POST /api/auth/login
   ↓
4. src/lib/api.client.ts request interceptor:
   - Reads XSRF-TOKEN from meta tag
   - Adds X-CSRF-TOKEN: <token> header
   - Browser adds Cookie: XSRF-TOKEN=...; LARAVEL_SESSION=... (automatically)
   ↓
5. Laravel backend receives request
   - Validates X-CSRF-TOKEN header matches XSRF-TOKEN cookie
   - Validates LARAVEL_SESSION cookie
   - Checks email/password credentials
   - Creates new authenticated session
   - Responds with user data + new LARAVEL_SESSION cookie
   ↓
6. Frontend receives response
   - Mutation.onSuccess() invalidates auth queries
   - useCurrentUser() refetches user profile
   - AuthContext updates user state
   - Redirects to /dashboard
   ↓
7. All subsequent requests include cookies automatically:
   - Browser sends: Cookie: XSRF-TOKEN=...; LARAVEL_SESSION=...
   - axios adds: X-CSRF-TOKEN: ... (from meta/cookie)
   - Laravel validates both
`;

const DEBUGGING_STEPS = `
If something isn't working:

Step 1: Verify Laravel API is running
  - Open http://localhost:8000/api/auth/login in postman/curl
  - Should get an error (expected - we didn't send credentials)
  - Check laravel.log for errors

Step 2: Verify CSRF endpoint works
  - Open http://localhost:8000/sanctum/csrf-cookie in browser
  - Check browser DevTools -> Network tab
  - Response headers should have Set-Cookie: XSRF-TOKEN=...
  - Browser -> Application -> Cookies should show XSRF-TOKEN

Step 3: Test login endpoint with curl
  - See MANUAL_TESTING_CURL in SANCTUM_AUTH_FLOW.ts
  - Should return { "user": {...} }

Step 4: Check frontend environment
  - .env.local: VITE_API_BASE_URL=http://localhost:8000/api
  - Open localhost:5173 -> DevTools -> Console
  - No CORS errors? Good!
  - See 401 errors? Check Laravel is returning proper responses

Step 5: Check cookies are being sent
  - Login to frontend
  - Open DevTools -> Network tab
  - Click any API request
  - Go to "Request Headers" section
  - Should show: Cookie: XSRF-TOKEN=...; LARAVEL_SESSION=...
  - Not seeing them? Problem with withCredentials or CORS

Step 6: Check CSRF token validation
  - Similar check: look for X-CSRF-TOKEN header in requests
  - Should not be empty
  - If getting 419 errors, token mismatch

If still stuck:
  1. Read SANCTUM_AUTH_FLOW.ts for detailed explanation
  2. Check TROUBLESHOOTING section in SANCTUM_SETUP_GUIDE.ts
  3. Run curl commands manually to isolate frontend vs backend issues
`;

const FILE_STRUCTURE_CREATED = `
Backend Configuration Files:
  .env.local ✅
  
Core HTTP Client:
  src/lib/api.client.ts ✅ - Sanctum with cookies
  src/lib/token.ts ⚠️ - Not needed for cookies, but kept for reference
  src/lib/queryClient.ts ✅
  src/lib/errorHandler.ts ✅
  src/lib/authGuard.ts ✅

API Services (6 services):
  src/api/auth.service.ts ✅ - Login, logout, getCurrentUser
  src/api/projects.service.ts ✅
  src/api/tasks.service.ts ✅
  src/api/teams.service.ts ✅
  src/api/clients.service.ts ✅
  src/api/invoices.service.ts ✅
  src/api/communication.service.ts ✅

React Query Hooks:
  src/hooks/queries/ ✅ - All data fetching hooks
  src/hooks/mutations/ ✅ - All mutation hooks

Integration:
  src/main.tsx ✅ - QueryClientProvider
  src/contexts/AuthContext.tsx ✅ - initializeSanctum(), cookie-based auth
  src/stores/auth.store.ts ✅ - Updated for API-based auth

Documentation:
  IMPLEMENTATION_GUIDE.md ✅ - Complete implementation roadmap
  SANCTUM_SETUP_GUIDE.ts ✅ - Laravel configuration
  SANCTUM_AUTH_FLOW.ts ✅ - How authentication works
  SANCTUM_QUICK_START.ts ✅ - This file
`;

const NEXT_IMMEDIATE_STEPS = `
1. Make sure Laravel Sanctum is installed and configured
2. Verify .env.local has correct VITE_API_BASE_URL
3. npm run dev to start frontend
4. Login with test user
5. Check DevTools Network tab for cookies being sent
6. If cookies showing, you're good!
7. If not, follow DEBUGGING_STEPS above
8. Gradually migrate pages from mockData to React Query hooks

Key File to Watch:
  - src/lib/api.client.ts - This handles all HTTP communication
  - Logs CSRF token, cookies, and errors
  - Add console.log() if debugging
`;

export {
  QUICK_SETUP,
  WHAT_HAPPENS_WHEN_YOU_LOGIN,
  DEBUGGING_STEPS,
  FILE_STRUCTURE_CREATED,
  NEXT_IMMEDIATE_STEPS,
};
