/**
 * ENTERPRISE-GRADE REACT QUERY + SANCTUM INTEGRATION
 * Implementation Guide & Next Steps
 *
 * This file contains the complete implementation roadmap and integration checklist.
 */

// ============================================================================
// ARCHITECTURE OVERVIEW
// ============================================================================

/**
 * The implementation follows a 3-layer architecture:
 *
 * 1. API SERVICES LAYER
 *    - src/api/*.service.ts
 *    - Type-safe API methods
 *    - Encapsulates all HTTP requests
 *    - Independent of React Query
 *
 * 2. REACT QUERY HOOKS LAYER
 *    - src/hooks/queries/*.ts - Data fetching hooks
 *    - src/hooks/mutations/*.ts - Data mutation hooks
 *    - Built-in caching, invalidation, error handling
 *    - Manages server state
 *
 * 3. COMPONENT & CONTEXT LAYER
 *    - AuthContext - Provides login/logout/auth state
 *    - Components use hooks directly
 *    - Zustand stores for local UI state only
 *
 * HTTP CLIENT & AUTH
 *    - src/lib/api.client.ts - Axios instance with Sanctum interceptors
 *    - src/lib/token.ts - Token storage management
 *    - src/lib/authGuard.ts - Auth utilities
 *    - src/lib/errorHandler.ts - Error parsing
 */

// ============================================================================
// IMPLEMENTATION CHECKLIST
// ============================================================================

