import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, CheckCircle, ArrowRight, Shield } from "lucide-react";
import { useAuth, ROLE_ROUTES } from "@/contexts/AuthContext";
import type { UserRole } from "@/types";

interface RoleOption {
  role: UserRole;
  emoji: string;
  label: string;
  description: string;
  features: string[];
  accent: string;
  bg: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "Traveler",
    emoji: "✈️",
    label: "Travel",
    description: "Explore Europe's most beautiful destinations",
    features: ["City guides & itineraries", "Visa-free travel info", "Budget calculators"],
    accent: "text-sky-600",
    bg: "bg-sky-50 border-sky-200",
  },
  {
    role: "Student",
    emoji: "🎓",
    label: "Study",
    description: "Find your dream European university",
    features: ["850+ universities", "Scholarship finder", "Student housing"],
    accent: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
  },
  {
    role: "JobSeeker",
    emoji: "💼",
    label: "Find a Job",
    description: "Land a career in Europe's top companies",
    features: ["12,400+ verified jobs", "Visa sponsorship", "Resume builder"],
    accent: "text-royal",
    bg: "bg-royal-50 border-royal-200",
  },
  {
    role: "Professional",
    emoji: "🌍",
    label: "Relocate / Professional",
    description: "Make Europe your permanent home",
    features: ["Relocation guides", "Tax & legal tips", "Expat community"],
    accent: "text-emerald",
    bg: "bg-emerald-50 border-emerald-200",
  },
  {
    role: "Entrepreneur",
    emoji: "🚀",
    label: "Start / Expand a Business",
    description: "Build your European venture",
    features: ["Company formation", "EU grants & funding", "Market insights"],
    accent: "text-gold-500",
    bg: "bg-gold-50 border-gold-200",
  },
  {
    role: "Employer",
    emoji: "🤝",
    label: "Hire Talent",
    description: "Find exceptional global talent for your team",
    features: ["Post unlimited jobs", "Candidate screening", "Visa support"],
    accent: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
  },
  {
    role: "PropertyProvider",
    emoji: "🏠",
    label: "List Property",
    description: "Rent or sell to a global audience",
    features: ["Verified tenant matching", "Smart pricing tools", "Analytics dashboard"],
    accent: "text-rose-600",
    bg: "bg-rose-50 border-rose-200",
  },
];

export default function RoleSelect() {
  const { setRole, user, getPendingAccount } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  // If neither user nor pending, they shouldn't be here
  const displayName = user?.name ?? getPendingAccount()?.name ?? "there";

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setRole(selected);
    const dest = ROLE_ROUTES[selected] ?? "/dashboard";
    navigate(dest, { replace: true });
  };

  return (
    <div className="min-h-screen bg-soft">
      {/* Header */}
      <div className="bg-navy py-5 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <Globe size={18} className="text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">Europium</span>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-xs">
          <Shield size={12} />
          Step 2 of 2
        </div>
      </div>

      <div className="container-app py-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1.5 bg-royal-50 text-royal rounded-full text-sm font-semibold mb-4 border border-royal-200">
              Welcome, {displayName.split(" ")[0]}! 👋
            </div>
            <h1 className="text-navy font-black mb-3" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
              What brings you to Europe?
            </h1>
            <p className="text-navy/55 text-base max-w-md mx-auto leading-relaxed">
              Choose your goal and we'll tailor your dashboard, recommendations, and tools just for you.
            </p>
          </div>

          {/* Role cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {ROLE_OPTIONS.map((opt) => {
              const isSelected = selected === opt.role;
              return (
                <button
                  key={opt.role}
                  onClick={() => setSelected(opt.role)}
                  className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 focus:outline-none
                              hover:-translate-y-0.5 hover:shadow-card-hover
                              ${isSelected
                                ? `${opt.bg} border-current shadow-card-hover scale-[1.01]`
                                : "bg-white border-navy/10 hover:border-navy/25"
                              }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-royal flex items-center justify-center">
                      <CheckCircle size={14} className="text-white fill-white/20" />
                    </div>
                  )}
                  <span className="text-3xl mb-3 block">{opt.emoji}</span>
                  <h3 className={`font-bold mb-1 text-base ${isSelected ? opt.accent : "text-navy"}`}>{opt.label}</h3>
                  <p className="text-xs text-navy/55 mb-3 leading-relaxed">{opt.description}</p>
                  <div className="space-y-1">
                    {opt.features.map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-xs text-navy/50">
                        <div className={`w-1 h-1 rounded-full ${isSelected ? opt.accent.replace("text-", "bg-") : "bg-navy/25"}`} />
                        {f}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selected || loading}
              className="btn-primary px-10 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up your dashboard…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue to Dashboard <ArrowRight size={17} />
                </span>
              )}
            </button>
            {!selected && <p className="text-xs text-navy/40 mt-2">Select an option above to continue</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
