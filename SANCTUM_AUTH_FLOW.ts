/**
 * SANCTUM COOKIE-BASED AUTH FLOW
 * Step-by-step explanation of how authentication works
 */

// ============================================================================
// HOW LARAVEL SANCTUM COOKIE-BASED AUTH WORKS
// ============================================================================

const AUTHENTICATION_FLOW = {
  STEP_1_INITIALIZE: {
    when: 'App mounts (App.tsx or on AuthProvider mount)',
    what_happens: `
      1. AuthProvider calls initializeSanctum()
      2. This makes GET request to /sanctum/csrf-cookie
      3. Laravel responds with Set-Cookie headers containing XSRF-TOKEN
      4. Browser automatically stores cookies
    `,
    network_tab: `
      Request:  GET /sanctum/csrf-cookie
      Response Headers:
        Set-Cookie: XSRF-TOKEN=abc123def456...; Path=/; HttpOnly; SameSite=Lax
        Set-Cookie: LARAVEL_SESSION=xyz789uyt456...; Path=/; HttpOnly; SameSite=Lax
    `,
    why: 'Prevents CSRF attacks by establishing a secure token',
  },

  STEP_2_LOGIN: {
    when: 'User submits login form',
    what_happens: `
      1. User enters email + password in login form
      2. Component calls useAuth().login(email, password)
      3. LoginMutation calls POST /api/auth/login with credentials
      4. Browser automatically includes cookies from Step 1
      5. axios automatically includes X-CSRF-TOKEN header (from XSRF-TOKEN cookie)
      6. Laravel validates CSRF token + credentials
      7. Laravel creates authenticated session
      8. Laravel responds with:
         - Updated LARAVEL_SESSION cookie
         - User data in response body
      9. Frontend updates AuthContext with user data
    `,
    network_tab: `
      Request:  POST /api/auth/login
      Headers:
        Cookie: XSRF-TOKEN=abc123...; LARAVEL_SESSION=old123...
        X-CSRF-TOKEN: abc123... (axios adds this automatically)
      Body:
        { "email": "user@example.com", "password": "password123" }
      
      Response:
      Headers:
        Set-Cookie: LARAVEL_SESSION=new456...; Path=/; HttpOnly; SameSite=Lax
      Body:
        { "user": { "id": 1, "email": "user@example.com", "name": "John", "role": "admin" } }
    `,
    why: 'Authenticates user and establishes session',
  },

  STEP_3_AUTHENTICATED_REQUESTS: {
    when: 'All subsequent API calls',
    what_happens: `
      1. Component calls useProjects() hook
      2. React Query makes GET /api/projects request
      3. Browser automatically includes cookies (withCredentials: true in axios)
      4. axios automatically includes X-CSRF-TOKEN header
      5. Laravel validates XSRF-TOKEN + session cookie
      6. If valid, returns data
      7. If invalid (401), response interceptor catches it
    `,
    network_tab: `
      Request:  GET /api/projects
      Headers:
        Cookie: XSRF-TOKEN=abc123...; LARAVEL_SESSION=new456...
        X-CSRF-TOKEN: abc123...
      
      Response:
      200 OK - returns projects data
      OR
      401 Unauthorized - if session expired
    `,
    why: 'Maintains authenticated state without tokens in frontend code',
  },

  STEP_4_SESSION_EXPIRY: {
    when: 'Session timeout (default 120 minutes) or manual logout',
    what_happens: `
      Case A: Timeout
        1. User makes API request after session expires
        2. Laravel cannot validate LARAVEL_SESSION cookie
        3. Laravel responds with 401 Unauthorized
        4. Response interceptor in api.client.ts catches 401
        5. Dispatches 'auth:logout' event
        6. AuthContext listens and clears user data
        7. Redirects to /login page
      
      Case B: Manual Logout
        1. User clicks logout button
        2. Component calls useAuth().logout()
        3. LogoutMutation calls POST /api/auth/logout
        4. Browser includes current session cookie
        5. Laravel validates and invalidates session
        6. Laravel responds with success + Set-Cookie to clear LARAVEL_SESSION
        7. Frontend clears React Query cache
        8. Redirects to /login page
    `,
    network_tab_401: `
      Request:  GET /api/projects
      Response: 401 Unauthorized
      
      api.client.ts response interceptor:
        - Clears cookies? No - browser handles it
        - Dispatches 'auth:logout' event ✅
        - AuthContext logs user out ✅
    `,
    network_tab_logout: `
      Request:  POST /api/auth/logout
      Headers:
        Cookie: XSRF-TOKEN=abc123...; LARAVEL_SESSION=abc456...
      
      Response:
      Headers:
        Set-Cookie: LARAVEL_SESSION=; Path=/; expires=Thu, 01 Jan 1970
        (Empty cookie tells browser to delete it)
      Body:
        { "message": "Logged out successfully" }
    `,
  },

  IMPORTANT_NOTES: {
    httpOnly_cookies: `
      - Frontend JavaScript CANNOT read httpOnly cookies (by design)
      - This is a security feature - prevents XSS attacks from stealing session
      - Browser automatically sends them with requests
      - You don't need to manage them in code
    `,
    withCredentials: `
      - axios config has withCredentials: true
      - This tells browser to include cookies with cross-origin requests
      - Required for cookie-based auth to work
      - Without it, cookies are NOT sent
    `,
    csrf_protection: `
      - XSRF-TOKEN cookie = CSRF token cookie
      - axios reads this cookie and adds as X-CSRF-TOKEN header
      - Laravel validates both token and session
      - Prevents CSRF attacks from other domains
    `,
    different_from_tokens: `
      Bearer Token Auth (NOT what we're using):
        - Token sent in Authorization header
        - Stored in localStorage
        - Manually added to every request
        - Can be read by JavaScript
        - More vulnerable to XSS
      
      Cookie-Based Auth (WHAT WE'RE USING):
        - Session cookie automatically sent by browser
        - Automatically added to every request
        - Cannot be read by JavaScript (httpOnly)
        - Much more secure against XSS
        - More immune to CSRF (with CSRF token)
    `,
  },
};

