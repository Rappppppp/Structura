import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Communication from "./pages/Communication";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Teams from "./pages/Teams";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import Attendance from "./pages/Attendance";
import AdminAttendance from "./pages/AdminAttendance";
import NotFound from "./pages/NotFound";

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
const AuthRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />;
};

const protectedRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/projects", element: <Projects /> },
  { path: "/projects/:id", element: <ProjectDetail /> },
  { path: "/communication", element: <Communication /> },
  { path: "/payments", element: <Payments /> },
  { path: "/reports", element: <Reports /> },

  { path: "/attendance", element: <Attendance /> },
  { path: "/admin/attendance", element: <AdminAttendance /> },
  // { path: "/ai-insights", element: <AIInsights /> },
  { path: "/teams", element: <Teams /> },
  { path: "/clients", element: <Clients /> },
  { path: "/clients/:id", element: <ClientDetail /> },
  { path: "/users", element: <Users /> },
  { path: "/users/:id", element: <UserDetail /> },
  { path: "/tasks", element: <Projects /> },
  { path: "/uploads", element: <Projects /> },
  { path: "/timeline", element: <Projects /> },
  { path: "/documents", element: <Projects /> },
  { path: "/settings", element: <Settings /> },
];

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AuthRedirect />} />
    <Route element={<ProtectedLayout />}>
      {protectedRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </TooltipProvider>
);

export default App;