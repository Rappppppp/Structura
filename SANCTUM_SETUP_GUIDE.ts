/**
 * LARAVEL SANCTUM CONFIGURATION GUIDE
 * Cookie-Based Authentication Setup
 *
 * This guide outlines the required Laravel Sanctum setup for this frontend
 */

// ============================================================================
// LARAVEL SANCTUM SETUP REQUIREMENTS
// ============================================================================

const LARAVEL_SANCTUM_CONFIG = {
  composer_install: `
    composer require laravel/sanctum
    php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
  `,

  env_file: `
    # .env
    APP_URL=http://localhost:8000
    FRONTEND_URL=http://localhost:5173
    SESSION_DOMAIN=localhost
  `,

  config_sanctum_php: `
    // config/sanctum.php
    return [
      'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,localhost:5173')),
      
      'guard' => ['web'],
      
      'middleware' => [
        'verify_csrf_token' => \\App\\Http\\Middleware\\VerifyCsrfToken::class,
        'encrypt_cookies' => \\App\\Http\\Middleware\\EncryptCookies::class,
      ],

      'expiration' => null, // null = session expires when browser closes
      
      'allowed_origins' => [
        // Include your frontend URL
        'http://localhost:5173',
        'http://localhost:3000',
      ],

      'supports_credentials' => true,
    ];
  `,

  cors_middleware: `
    // app/Http/Middleware/HandleCors.php - Add if not using Laravel CORS package
    public function handle(Request $request, Closure $next)
    {
      return $next($request)
        ->header('Access-Control-Allow-Origin', config('sanctum.allowed_origins'))
        ->header('Access-Control-Allow-Credentials', 'true')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 
                 'Accept, Content-Type, X-Csrf-Token, X-Requested-With, Authorization');
    }
  `,

  kernel_php: `
    // app/Http/Kernel.php
    protected $middleware = [
      // ... other middleware
      \\Fruitcake\\Cors\\HandleCors::class, // or your own CORS middleware
    ];

    protected $middlewareGroups = [
      'api' => [
        'throttle:api',
        \\App\\Http\\Middleware\\HandleCors::class,
      ],
    ];
  `,
};

// ============================================================================
// REQUIRED LARAVEL API ENDPOINTS
// ============================================================================

const API_ENDPOINTS = {
  SANCTUM_CSRF: {
    method: 'GET',
    route: '/sanctum/csrf-cookie',
    description: 'Fetch CSRF token and set cookies. Call this once on app init.',
    example: 'GET /sanctum/csrf-cookie',
  },

  LOGIN: {
    method: 'POST',
    route: '/api/auth/login',
    description: 'Authenticate user with email/password. Sets httpOnly cookies.',
    body: {
      email: 'user@example.com',
      password: 'password123',
    },
    response: {
      user: {
        id: 1,
        email: 'user@example.com',
        name: 'User Name',
        role: 'admin',
      },
    },
    example: `
      POST /api/auth/login
      Content-Type: application/json
      
      { "email": "user@example.com", "password": "password123" }
      
      Response:
      { "user": { "id": 1, "email": "user@example.com", "name": "User Name", "role": "admin" } }
    `,
  },

  GET_USER: {
    method: 'GET',
    route: '/api/auth/me',
    description: 'Get current authenticated user. Uses httpOnly cookie for auth.',
    requiresAuth: true,
    response: {
      user: {
        id: 1,
        email: 'user@example.com',
        name: 'User Name',
        role: 'admin',
      },
    },
  },

  LOGOUT: {
    method: 'POST',
    route: '/api/auth/logout',
    description: 'Logout user and invalidate session. Server clears httpOnly cookie.',
    requiresAuth: true,
    response: {
      message: 'Logged out successfully',
    },
  },

  ALL_OTHER_ENDPOINTS: {
    description: 'All other API endpoints (projects, tasks, etc.)',
    auth: 'No special auth needed - Sanctum handles via httpOnly cookies automatically',
    credentials: 'Include credentials in all API calls (withCredentials: true)',
  },
};