const IMPLEMENTATION_STEPS = {
  PHASE_1_SETUP: {
    title: 'Phase 1: Environment & Configuration',
    steps: [
      {
        item: 'Update .env.local with Laravel API base URL',
        status: '✅ DONE',
        code: 'VITE_API_BASE_URL=http://localhost:8000/api',
      },
      {
        item: 'Create .env.production for production API URL',
        status: '⏳ TODO',
        code: 'VITE_API_BASE_URL=https://api.yourdomain.com/api',
      },
      {
        item: 'Install missing dependencies if needed',
        status: '⏳ TODO',
        command: 'npm install axios',
      },
    ],
  },

  PHASE_2_FOUNDATION: {
    title: 'Phase 2: HTTP Client & Token Management',
    steps: [
      {
        item: 'src/lib/api.client.ts - Axios with Sanctum interceptors',
        status: '✅ DONE',
      },
      {
        item: 'src/lib/token.ts - Token storage utilities',
        status: '✅ DONE',
      },
      {
        item: 'src/lib/queryClient.ts - React Query configuration',
        status: '✅ DONE',
      },
      {
        item: 'src/lib/authGuard.ts - Auth utilities',
        status: '✅ DONE',
      },
      {
        item: 'src/lib/errorHandler.ts - Error parsing',
        status: '✅ DONE',
      },
    ],
  },

  PHASE_3_API_SERVICES: {
    title: 'Phase 3: API Services Layer',
    steps: [
      {
        item: 'src/api/auth.service.ts - Authentication',
        status: '✅ DONE',
        note: 'Ensure Laravel endpoints: POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me',
      },
      {
        item: 'src/api/projects.service.ts - Projects CRUD',
        status: '✅ DONE',
        endpoint: 'GET /api/projects, POST /api/projects, PUT /api/projects/{id}, DELETE /api/projects/{id}',
      },
      {
        item: 'src/api/tasks.service.ts - Tasks CRUD',
        status: '✅ DONE',
        endpoint: 'GET /api/tasks, POST /api/tasks, PUT /api/tasks/{id}, DELETE /api/tasks/{id}',
      },
      {
        item: 'src/api/teams.service.ts - Team members',
        status: '✅ DONE',
        endpoint: 'GET /api/team-members, POST /api/team-members, etc.',
      },
      {
        item: 'src/api/clients.service.ts - Clients',
        status: '✅ DONE',
        endpoint: 'GET /api/clients, POST /api/clients, etc.',
      },
      {
        item: 'src/api/invoices.service.ts - Invoices',
        status: '✅ DONE',
        endpoint: 'GET /api/invoices, POST /api/invoices, etc.',
      },
      {
        item: 'src/api/communication.service.ts - Chat & timeline',
        status: '✅ DONE',
        endpoint: 'GET /api/chat-rooms, POST /api/messages, etc.',
      },
    ],
  },

  PHASE_4_REACT_QUERY: {
    title: 'Phase 4: React Query Hooks',
    steps: [
      {
        item: 'Query hooks: src/hooks/queries/*.ts',
        status: '✅ DONE',
        hooks: [
          'useProjects, useProject, useProjectStatusData',
          'useTasks, useTask',
          'useTeamMembers, useTeamMember',
          'useClients, useClient',
          'useInvoices, useInvoice, useRevenueData',
          'useChatRooms, useMessages, useTimeline',
        ],
      },
      {
        item: 'Mutation hooks: src/hooks/mutations/*.ts',
        status: '✅ DONE',
        mutations: [
          'useLoginMutation, useLogoutMutation, useRefreshTokenMutation',
          'useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation',
          'useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation, useUpdateTaskStatusMutation',
        ],
      },
    ],
  },

  PHASE_5_INTEGRATION: {
    title: 'Phase 5: App Integration',
    steps: [
      {
        item: 'Update src/main.tsx with QueryClientProvider',
        status: '✅ DONE',
      },
      {
        item: 'Update src/contexts/AuthContext.tsx to use mutations',
        status: '✅ DONE',
      },
      {
        item: 'Update src/stores/auth.store.ts for API-based auth',
        status: '✅ DONE',
      },
    ],
  },

  PHASE_6_COMPONENT_MIGRATION: {
    title: 'Phase 6: Component Migration (Per-Page)',
    steps: [
      {
        item: 'src/pages/Login.tsx',
        status: '⏳ TODO',
        pattern: 'Use useAuth() from AuthContext context',
        example: 'See examples/LoginFormExample.tsx',
      },
      {
        item: 'src/pages/Dashboard.tsx',
        status: '⏳ TODO',
        pattern: 'Use useProjectStatusData(), useProjects()',
      },
      {
        item: 'src/pages/Projects.tsx',
        status: '⏳ TODO',
        pattern: 'Use useProjects(), useCreateProjectMutation(), etc.',
        example: 'See examples/ProjectsPageExample.tsx',
      },
      {
        item: 'src/pages/ProjectDetail.tsx',
        status: '⏳ TODO',
        pattern: 'Use useProject(), useTasks(), useTeamMembers()',
        example: 'See examples/ProjectDetailExample.tsx',
      },
      {
        item: 'src/pages/Tasks.tsx',
        status: '⏳ TODO',
        pattern: 'Use useTasks(), useUpdateTaskStatusMutation(),',
        example: 'See examples/TaskKanbanExample.tsx',
      },
      {
        item: 'src/pages/Teams.tsx',
        status: '⏳ TODO',
        pattern: 'Use useTeamMembers(), useCreate/UpdateTeamMemberMutation()',
      },
      {
        item: 'src/pages/Clients.tsx',
        status: '⏳ TODO',
        pattern: 'Use useClients(), useCreateClientMutation(), etc.',
      },
      {
        item: 'src/pages/Payments.tsx',
        status: '⏳ TODO',
        pattern: 'Use useInvoices(), useRevenueData(), etc.',
      },
      {
        item: 'src/pages/Communication.tsx',
        status: '⏳ TODO',
        pattern: 'Use useChatRooms(), useMessages(), useSendMessageMutation()',
      },
    ],
  },

  PHASE_7_TESTING: {
    title: 'Phase 7: Testing & Verification',
    steps: [
      {
        item: 'Test API calls in Network tab (verify Authorization headers)',
        status: '⏳ TODO',
      },
      {
        item: 'Test token storage (check localStorage after login)',
        status: '⏳ TODO',
      },
      {
        item: 'Test token expiration flow',
        status: '⏳ TODO',
      },
      {
        item: 'Test error handling (invalid credentials, network errors)',
        status: '⏳ TODO',
      },
      {
        item: 'Test cache invalidation (create/update triggers refetch)',
        status: '⏳ TODO',
      },
      {
        item: 'Use React Query DevTools for debugging',
        status: '⏳ TODO',
        command: 'npm install @tanstack/react-query-devtools',
      },
    ],
  },
};

// ============================================================================
// LARAVEL API ENDPOINT REQUIREMENTS
// ============================================================================

const LARAVEL_REQUIREMENTS = {
  SANCTUM_SETUP: {
    description: 'Ensure you have Sanctum installed and configured',
    reference: 'https://laravel.com/docs/sanctum',
    config: `
      // config/sanctum.php - Required settings:
      'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,localhost:5173')),
      'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000'],
      'supports_credentials' => true,
    `,
  },

  AUTH_ENDPOINTS: {
    login: {
      method: 'POST',
      path: '/api/auth/login',
      body: { email: 'string', password: 'string' },
      response: { token: 'string', user: { id, email, name, role } },
    },
    logout: {
      method: 'POST',
      path: '/api/auth/logout',
      requiresAuth: true,
    },
    getCurrentUser: {
      method: 'GET',
      path: '/api/auth/me',
      requiresAuth: true,
      response: { user: { id, email, name, role } },
    },
  },

  RESOURCE_ENDPOINTS: {
    projects: ['GET', 'POST', 'PUT', 'DELETE /api/projects/{id}'],
    tasks: ['GET', 'POST', 'PUT', 'DELETE /api/tasks/{id}'],
    teamMembers: ['GET', 'POST', 'PUT', 'DELETE /api/team-members/{id}'],
    clients: ['GET', 'POST', 'PUT', 'DELETE /api/clients/{id}'],
    invoices: ['GET', 'POST', 'PUT', 'DELETE /api/invoices/{id}'],
  },

  TOKEN_AUTH: {
    description: 'Use Bearer tokens in Authorization header',
    header: 'Authorization: Bearer {token}',
    implemented: true,
    automatedBy: 'src/lib/api.client.ts request interceptor',
  },

  VALIDATION_ERRORS: {
    description: 'Return validation errors in standard Laravel format',
    httpStatus: 422,
    format: {
      message: 'Validation failed',
      errors: {
        fieldName: ['Error message 1', 'Error message 2'],
      },
    },
  },
};

