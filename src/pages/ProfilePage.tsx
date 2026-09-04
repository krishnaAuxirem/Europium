import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Globe2, Linkedin, Languages,
  Shield, CheckCircle, Edit3, Save, X, Camera, ChevronRight,
  Briefcase, GraduationCap, BookmarkCheck, Star, LogOut, Award
} from "lucide-react";
import { useAuth, ROLE_ROUTES } from "@/contexts/AuthContext";
import { JOBS, UNIVERSITIES } from "@/constants/mockData";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/layout/ToastContainer";
import type { UserRole } from "@/types";

const ROLE_LABELS: Record<string, string> = {
  Traveler: "✈️ Traveler",
  Student: "🎓 Student",
  JobSeeker: "💼 Job Seeker",
  Professional: "🌍 Professional",
  Entrepreneur: "🚀 Entrepreneur",
  Employer: "🤝 Employer",
  PropertyProvider: "🏠 Property Provider",
  Admin: "⚙️ Administrator",
};

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    location: user?.location ?? "",
    bio: user?.bio ?? "",
    targetCountry: user?.targetCountry ?? "",
    linkedIn: user?.linkedIn ?? "",
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const savedJobsData = JOBS.filter((j) => user.savedJobs.includes(j.id));
  const savedUnisData = UNIVERSITIES.filter((u) => user.savedUniversities.includes(u.id));

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    addToast("Profile updated successfully!", "success");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    addToast("Signed out. See you soon!", "info");
  };

  const completionItems = [
    { label: "Full Name", done: !!user.name },
    { label: "Profile Photo", done: true },
    { label: "Location", done: !!user.location },
    { label: "Bio", done: !!user.bio },
    { label: "LinkedIn Profile", done: !!user.linkedIn },
    { label: "Target Country", done: !!user.targetCountry },
  ];
  const completionPct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  return (
    <div className="min-h-screen bg-soft pt-16">
      <div className="container-app py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-navy">My Profile</h2>
            <div className="flex items-center gap-3">
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-2 px-4 flex items-center gap-1.5">
                    <X size={14} /> Cancel
                  </button>
                  <button onClick={handleSave} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                    <Save size={14} /> Save Changes
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2 px-4 flex items-center gap-1.5">
                  <Edit3 size={14} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile card */}
          <div className="card-base overflow-hidden">
            {/* Cover gradient */}
            <div className="h-28 bg-gradient-to-r from-navy via-royal to-royal-400 relative">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212,167,44,0.5), transparent)" }} />
            </div>
            <div className="px-6 pb-6">
              {/* Avatar + basic info */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-5">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover border-3 border-white shadow-md" style={{ borderWidth: 3 }} />
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-royal rounded-full flex items-center justify-center hover:bg-royal-600 transition-colors">
                    <Camera size={12} className="text-white" />
                  </button>
                </div>
                <div className="flex-1 sm:pb-2">
                  {editing ? (
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-base text-xl font-bold py-2 mb-1"
                    />
                  ) : (
                    <h3 className="text-xl font-black text-navy">{user.name}</h3>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-navy/60 bg-navy/5 px-3 py-1 rounded-full">
                      {ROLE_LABELS[user.role] ?? user.role}
                    </span>
                    <span className="badge-verified text-xs">✓ Verified</span>
                    {user.premiumMember && <span className="badge-premium text-xs">★ Premium</span>}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-100"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>

              {/* Detail fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { icon: <Mail size={15} />, label: "Email", value: user.email, key: null, type: "email" },
                  { icon: <Phone size={15} />, label: "Mobile", value: user.mobile ?? "—", key: null, type: "tel" },
                  { icon: <MapPin size={15} />, label: "Current Location", value: user.location, key: "location", type: "text" },
                  { icon: <Globe2 size={15} />, label: "Target Country", value: user.targetCountry ?? "", key: "targetCountry", type: "text" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1.5">
                      <span className="text-navy/35">{f.icon}</span> {f.label}
                    </label>
                    {editing && f.key ? (
                      <input
                        type={f.type}
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [f.key as string]: e.target.value })}
                        className="input-base"
                        placeholder={`Enter ${f.label.toLowerCase()}`}
                      />
                    ) : (
                      <p className="text-sm text-navy font-medium px-1">{f.value || <span className="text-navy/30 italic">Not set</span>}</p>
                    )}
                  </div>
                ))}

                {/* LinkedIn */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1.5">
                    <Linkedin size={15} className="text-navy/35" /> LinkedIn
                  </label>
                  {editing ? (
                    <input
                      type="url"
                      value={form.linkedIn}
                      onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                      className="input-base"
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  ) : (
                    <p className="text-sm text-royal font-medium px-1">
                      {user.linkedIn ? (
                        <a href={user.linkedIn} target="_blank" rel="noreferrer" className="hover:underline">{user.linkedIn}</a>
                      ) : <span className="text-navy/30 italic">Not set</span>}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1.5">Bio</label>
                  {editing ? (
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      className="input-base min-h-[80px] resize-none"
                      placeholder="Tell us about yourself and your Europe goals..."
                    />
                  ) : (
                    <p className="text-sm text-navy/70 leading-relaxed px-1">
                      {user.bio || <span className="text-navy/30 italic">Add a short bio to help employers and universities know you better.</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile completeness */}
            <div className="card-base p-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <Award size={16} className="text-gold-500" /> Profile Strength
              </h3>
              <div className="text-center mb-4">
                <div className="relative w-20 h-20 mx-auto">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke={completionPct >= 80 ? "#16A34A" : completionPct >= 50 ? "#D4A72C" : "#2563EB"}
                      strokeWidth="2.5"
                      strokeDasharray={`${completionPct} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-black text-navy">{completionPct}%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {completionItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle size={14} className="text-emerald flex-shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-navy/20 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${item.done ? "text-navy/50 line-through" : "text-navy font-medium"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="lg:col-span-2 card-base p-6">
              <h3 className="font-bold text-navy mb-4">Activity Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                {[
                  { label: "Applied", value: user.appliedJobs.length, icon: <Briefcase size={18} />, color: "text-royal bg-royal-50" },
                  { label: "Saved Jobs", value: user.savedJobs.length, icon: <BookmarkCheck size={18} />, color: "text-gold-500 bg-gold-50" },
                  { label: "Universities", value: user.savedUniversities.length, icon: <GraduationCap size={18} />, color: "text-purple-600 bg-purple-50" },
                  { label: "Member Since", value: user.joinedDate.split(" ")[0], icon: <Star size={18} />, color: "text-emerald bg-emerald-50" },
                ].map((s) => (
                  <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
                    <div className="flex justify-center mb-2">{s.icon}</div>
                    <p className="text-xl font-black text-navy">{s.value}</p>
                    <p className="text-xs opacity-60 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Role dashboard link */}
              <Link
                to={ROLE_ROUTES[user.role as UserRole] ?? "/dashboard"}
                className="flex items-center justify-between p-4 bg-navy/4 hover:bg-navy/8 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-royal rounded-xl flex items-center justify-center">
                    <span className="text-lg">{ROLE_LABELS[user.role]?.split(" ")[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">Go to Dashboard</p>
                    <p className="text-xs text-navy/50">{ROLE_LABELS[user.role] ?? user.role} view</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-navy/35" />
              </Link>
            </div>
          </div>

          {/* Saved items preview */}
          {(savedJobsData.length > 0 || savedUnisData.length > 0) && (
            <div className="card-base p-6">
              <h3 className="font-bold text-navy mb-4">Recently Saved</h3>
              <div className="space-y-3">
                {savedJobsData.slice(0, 2).map((job) => (
                  <div key={job.id} className="flex items-center gap-3 p-3 bg-soft rounded-xl">
                    <img src={job.companyLogo} alt="" className="w-10 h-10 rounded-xl object-cover border border-navy/8" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-navy text-sm truncate">{job.title}</p>
                      <p className="text-xs text-navy/50">{job.company} · {job.countryFlag} {job.location}</p>
                    </div>
                    <Link to="/jobs" className="text-xs text-royal hover:underline whitespace-nowrap">View →</Link>
                  </div>
                ))}
                {savedUnisData.slice(0, 1).map((uni) => (
                  <div key={uni.id} className="flex items-center gap-3 p-3 bg-soft rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl">{uni.countryFlag}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-navy text-sm truncate">{uni.name}</p>
                      <p className="text-xs text-navy/50">{uni.city} · {uni.rankLabel}</p>
                    </div>
                    <Link to="/universities" className="text-xs text-royal hover:underline whitespace-nowrap">View →</Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
