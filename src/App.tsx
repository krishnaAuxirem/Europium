import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth, ROLE_ROUTES } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import FloatingScrollTop from "@/components/layout/FloatingScrollTop";
import ProtectedRoute from "@/components/features/ProtectedRoute";
import type { UserRole } from "@/types";

const Home = lazy(() => import("@/pages/Home"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const Universities = lazy(() => import("@/pages/Universities"));
const Properties = lazy(() => import("@/pages/Properties"));
const Destinations = lazy(() => import("@/pages/Destinations"));
const Opportunities = lazy(() => import("@/pages/Opportunities"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const RoleSelect = lazy(() => import("@/pages/RoleSelect"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-soft flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border-t-transparent animate-spin border-royal"
          style={{ borderWidth: 3 }}
        />
        <p className="text-navy/40 text-sm font-medium">Loading Europium...</p>
      </div>
    </div>
  );
}

const AUTH_ONLY_PATHS = ["/login", "/register", "/role-select"];

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingScrollTop />
    </div>
  );
}

// Protect role-select: only accessible after register (pending account) or if no role yet
function RoleSelectGuard() {
  const { isLoggedIn, user, getPendingAccount } = useAuth();
  const pending = getPendingAccount();

  if (!isLoggedIn && !pending) {
    return <Navigate to="/register" replace />;
  }
  if (isLoggedIn && user?.role && !pending) {
    return <Navigate to={ROLE_ROUTES[user.role as UserRole] ?? "/dashboard"} replace />;
  }
  return <RoleSelect />;
}

function AppRoutes() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/opportunities" element={<Opportunities />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/role-select" element={<RoleSelectGuard />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