// ============================================================================
// QUICK START GUIDE
// ============================================================================

const QUICK_START = `
1. SETUP PHASE (5 minutes)
   ✅ Environment variables configured
   ✅ HTTP client created with Sanctum support
   ✅ QueryClientProvider wired in main.tsx
   ✅ AuthContext updated for mutations

2. TEST HTTP CLIENT (10 minutes)
   - Open src/lib/api.client.ts
   - Verify VITE_API_BASE_URL in .env.local matches your Laravel API URL
   - Check that withCredentials is set to true for Sanctum

3. MIGRATE FIRST PAGE (30-45 minutes)
   - Choose a simple page (e.g., Projects list)
   - Replace mock data imports with React Query hooks
   - Replace store methods with mutation hooks
   - Test API calls in browser DevTools Network tab

4. VERIFY SANCTUM AUTH FLOW
   - Login should store token in localStorage
   - Verify Authorization header is sent with subsequent requests
   - Test logout clears token and redirects to login
   - Test session expiration (clear localStorage mid-session)

5. GRADUAL MIGRATION
   - Migrate one page at a time
   - Keep existing Zustand stores for UI state (sidebar, filters, etc.)
   - Use React Query hooks for all API data
   - Test thoroughly before moving to next page
`;

// ============================================================================
// DEBUGGING TIPS
// ============================================================================

const DEBUGGING_TIPS = `
Network Tab Issues:
- Authorization header missing? Check tokenStorage.getToken() returns a value
- 401 Unauthorized? Token might be expired or invalid
- CORS errors? Verify SANCTUM_STATEFUL_DOMAINS in Laravel

Unknown Errors:
1. Open Browser DevTools → Network tab
2. Check API request: Headers (Authorization), Request body, Response
3. Check API response status and body
4. Use src/lib/errorHandler.ts parseApiError() to parse error

React Query Debugging:
1. Install DevTools: npm install @tanstack/react-query-devtools
2. Add to App.tsx:
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
   <ReactQueryDevtools initialIsOpen={false} />
3. Open DevTools to inspect queries, mutations, cache

Token Issues:
- Check localStorage has token after login: Open DevTools → Application → localStorage
- Check token expiration: Use src/lib/authGuard.ts isTokenExpired()
- Check Bearer token format: Should be "Bearer abc123..."

Type Safety:
- Ensure API response types match service definitions
- Check src/types/index.ts has all required types
- Use TypeScript strict mode for better error detection
`;

// ============================================================================
// BEST PRACTICES & PATTERNS
// ============================================================================

const BEST_PRACTICES = {
  errorHandling: {
    pattern: `
      const { mutate, isPending } = useCreateProjectMutation();
      
      const handleCreate = async () => {
        try {
          await mutateAsync(data);
          toast({ title: 'Success' });
        } catch (err) {
          const message = getUserErrorMessage(err);
          toast({ title: 'Error', description: message });
        }
      }
    `,
    benefits: ['Consistent error messages', 'User feedback', 'Type-safe errors'],
  },

  dataFetching: {
    pattern: `
      const { data, isLoading, error } = useProjects();
      
      if (isLoading) return <Skeleton />;
      if (error) return <ErrorBoundary />;
      
      return <ProjectsList projects={data.data} />;
    `,
    benefits: ['Automatic caching', 'Refetch on focus', 'Type-safe data'],
  },

  mutations: {
    pattern: `
      const { mutate, isPending, error } = useUpdateProjectMutation();
      
      const handleUpdate = () => {
        mutate(
          { id: projectId, data: updatedData },
          {
            onSuccess: () => {
              toast({ title: 'Updated' });
              refetch();
            },
            onError: (err) => {
              toast({ title: 'Error', variant: 'destructive' });
            }
          }
        );
      }
    `,
    benefits: ['Optimistic updates possible', 'Custom handlers', 'Error recovery'],
  },

  caching: {
    staleTime0: {
      description: 'Fresh data always - configured in queryClient.ts',
      useCase: 'Financial data, real-time updates, critical information',
    },
    staleTime5m: {
      description: 'Cache for 5 minutes - use for stable data',
      useCase: 'Team members, clients, project metadata',
    },
    staleTimeInfinity: {
      description: 'Cache indefinitely - only refetch on explicit invalidation',
      useCase: 'Reference data, lookup lists',
    },
  },
};

