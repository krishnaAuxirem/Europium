import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import FloatingScrollTop from "@/components/layout/FloatingScrollTop";

const Home = lazy(() => import("@/pages/Home"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const Universities = lazy(() => import("@/pages/Universities"));
const Properties = lazy(() => import("@/pages/Properties"));
const Destinations = lazy(() => import("@/pages/Destinations"));
const Opportunities = lazy(() => import("@/pages/Opportunities"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-soft flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-3 border-royal border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
        <p className="text-navy/40 text-sm font-medium">Loading Europium...</p>
      </div>
    </div>
  );
}

// Pages that DON'T use the full footer (e.g., dashboard can skip it or use it)
const PAGES_WITH_FOOTER = ["/", "/jobs", "/universities", "/properties", "/destinations", "/opportunities"];

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingScrollTop />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/universities" element={<Universities />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/saved" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