// ============================================================================
// VERIFICATION - WHAT TO CHECK IN BROWSER DEV TOOLS
// ============================================================================

const DEV_TOOLS_CHECKLIST = {
  AFTER_LOGIN: {
    network_tab: `
      ✅ POST /sanctum/csrf-cookie
         - Response should include Set-Cookie headers
         - Should have XSRF-TOKEN cookie
      
      ✅ POST /api/auth/login  
         - Request should include X-CSRF-TOKEN header
         - Response should include Set-Cookie: LARAVEL_SESSION=...
         - Response body: { "user": { ... } }
      
      ✅ Check Cookies (Application tab → Cookies):
         - Should see XSRF-TOKEN cookie
         - Should see LARAVEL_SESSION cookie
         - Both should have HttpOnly flag (checked)
         - Both should have SameSite=Lax
    `,
    storage_tab: `
      ✅ localStorage should be empty
         (We're NOT using localStorage with Sanctum)
      
      ✅ No auth-related tokens stored
    `,
    console_tab: `
      ✅ No errors about CORS
      ✅ No errors about CSRF token
      ✅ AuthContext should log user profile loaded
    `,
  },

  AFTER_LOGOUT: {
    network_tab: `
      ✅ POST /api/auth/logout
         - Response includes Set-Cookie: LARAVEL_SESSION=; expires=...
         - Tells browser to delete the session cookie
      
      ✅ Verify page redirects to /login
    `,
    cookies_tab: `
      ✅ LARAVEL_SESSION cookie should be gone
      ✅ XSRF-TOKEN might still exist (that's okay)
    `,
  },

  AFTER_SESSION_EXPIRY: {
    network_tab: `
      ✅ Next API request: GET /api/projects (or similar)
         - Returns 401 Unauthorized
      
      ✅ response interceptor catches 401
         - Dispatches 'auth:logout' event
         - Clears React Query cache
      
      ✅ Page redirects to /login
    `,
    cookies_tab: `
      ✅ LARAVEL_SESSION cookie should be gone
      ✅ XSRF-TOKEN might still exist
    `,
  },

  COMMON_ISSUES_TO_LOOK_FOR: {
    no_xsrf_token_cookie: `
      Problem: GET /sanctum/csrf-cookie doesn't return XSRF-TOKEN
      Check:
        1. Is Sanctum installed? (php artisan tinker → \App\Http\Middleware\...)
        2. Is SPA middleware configured in config/sanctum.php?
        3. Is your frontend domain in SANCTUM_STATEFUL_DOMAINS?
        
      Fix: Update .env in Laravel:
        SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173
    `,

    no_laravel_session_cookie: `
      Problem: POST /api/auth/login succeeds but doesn't set LARAVEL_SESSION
      Check:
        1. Is auth middleware applied to route?
        2. Is session cookie domain correct?
        3. Check config/session.php for domain settings
        
      Fix: Update .env in Laravel:
        SESSION_DOMAIN=localhost  (or .localhost for subdomains)
    `,

    csrf_token_mismatch: `
      Problem: Getting 419 Page Expired error
      Cause: X-CSRF-TOKEN header not matching cookie
      
      Check:
        1. axios extracting XSRF-TOKEN from cookie correctly
        2. axios adding X-CSRF-TOKEN header to request
        3. CSRF token is valid (hasn't expired/changed)
        
      Debug: In api.client.ts request interceptor:
        const csrfToken = document.querySelector('meta[name=\"csrf-token\"]')?.getAttribute('content');
        // Check this is not null
    `,

    cookies_not_sent: `
      Problem: Request headers show no cookies
      Cause: withCredentials: true missing OR CORS misconfigured
      
      Check:
        1. axios config has withCredentials: true ✅ (Already done)
        2. CORS response includes Access-Control-Allow-Credentials: true
        3. Frontend domain allowed in CORS
        
      Debug in Network tab:
        - Look at Request Headers section
        - Should have "Cookie: XSRF-TOKEN=...; LARAVEL_SESSION=..."
    `,
  },
};