// ============================================================================
// LARAVEL CONTROLLER EXAMPLE
// ============================================================================

const LARAVEL_AUTH_CONTROLLER = `
<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Validation\\ValidationException;

class AuthController extends Controller
{
    /**
     * Login endpoint
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        // Validate credentials
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Attempt to authenticate
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Get authenticated user
        $user = Auth::user();

        // Return user data
        // Sanctum automatically sets httpOnly cookies
        return response()->json([
            'user' => $user->only(['id', 'email', 'name', 'role']),
        ]);
    }

    /**
     * Get current user
     * GET /api/auth/me
     */
    public function getCurrentUser(Request $request)
    {
        return response()->json([
            'user' => $request->user()->only(['id', 'email', 'name', 'role']),
        ]);
    }

    /**
     * Logout endpoint
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        Auth::logout();

        // Optionally revoke tokens if using token-based auth
        // $request->user()->tokens->each->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
`;

// ============================================================================
// ROUTES SETUP
// ============================================================================

const LARAVEL_ROUTES = `
<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\AuthController;

// Public routes (no auth required)
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes (require auth)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'getCurrentUser']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // All other API routes here
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('team-members', TeamMemberController::class);
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('invoices', InvoiceController::class);
    // ... etc
});
`;

// ============================================================================
// FRONTEND CONFIGURATION
// ============================================================================

const FRONTEND_CONFIG = {
  env_local: `
    # .env.local (for development)
    VITE_API_BASE_URL=http://localhost:8000/api
  `,

  env_production: `
    # .env.production (for production)
    VITE_API_BASE_URL=https://api.yourdomain.com/api
  `,

  how_it_works: `
    1. On app start, AuthContext calls initializeSanctum()
       - This hits GET /sanctum/csrf-cookie endpoint
       - Laravel sets CSRF token in cookie (XSRF-TOKEN)
       - axios stores this automatically

    2. User logs in via POST /api/auth/login
       - Credentials sent in request body
       - Server validates, authenticates user
       - Server sets httpOnly cookie containing session token (LARAVEL_SESSION)
       - Frontend cannot read httpOnly cookies (security feature)
       - Server also sets XSRF-TOKEN cookie for CSRF protection

    3. Subsequent API requests
       - Browser automatically includes cookies with each request (withCredentials: true)
       - axios automatically includes XSRF-TOKEN in X-CSRF-TOKEN header
       - Server validates CSRF token and session cookie
       - Request is authenticated

    4. User logs out via POST /api/auth/logout
       - Server validates session, clears it
       - Returns success response
       - Frontend clears React Query cache
       - Redirects to login page

    5. Session expires
       - Server returns 401 Unauthorized
       - Frontend response interceptor catches it
       - Dispatches 'auth:logout' event
       - AuthContext clears state and redirects to login
  `,
};

// ============================================================================
// COMMON ISSUES AND FIXES
// ============================================================================

