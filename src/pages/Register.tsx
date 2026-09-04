import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, Globe, CheckCircle, AlertCircle, Phone,
  Mail, User, Lock, Shield, RefreshCw, ArrowRight, ArrowLeft, X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// ─── Password strength ───────────────────────────────────────────────────────
function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald"];
const STRENGTH_TEXT = ["", "text-red-500", "text-orange-500", "text-yellow-600", "text-emerald"];

// ─── Social button ────────────────────────────────────────────────────────────
function SocialBtn({ icon, label, onClick, loading }: { icon: string; label: string; onClick: () => void; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-navy/15
                 bg-white hover:bg-soft hover:border-navy/30 text-sm font-medium text-navy transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-royal-300 disabled:opacity-60"
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );
}

// ─── OTP Step ─────────────────────────────────────────────────────────────────
function OTPStep({ mobile, onVerified, onBack }: { mobile: string; onVerified: () => void; onBack: () => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [sent, setSent] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((r) => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    text.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter all 6 digits."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    // Mock: accept any 6-digit OTP (in production: validate against server)
    setLoading(false);
    if (code === "000000") { setError("Invalid OTP. Try again."); return; }
    onVerified();
  };

  const handleResend = () => {
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSent(true);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-navy/55 hover:text-navy transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="text-center">
        <div className="w-14 h-14 bg-royal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Phone size={24} className="text-royal" />
        </div>
        <h2 className="text-xl font-bold text-navy">Verify your mobile</h2>
        <p className="text-navy/55 text-sm mt-1.5">
          We sent a 6-digit code to <span className="font-semibold text-navy">{mobile}</span>
        </p>
        <p className="text-xs text-navy/40 mt-1">(For demo, any 6 digits except 000000 will work)</p>
      </div>

      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => { inputRefs.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200
                        ${digit ? "border-royal bg-royal-50 text-royal" : "border-navy/15 bg-white text-navy"}
                        focus:border-royal focus:ring-2 focus:ring-royal-200`}
          />
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <button
        onClick={handleVerify}
        disabled={loading || otp.join("").length !== 6}
        className="btn-primary w-full justify-center"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Verifying…
          </span>
        ) : "Verify & Continue"}
      </button>

      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-sm text-navy/45">Resend code in <span className="font-semibold text-navy">{resendTimer}s</span></p>
        ) : (
          <button onClick={handleResend} className="flex items-center gap-1.5 text-sm text-royal hover:underline mx-auto">
            <RefreshCw size={13} /> Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Register Page ────────────────────────────────────────────────────────
export default function Register() {
  const { register, loginSocial, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.password);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!/^\+?[\d\s\-()]{8,15}$/.test(form.mobile)) errs.mobile = "Enter a valid mobile number.";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    else if (strength < 2) errs.password = "Password is too weak. Add uppercase, numbers, or symbols.";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    if (!validate()) return;
    setLoading(true);
    const res = await register({ name: form.name, email: form.email, mobile: form.mobile, password: form.password });
    setLoading(false);
    if (res.success) {
      setStep("otp");
    } else if (res.error?.field) {
      setErrors({ [res.error.field]: res.error.message });
    }
  };

  const handleOTPVerified = () => {
    navigate("/login?registered=true");
  };

  const handleSocial = async (provider: "google" | "facebook" | "apple") => {
    setSocialLoading(provider);
    await loginSocial(provider);
    setSocialLoading(null);
    navigate("/role-select");
  };

  const set = (field: string, val: string) => {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: "" }));
    clearAuthError();
  };

  return (
    <div className="min-h-screen bg-soft flex">
      {/* Left panel — visual */}
      <div className="hidden lg:flex lg:w-[44%] relative overflow-hidden bg-navy flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(37,99,235,0.25) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(212,167,44,0.2) 0%, transparent 55%)",
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
            <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Your Journey Begins Here</p>
            <h2 className="text-white text-4xl font-black leading-tight">
              One account.<br />27 countries.<br />Infinite possibilities.
            </h2>
            <p className="text-white/60 mt-4 leading-relaxed max-w-sm">
              Join 2.1M+ people who found their dream career, university, and home across Europe — all through Europium.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { icon: "🎓", text: "850+ European universities with scholarships" },
              { icon: "💼", text: "12,400+ verified jobs with visa sponsorship" },
              { icon: "🏠", text: "28,000+ curated properties across 27 countries" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <p className="text-white/70 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
          {/* Social proof */}
          <div className="flex items-center gap-3 bg-white/8 rounded-2xl px-5 py-4 border border-white/10">
            <div className="flex -space-x-2">
              {["priya", "arjun", "sneha"].map((s) => (
                <img key={s} src={`https://picsum.photos/seed/${s}/40/40`} alt="" className="w-8 h-8 rounded-full border-2 border-navy" />
              ))}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">2.1M+ members</p>
              <p className="text-white/50 text-xs">joined this year</p>
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

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[460px]">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-navy flex items-center justify-center">
              <Globe size={16} className="text-white" />
            </div>
            <span className="text-xl font-black text-navy">Europium</span>
          </Link>

          {step === "otp" ? (
            <OTPStep
              mobile={form.mobile}
              onVerified={handleOTPVerified}
              onBack={() => setStep("form")}
            />
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-royal flex items-center justify-center text-xs text-white font-bold">1</div>
                  <span className="text-xs text-navy/50">Step 1 of 2 — Account Details</span>
                </div>
                <h1 className="text-2xl font-black text-navy">Create your account</h1>
                <p className="text-navy/55 text-sm mt-1">
                  Already registered?{" "}
                  <Link to="/login" className="text-royal font-semibold hover:underline">Sign in</Link>
                </p>
              </div>

              {/* Global API error */}
              {authError && !authError.field && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl mb-5 text-sm">
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{authError.message}</span>
                  <button onClick={clearAuthError} className="ml-auto"><X size={14} /></button>
                </div>
              )}

              {/* Social logins */}
              <div className="flex gap-3 mb-5">
                <SocialBtn icon="🇬" label="Google" loading={socialLoading === "google"} onClick={() => handleSocial("google")} />
                <SocialBtn icon="🍎" label="Apple" loading={socialLoading === "apple"} onClick={() => handleSocial("apple")} />
                <SocialBtn icon="📘" label="Facebook" loading={socialLoading === "facebook"} onClick={() => handleSocial("facebook")} />
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-navy/10" />
                <span className="text-xs text-navy/40 font-medium">or register with email</span>
                <div className="flex-1 h-px bg-navy/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-navy/60 uppercase tracking-wide mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Priya Sharma"
                      className={`input-base pl-10 ${errors.name ? "border-red-400 focus:ring-red-200" : ""}`}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-navy/60 uppercase tracking-wide mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      className={`input-base pl-10 ${errors.email || (authError?.field === "email") ? "border-red-400 focus:ring-red-200" : ""}`}
                      autoComplete="email"
                    />
                  </div>
                  {(errors.email || (authError?.field === "email")) && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.email || authError?.message}</p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-semibold text-navy/60 uppercase tracking-wide mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => set("mobile", e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`input-base pl-10 ${errors.mobile ? "border-red-400 focus:ring-red-200" : ""}`}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.mobile && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.mobile}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-navy/60 uppercase tracking-wide mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="Min. 8 characters"
                      className={`input-base pl-10 pr-11 ${errors.password ? "border-red-400 focus:ring-red-200" : ""}`}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 hover:text-navy/60 transition-colors p-1">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Strength meter */}
                  {form.password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= strength ? STRENGTH_COLORS[strength] : "bg-navy/10"}`} />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${STRENGTH_TEXT[strength]}`}>{STRENGTH_LABELS[strength]}</p>
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.password}</p>}
                </div>

                {/* Confirm */}
                <div>
                  <label className="block text-xs font-semibold text-navy/60 uppercase tracking-wide mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirm}
                      onChange={(e) => set("confirm", e.target.value)}
                      placeholder="Repeat password"
                      className={`input-base pl-10 pr-11 ${errors.confirm ? "border-red-400 focus:ring-red-200" : ""}`}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 hover:text-navy/60 transition-colors p-1">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {form.confirm && form.password === form.confirm && (
                      <CheckCircle size={16} className="absolute right-9 top-1/2 -translate-y-1/2 text-emerald" />
                    )}
                  </div>
                  {errors.confirm && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.confirm}</p>}
                </div>

                {/* Security note */}
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl">
                  <Shield size={14} className="text-emerald flex-shrink-0" />
                  <p className="text-xs text-emerald font-medium">Secure, encrypted connection · Your data is protected</p>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3.5">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Continue to Verify <ArrowRight size={16} /></span>
                  )}
                </button>

                <p className="text-center text-xs text-navy/40 leading-relaxed">
                  By registering, you agree to our{" "}
                  <Link to="/terms" className="text-royal hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-royal hover:underline">Privacy Policy</Link>.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