// ============================================================================
// CURL COMMANDS FOR TESTING MANUALLY
// ============================================================================

const MANUAL_TESTING_CURL = {
  step_1_get_csrf_cookie: `
    curl -i \\
      -H "Accept: application/json" \\
      http://localhost:8000/sanctum/csrf-cookie
    
    Expected response headers:
      Set-Cookie: XSRF-TOKEN=...; Path=/; SameSite=Lax
      Set-Cookie: LARAVEL_SESSION=...; Path=/; HttpOnly; SameSite=Lax
  `,

  step_2_login: `
    curl -i -X POST \\
      -H "Content-Type: application/json" \\
      -H "X-CSRF-TOKEN: <copy-from-step-1>" \\
      -d '{"email":"user@example.com","password":"password"}' \\
      -b "XSRF-TOKEN=<copy-from-step-1>; LARAVEL_SESSION=<copy-from-step-1>" \\
      http://localhost:8000/api/auth/login
    
    Expected response:
      { "user": { "id": 1, "email": "...", "name": "...", "role": "..." } }
  `,

  step_3_get_user: `
    curl -i \\
      -H "X-CSRF-TOKEN: <copy-from-step-2>" \\
      -b "XSRF-TOKEN=<copy-from-step-2>; LARAVEL_SESSION=<copy-from-step-2>" \\
      http://localhost:8000/api/auth/me
    
    Expected response:
      { "user": { "id": 1, ... } }
  `,

  step_4_logout: `
    curl -i -X POST \\
      -H "X-CSRF-TOKEN: <copy-from-step-2>" \\
      -b "XSRF-TOKEN=<copy-from-step-2>; LARAVEL_SESSION=<copy-from-step-2>" \\
      http://localhost:8000/api/auth/logout
    
    Expected response headers:
      Set-Cookie: LARAVEL_SESSION=; expires=Thu, 01 Jan 1970  (empty = delete)
    
    Expected response:
      { "message": "Logged out successfully" }
  `,
};

export {
  AUTHENTICATION_FLOW,
  DEV_TOOLS_CHECKLIST,
  MANUAL_TESTING_CURL,
};