const TROUBLESHOOTING = {
  CORS_ERROR: {
    symptom: 'XMLHttpRequest blocked by CORS policy',
    cause: 'SANCTUM_STATEFUL_DOMAINS or allowed_origins not configured',
    fix: `
      Update config/sanctum.php:
      
      'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 
        'localhost,localhost:3000,localhost:5173'
      )),
      
      'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:3000',
      ],
      
      Make sure your frontend URL is included in BOTH arrays.
    `,
  },

  COOKIES_NOT_SENT: {
    symptom: 'No LARAVEL_SESSION cookie in requests',
    cause: 'Missing withCredentials: true or CORS misconfigured',
    fix: `
      1. Verify withCredentials: true in api.client.ts ✅ Already done
      2. Check CORS headers include 'Access-Control-Allow-Credentials: true'
      3. Verify credentials are being sent in Network -> Cookies tab
    `,
  },

  CSRF_TOKEN_INVALID: {
    symptom: '419 Page Expired or CSRF token mismatch',
    cause: 'initializeSanctum() not called or X-CSRF-TOKEN header missing',
    fix: `
      1. AuthContext calls initializeSanctum() on mount ✅ Already done
      2. axios automatically extracts CSRF token from cookie and adds to header
      3. If still failing, check:
         - GET /sanctum/csrf-cookie returns Set-Cookie header
         - Browser stores XSRF-TOKEN cookie
         - Subsequent requests include X-CSRF-TOKEN header
    `,
  },

  UNAUTHORIZED_401: {
    symptom: 'Getting 401 even after successful login',
    cause: 'Session cookie not being sent with requests',
    fix: `
      1. Verify LOGIN endpoint returns Set-Cookie: LARAVEL_SESSION=... header
      2. Check browser stores LARAVEL_SESSION cookie
      3. Verify subsequent requests include LARAVEL_SESSION cookie
      4. Check domain: cookie domain should match request domain
         - For localhost: set SESSION_DOMAIN=localhost in .env
  `,
  },

  SESSION_EXPIRES_IMMEDIATELY: {
    symptom: 'Session works briefly then expires',
    cause: 'SESSION_LIFETIME too short or cookie domain mismatch',
    fix: `
      In .env:
      SESSION_LIFETIME=120  # 120 minutes
      SESSION_DOMAIN=.localhost  # Include subdomain dot
      
      Or in config/session.php:
      'lifetime' => env('SESSION_LIFETIME', 120),
      'expire_on_close' => false,
    `,
  },
};

// ============================================================================
// VERIFY SETUP CHECKLIST
// ============================================================================

const VERIFICATION_CHECKLIST = `
Before testing the frontend:

✅ SANCTUM INSTALLED
  [ ] Run: composer require laravel/sanctum
  [ ] Run: php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"

✅ SANCTUM CONFIGURED
  [ ] config/sanctum.php exists
  [ ] SANCTUM_STATEFUL_DOMAINS includes 'localhost,localhost:5173'
  [ ] allowed_origins includes 'http://localhost:5173'
  [ ] supports_credentials = true

✅ CORS CONFIGURED
  [ ] Middleware\HandleCors in app/Http/Kernel.php
  [ ] Or package like fruitcake/laravel-cors installed

✅ AUTH ROUTES CREATED
  [ ] GET /sanctum/csrf-cookie - Returns CSRF cookie
  [ ] POST /api/auth/login - Validates credentials, returns user
  [ ] GET /api/auth/me - Returns current user (requires auth)
  [ ] POST /api/auth/logout - Logs out user

✅ FRONTEND CONFIGURED
  [ ] .env.local has VITE_API_BASE_URL=http://localhost:8000/api
  [ ] main.tsx has QueryClientProvider wrapper ✅ Done
  [ ] AuthContext uses initializeSanctum() ✅ Done
  [ ] api.client.ts has withCredentials: true ✅ Done

✅ TESTING
  [ ] Open browser DevTools -> Network tab
  [ ] Login: Check GET /sanctum/csrf-cookie gets XSRF-TOKEN cookie
  [ ] Login: Check POST /api/auth/login sets LARAVEL_SESSION cookie
  [ ] Profile: Check GET /api/auth/me includes both cookies
  [ ] Network headers should show:
      - Cookie: XSRF-TOKEN=...; LARAVEL_SESSION=...
      - X-CSRF-TOKEN: ... (added by axios)
`;

export {
  LARAVEL_SANCTUM_CONFIG,
  API_ENDPOINTS,
  LARAVEL_AUTH_CONTROLLER,
  LARAVEL_ROUTES,
  FRONTEND_CONFIG,
  TROUBLESHOOTING,
  VERIFICATION_CHECKLIST,
};
