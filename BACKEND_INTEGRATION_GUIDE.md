# Structura Backend Integration Guide

## Overview
This guide shows how to connect the Structura frontend application to the Structura-BE dev branch API. The frontend is already set up with React Query hooks and services - you just need to ensure all pages are using them instead of mock data.

## Current Status

### ✅ Already Implemented
- **API Client** (`src/lib/api.client.ts`) - JWT authentication configured
- **API Services** - All services properly configured:
  - `src/api/auth.service.ts` - Authentication
  - `src/api/clients.service.ts` - Clients management
  - `src/api/projects.service.ts` - Projects management
  - `src/api/invoices.service.ts` - Invoices/Payments
  - `src/api/tasks.service.ts` - Tasks management
  - `src/api/teams.service.ts` - Team members
  - `src/api/communication.service.ts` - Chat & timeline
- **React Query Hooks** - All query hooks implemented:
  - `src/hooks/queries/useProjects.ts`
  - `src/hooks/queries/useClients.ts`
  - `src/hooks/queries/useInvoices.ts`
  - `src/hooks/queries/useTasks.ts`
  - `src/hooks/queries/useTeamMembers.ts`
  - `src/hooks/queries/useCommunication.ts`
  - `src/hooks/queries/useAuth.ts`
- **React Query Mutations** - All mutation hooks implemented in `src/hooks/mutations/`
- **Zustand Stores** - Set up for managing UI state

### 🔄 In Progress
- Migrating pages to use React Query hooks instead of mock data

## Migration Steps

### Step 1: Auth Context
The auth context is already set up to:
- Store JWT token in localStorage
- Automatically fetch current user on app mount
- Handle token expiration (401 errors)
- Dispatch logout events

No changes needed!

### Step 2: Using React Query Hooks

#### Example: Dashboard / Projects Page
```typescript
import { useProjects } from '@/hooks/queries/useProjects';

export const ProjectsPage = () => {
  const { data, isLoading, error } = useProjects(undefined, 1, 12);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.data.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
```

#### Example: Mutations (Create/Update/Delete)
```typescript
import { useProjectMutations } from '@/hooks/mutations/useProjectMutations';
import { useQueryClient } from '@tanstack/react-query';

export const CreateProjectForm = () => {
  const queryClient = useQueryClient();
  const { createProject } = useProjectMutations();
  
  const handleSubmit = async (data) => {
    await createProject.mutateAsync(data);
    // Invalidate cache to refetch
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
};
```

### Step 3: Backend API Endpoints

The frontend expects these endpoints from the Structura-BE dev branch:

#### Public Endpoints (No Auth Required)
```
GET    /api/clients          - List clients
GET    /api/clients/:id      - Get client details
GET    /api/projects         - List projects
GET    /api/projects/:id     - Get project details
GET    /api/invoices         - List invoices
GET    /api/invoices/:id     - Get invoice details
GET    /api/tasks            - List tasks
GET    /api/tasks/:id        - Get task details
```

#### Auth Endpoints
```
POST   /api/auth/login       - Login (returns token)
POST   /api/auth/register    - Register
GET    /api/auth/me          - Get current user
POST   /api/auth/logout      - Logout
POST   /api/auth/refresh     - Refresh token
```

#### Protected Endpoints (Require JWT Token in Authorization Header)
```
// Clients
POST   /api/clients          - Create client
PUT    /api/clients/:id      - Update client
DELETE /api/clients/:id      - Delete client

// Projects
POST   /api/projects         - Create project
PUT    /api/projects/:id     - Update project
DELETE /api/projects/:id     - Delete project
GET    /api/projects/analytics/status - Project status analytics

// Invoices
POST   /api/invoices         - Create invoice
PUT    /api/invoices/:id     - Update invoice
DELETE /api/invoices/:id     - Delete invoice
GET    /api/invoices/analytics/revenue - Revenue analytics

// Tasks
POST   /api/tasks            - Create task
PUT    /api/tasks/:id        - Update task
DELETE /api/tasks/:id        - Delete task

// Teams
GET    /api/teams            - List teams
GET    /api/teams/:id        - Get team details

// Communication
GET    /api/communication    - List chat rooms
GET    /api/communication/:id - Get chat room with messages
```

### Step 4: Update Stores (Optional)

Currently stores still use mock data. You can either:

**Option A: Keep using stores + React Query**
- Stores handle UI state (loading, error)
- React Query handles data fetching and caching
- Update stores to call services when available

**Option B: Replace stores entirely with React Query**
- Remove Zustand stores
- Use React Query directly in components
- Simpler, recommended approach

### Step 5: Environment Variables

Make sure your `.env` file has:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_BASE_URL=http://localhost:8000
```

This should match your Structura-BE dev branch base URL.

## Common Issues

### Issue: 401 Unauthorized
**Solution**: Token is invalid or expired. The auth interceptor will automatically clear the token and redirect to login.

### Issue: CORS Errors
**Solution**: Make sure your backend has CORS configured to allow requests from your frontend URL.

### Issue: Network Errors
**Solution**: Verify the backend is running and the API base URL is correct.

### Issue: Type Mismatches
**Solution**: Update the types in `src/types/` to match your backend response structure.

## Files to Update

### Pages That Need Migration:
1. **src/pages/Dashboard.tsx** - Use `useProjects()` hook
2. **src/pages/Projects.tsx** - Use `useProjects()` hook  
3. **src/pages/Clients.tsx** - Use `useClients()` hook
4. **src/pages/Payments.tsx** - Use `useInvoices()` hook
5. **src/pages/Teams.tsx** - Use `useTeamMembers()` hook
6. **src/pages/Communication.tsx** - Use `useCommunication()` hook
7. **src/pages/Tasks.tsx** - Use `useTasks()` hook
8. **src/pages/ProjectDetail.tsx** - Use `useProject(id)` hook

### Components That Need Updates:
- Remove any components importing from `mockData`
- Update to use React Query hooks passed as props
- Remove hardcoded test data

## Verification Checklist

- [ ] Backend (Structura-BE dev branch) is running on `http://localhost:8000`
- [ ] Frontend `.env` has correct `VITE_API_BASE_URL`
- [ ] Can login with admin credentials
- [ ] JWT token appears in localStorage after login
- [ ] Projects page loads real data from API
- [ ] Clients page loads real data from API
- [ ] Create/update/delete operations work
- [ ] Pagination works
- [ ] Filtering works
- [ ] Search functionality works
- [ ] Token refresh works on page reload
- [ ] Logout clears token and redirects

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@structura.local","password":"password"}'

# Get projects with token
curl -X GET http://localhost:8000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get teams
curl -X GET http://localhost:8000/api/teams \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get communications
curl -X GET http://localhost:8000/api/communication \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Next Steps

1. Start the frontend: `npm run dev`
2. Start the backend: `php artisan serve` or your dev server
3. Update pages to use React Query hooks (see migration examples above)
4. Test each page with real data
5. Remove mock data imports
6. Remove unused Zustand stores (optional)

## Support

For issues with:
- **Frontend**: Check this integration guide and React Query docs
- **Backend**: Check the Structura-BE repository and its README
- **API Responses**: Use browser DevTools Network tab to inspect actual responses
