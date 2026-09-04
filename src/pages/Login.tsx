import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Globe, Shield, AlertCircle, CheckCircle, X, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types";
import { ROLE_ROUTES } from "@/contexts/AuthContext";

// ─── Demo credentials ─────────────────────────────────────────────────────────
const DEMO_CREDS = [
  { label: "Demo User", email: "demo.user@europium.com", password: "Demo@123", role: "Job Seeker" },
  { label: "Demo Admin", email: "admin@europium.com", password: "Admin@123", role: "Admin" },
];

// ─── Forgot Password flow ─────────────────────────────────────────────────────
function ForgotPassword({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address."); return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle size={28} className="text-emerald" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy">Check your inbox</h2>
          <p className="text-navy/55 text-sm mt-2">
            We've sent a password reset link to <span className="font-semibold text-navy">{email}</span>.<br />
            Check your spam folder if you don't see it.
          </p>
        </div>
        <button onClick={onBack} className="btn-primary w-full justify-center">Back to Login</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-navy/55 hover:text-navy transition-colors">
        ← Back to login
      </button>
      <div>
        <h2 className="text-2xl font-black text-navy">Reset your password</h2>
        <p className="text-navy/55 text-sm mt-1">Enter your email and we'll send you a reset link.</p>
      </div>
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-navy/60 uppercase tracking-wide mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              className={`input-base pl-10 ${error ? "border-red-400" : ""}`}
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending…
            </span>
          ) : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function Login() {
  const { login, loginSocial, authError, clearAuthError, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/dashboard";

  const justRegistered = new URLSearchParams(location.search).get("registered") === "true";

  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Already logged in → redirect
  useEffect(() => {
    if (isLoggedIn && user) {
      const dest = ROLE_ROUTES[user.role as UserRole] ?? "/dashboard";
      navigate(dest, { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  const setField = (f: string, v: string) => {
    if (f === "email") setEmail(v);
    else setPassword(v);
    setFieldErrors((e) => ({ ...e, [f]: "" }));
    clearAuthError();
  };

  const autofill = (cred: typeof DEMO_CREDS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setFieldErrors({});
    clearAuthError();
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    if (!password) errs.password = "Please enter your password.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await login(email, password, remember);
    setLoading(false);
    if (res.success) {
      // Role selection check is done in App routing
      navigate(from === "/login" ? "/dashboard" : from, { replace: true });
    } else if (res.error?.field) {
      setFieldErrors({ [res.error.field]: res.error.message });
    }
  };

  const handleSocial = async (provider: "google" | "facebook" | "apple") => {
    setSocialLoading(provider);
    await loginSocial(provider);
    setSocialLoading(null);
    navigate("/role-select");
  };

  return (
    <div className="min-h-screen bg-soft flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[44%] relative overflow-hidden bg-navy flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 25% 25%, rgba(37,99,235,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(212,167,44,0.2) 0%, transparent 50%)",
            }}
          />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px)" }}
          />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Globe size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">Europium</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Welcome Back</p>
            <h2 className="text-white text-4xl font-black leading-tight">
              Your Europe<br />journey continues.
            </h2>
            <p className="text-white/60 mt-4 leading-relaxed max-w-sm">
              Pick up right where you left off — your saved jobs, applications, and properties are all waiting for you.
            </p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "2.1M+", l: "Active Members" },
              { v: "94%", l: "Placement Rate" },
              { v: "27", l: "Countries" },
              { v: "₹0", l: "Platform Fee" },
            ].map((s) => (
              <div key={s.l} className="bg-white/8 rounded-2xl px-5 py-4 border border-white/10">
                <p className="text-2xl font-black text-white">{s.v}</p>
                <p className="text-xs text-white/55 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/8 border border-white/10 rounded-2xl px-5 py-4">
            <p className="text-white/80 text-sm italic">
              "I found my job at SAP and my flat in Berlin through Europium. It was the only platform I needed."
            </p>
            <div className="flex items-center gap-3 mt-3">
              <img src="https://picsum.photos/seed/priya/40/40" alt="" className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-white text-xs font-semibold">Priya Sharma</p>
                <p className="text-white/45 text-xs">Software Engineer · Berlin</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Shield size={12} />
            <span>256-bit SSL encryption · GDPR compliant · ISO 27001</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-navy flex items-center justify-center">
              <Globe size={16} className="text-white" />
            </div>
            <span className="text-xl font-black text-navy">Europium</span>
          </Link>

          {showForgot ? (
            <ForgotPassword onBack={() => setShowForgot(false)} />
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-navy">Sign in to Europium</h1>
                <p className="text-navy/55 text-sm mt-1">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-royal font-semibold hover:underline">Register free</Link>
                </p>
              </div>

              {/* Success after registration */}
              {justRegistered && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald px-4 py-3 rounded-xl mb-5 text-sm">
                  <CheckCircle size={15} />
                  <span>Account created! Sign in to continue.</span>
                </div>
              )}

              {/* Demo credentials */}
              <div className="bg-navy/4 border border-navy/10 rounded-2xl p-4 mb-5">
                <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-3">Quick Demo Access</p>
                <div className="space-y-2">
                  {DEMO_CREDS.map((cred) => (
                    <button
                      key={cred.email}
                      type="button"
                      onClick={() => autofill(cred)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-navy/10
                                 rounded-xl hover:border-royal hover:bg-royal-50 transition-all duration-150 text-left"
                    >
                      <div>
                        <p className="text-sm font-semibold text-navy">{cred.label}</p>
                        <p className="text-xs text-navy/45">{cred.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-navy/45">pw: <span className="font-mono text-navy/70">{cred.password}</span></p>
                        <p className="text-xs text-royal font-medium mt-0.5">Click to fill →</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth error */}
              {authError && !authError.field && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl mb-5 text-sm">
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                  <span className="flex-1">{authError.message}</span>
                  <button onClick={clearAuthError}><X size={14} /></button>
                </div>
              )}

              {/* Social */}
              <div className="flex gap-3 mb-5">
                {[
                  { provider: "google" as const, icon: "🇬", label: "Google" },
                  { provider: "apple" as const, icon: "🍎", label: "Apple" },
                  { provider: "facebook" as const, icon: "📘", label: "Facebook" },
                ].map(({ provider, icon, label }) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => handleSocial(provider)}
                    disabled={!!socialLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-navy/15
                               bg-white hover:bg-soft hover:border-navy/30 text-sm font-medium text-navy transition-all
                               disabled:opacity-60"
                  >
                    {socialLoading === provider ? (
                      <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                    ) : <span className="text-base">{icon}</span>}
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-navy/10" />
                <span className="text-xs text-navy/40 font-medium">or continue with email</span>
                <div className="flex-1 h-px bg-navy/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-navy/60 uppercase tracking-wide mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="you@example.com"
                      className={`input-base pl-10 ${fieldErrors.email || authError?.field === "email" ? "border-red-400 focus:ring-red-200" : ""}`}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {(fieldErrors.email || authError?.field === "email") && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={11} />
                      {fieldErrors.email || authError?.message}
                      {authError?.field === "email" && (
                        <Link to="/register" className="ml-1 text-royal underline">Register →</Link>
                      )}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-navy/60 uppercase tracking-wide">Password</label>
                    <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-royal hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setField("password", e.target.value)}
                      placeholder="Your password"
                      className={`input-base pl-10 pr-11 ${fieldErrors.password || authError?.field === "password" ? "border-red-400 focus:ring-red-200" : ""}`}
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 hover:text-navy/60 p-1">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {(fieldErrors.password || authError?.field === "password") && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={11} />{fieldErrors.password || authError?.message}
                    </p>
                  )}
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setRemember(!remember)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                                ${remember ? "bg-royal border-royal" : "border-navy/25 group-hover:border-royal"}`}
                  >
                    {remember && <CheckCircle size={12} className="text-white fill-white" />}
                  </div>
                  <span className="text-sm text-navy/65 select-none">Remember me for 30 days</span>
                </label>

                {/* Secure note */}
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl">
                  <Shield size={13} className="text-emerald flex-shrink-0" />
                  <p className="text-xs text-emerald font-medium">Secure, encrypted connection · Your session is protected</p>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3.5">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in…
                    </span>
                  ) : "Sign In to Europium"}
                </button>
              </form>

              <p className="text-center text-xs text-navy/40 mt-4">
                New here?{" "}
                <Link to="/register" className="text-royal hover:underline font-medium">Create a free account</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