// ============================================================================
// COMMON PATTERNS FOR COMPONENT MIGRATION
// ============================================================================

const MIGRATION_PATTERNS = {
  BEFORE_MOCK_DATA: `
    // OLD: Using mock data and Zustand store
    import { mockProjects } from '@/data/mockData';
    import { useProjectStore } from '@/stores/project.store';
    
    const Projects = () => {
      const projects = useProjectStore((s) => s.projects); // Always from mock
      return <div>{projects.map(...)}</div>;
    }
  `,

  AFTER_REACT_QUERY: `
    // NEW: Using React Query hooks
    import { useProjects } from '@/hooks/queries/useProjects';
    
    const Projects = () => {
      const { data, isLoading, error } = useProjects();
      
      if (isLoading) return <Skeleton />;
      if (error) return <Error />;
      
      return <div>{data.data.map(...)}</div>;
    }
  `,

  BEFORE_MUTATIONS: `
    // OLD: Zustand store with manual API call
    const createProject = () => {
      // Manual axios call or fetch
      const response = await axios.post('/api/projects', data);
      set({ projects: [...projects, response.data] });
    }
  `,

  AFTER_MUTATIONS: `
    // NEW: React Query mutation with automatic invalidation
    const { mutate } = useCreateProjectMutation();
    
    const handleCreate = async (data) => {
      mutate(data, {
        onSuccess: () => toast({ title: 'Created' })
      });
      // Query cache automatically updated!
    }
  `,
};

// ============================================================================
// IMPLEMENTATION TIMELINE
// ============================================================================

const TIMELINE = {
  week1: {
    monday: 'Setup API client, auth context, React Query config',
    tuesday: 'Migrate auth/login page',
    wednesday: 'Migrate projects list page',
    thursday: 'Migrate project detail page',
    friday: 'Testing and debugging',
  },
  week2: {
    monday: 'Migrate tasks, teams, clients pages',
    tuesday: 'Migrate invoices and communication pages',
    wednesday: 'Performance optimization, caching review',
    thursday: 'Error handling review, edge cases',
    friday: 'Integration testing, production readiness',
  },
  week3: {
    monday: 'Deploy to staging',
    tuesday_thursday: 'UAT and bug fixes',
    friday: 'Deploy to production',
  },
};

// ============================================================================
// FILE STRUCTURE CREATED
// ============================================================================

const FILE_STRUCTURE = `
src/
├── api/
│   ├── auth.service.ts ✅
│   ├── clients.service.ts ✅
│   ├── communication.service.ts ✅
│   ├── invoices.service.ts ✅
│   ├── projects.service.ts ✅
│   ├── tasks.service.ts ✅
│   └── teams.service.ts ✅
├── contexts/
│   └── AuthContext.tsx ✅ (Updated)
├── hooks/
│   ├── mutations/
│   │   ├── useAuthMutations.ts ✅
│   │   ├── useClientMutations.ts ✅
│   │   ├── useCommunicationMutations.ts ✅
│   │   ├── useInvoiceMutations.ts ✅
│   │   ├── useProjectMutations.ts ✅
│   │   ├── useTaskMutations.ts ✅
│   │   └── useTeamMutations.ts ✅
│   └── queries/
│       ├── useAuth.ts ✅
│       ├── useCommunication.ts ✅
│       ├── useClients.ts ✅
│       ├── useInvoices.ts ✅
│       ├── useProjects.ts ✅
│       ├── useTasks.ts ✅
│       └── useTeamMembers.ts ✅
├── lib/
│   ├── api.client.ts ✅
│   ├── authGuard.ts ✅
│   ├── errorHandler.ts ✅
│   ├── queryClient.ts ✅
│   └── token.ts ✅
├── examples/
│   ├── LoginFormExample.tsx ✅
│   ├── ProjectDetailExample.tsx ✅
│   ├── ProjectsPageExample.tsx ✅
│   └── TaskKanbanExample.tsx ✅
├── stores/
│   └── auth.store.ts ✅ (Updated)
└── main.tsx ✅ (Updated with QueryClientProvider)
`;

export {
  IMPLEMENTATION_STEPS,
  LARAVEL_REQUIREMENTS,
  QUICK_START,
  DEBUGGING_TIPS,
  BEST_PRACTICES,
  MIGRATION_PATTERNS,
  TIMELINE,
  FILE_STRUCTURE,
};
