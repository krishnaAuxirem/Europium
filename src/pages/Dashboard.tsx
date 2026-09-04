import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import {
  Briefcase, GraduationCap, Home, MapPin, Star, Bell, TrendingUp, Eye,
  BookmarkCheck, Calendar, User, CheckCircle, Clock, Zap, ChevronRight,
  Award, Map, Building2, Users, DollarSign, Package, LogOut,
} from "lucide-react";
import { useAuth, ROLE_ROUTES } from "@/contexts/AuthContext";
import { DASHBOARD_STATS, JOBS, UNIVERSITIES } from "@/constants/mockData";
import { useNavigate as useNav } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/layout/ToastContainer";
import type { UserRole } from "@/types";

const PROFILE_VIEWS_DATA = [
  { day: "Mon", views: 12 }, { day: "Tue", views: 28 }, { day: "Wed", views: 19 },
  { day: "Thu", views: 45 }, { day: "Fri", views: 38 }, { day: "Sat", views: 22 }, { day: "Sun", views: 33 },
];

const MONTHLY_DATA = [
  { month: "Apr", applications: 2, views: 120 }, { month: "May", applications: 3, views: 180 },
  { month: "Jun", applications: 4, views: 240 }, { month: "Jul", applications: 3, views: 195 },
  { month: "Aug", applications: 6, views: 310 }, { month: "Sep", applications: 12, views: 847 },
];

const activityIcons: Record<string, React.ReactNode> = {
  application: <Briefcase size={14} className="text-royal" />,
  save: <BookmarkCheck size={14} className="text-gold-500" />,
  view: <Eye size={14} className="text-purple-500" />,
  message: <Calendar size={14} className="text-emerald" />,
  match: <Zap size={14} className="text-orange-500" />,
};

const activityColors: Record<string, string> = {
  application: "bg-royal-50",
  save: "bg-gold-50",
  view: "bg-purple-50",
  message: "bg-emerald-50",
  match: "bg-orange-50",
};

const ROLE_LABELS: Record<string, string> = {
  Traveler: "✈️ Traveler",
  Student: "🎓 Student",
  JobSeeker: "💼 Job Seeker",
  Professional: "🌍 Professional",
  Entrepreneur: "🚀 Entrepreneur",
  Employer: "🤝 Employer",
  PropertyProvider: "🏠 Property Provider",
  Admin: "⚙️ Admin",
};

// Role-specific KPIs
function getRoleKPIs(role: UserRole, stats: typeof DASHBOARD_STATS, user: { savedJobs: string[]; savedUniversities: string[]; savedProperties: string[]; appliedJobs: string[] }) {
  switch (role) {
    case "Student":
      return [
        { label: "Universities Saved", value: user.savedUniversities.length.toString(), icon: <GraduationCap size={20} />, color: "text-purple-600", bg: "bg-purple-50", trend: "3 with scholarships" },
        { label: "Applications", value: user.appliedJobs.length.toString(), icon: <Briefcase size={20} />, color: "text-royal", bg: "bg-royal-50", trend: "2 shortlisted" },
        { label: "Scholarships Found", value: "12", icon: <Award size={20} />, color: "text-gold-500", bg: "bg-gold-50", trend: "₹21L+ available" },
        { label: "Profile Views", value: stats.profileViews.toLocaleString("en-IN"), icon: <Eye size={20} />, color: "text-emerald", bg: "bg-emerald-50", trend: "+12% this week" },
      ];
    case "Traveler":
      return [
        { label: "Destinations Saved", value: user.savedProperties.length.toString(), icon: <Map size={20} />, color: "text-sky-600", bg: "bg-sky-50", trend: "6 bucket list" },
        { label: "Trip Cost Est.", value: "₹1.8L", icon: <DollarSign size={20} />, color: "text-emerald", bg: "bg-emerald-50", trend: "3 countries" },
        { label: "Visa Free", value: "18", icon: <CheckCircle size={20} />, color: "text-royal", bg: "bg-royal-50", trend: "countries accessible" },
        { label: "Days Planned", value: "21", icon: <Calendar size={20} />, color: "text-gold-500", bg: "bg-gold-50", trend: "Oct – Nov 2026" },
      ];
    case "Employer":
      return [
        { label: "Jobs Posted", value: "8", icon: <Briefcase size={20} />, color: "text-orange-600", bg: "bg-orange-50", trend: "3 active" },
        { label: "Applicants", value: "247", icon: <Users size={20} />, color: "text-royal", bg: "bg-royal-50", trend: "+34 this week" },
        { label: "Interviews", value: "12", icon: <Calendar size={20} />, color: "text-emerald", bg: "bg-emerald-50", trend: "5 scheduled" },
        { label: "Hires", value: "3", icon: <CheckCircle size={20} />, color: "text-gold-500", bg: "bg-gold-50", trend: "this quarter" },
      ];
    case "PropertyProvider":
      return [
        { label: "Properties Listed", value: "5", icon: <Home size={20} />, color: "text-rose-600", bg: "bg-rose-50", trend: "3 occupied" },
        { label: "Monthly Revenue", value: "₹3.2L", icon: <DollarSign size={20} />, color: "text-emerald", bg: "bg-emerald-50", trend: "+8% MoM" },
        { label: "Enquiries", value: "48", icon: <Bell size={20} />, color: "text-royal", bg: "bg-royal-50", trend: "12 this week" },
        { label: "Avg Rating", value: "4.7★", icon: <Star size={20} />, color: "text-gold-500", bg: "bg-gold-50", trend: "from 31 reviews" },
      ];
    case "Entrepreneur":
      return [
        { label: "EU Grants Found", value: "23", icon: <Package size={20} />, color: "text-gold-500", bg: "bg-gold-50", trend: "₹48L available" },
        { label: "Connections", value: "94", icon: <Users size={20} />, color: "text-royal", bg: "bg-royal-50", trend: "+18 this month" },
        { label: "Markets", value: "7", icon: <Map size={20} />, color: "text-emerald", bg: "bg-emerald-50", trend: "countries researched" },
        { label: "Profile Views", value: stats.profileViews.toString(), icon: <Eye size={20} />, color: "text-purple-600", bg: "bg-purple-50", trend: "+22% this week" },
      ];
    case "Admin":
      return [
        { label: "Total Users", value: "2.1M+", icon: <Users size={20} />, color: "text-royal", bg: "bg-royal-50", trend: "+12k this week" },
        { label: "Active Jobs", value: "12,400+", icon: <Briefcase size={20} />, color: "text-gold-500", bg: "bg-gold-50", trend: "across 27 countries" },
        { label: "Properties", value: "28,000+", icon: <Home size={20} />, color: "text-emerald", bg: "bg-emerald-50", trend: "verified listings" },
        { label: "System Health", value: "99.9%", icon: <CheckCircle size={20} />, color: "text-purple-600", bg: "bg-purple-50", trend: "uptime this month" },
      ];
    default: // JobSeeker / Professional
      return [
        { label: "Profile Views", value: stats.profileViews.toLocaleString("en-IN"), icon: <Eye size={20} />, color: "text-royal", bg: "bg-royal-50", trend: "+12% this week" },
        { label: "Applications", value: user.appliedJobs.length.toString(), icon: <Briefcase size={20} />, color: "text-gold-500", bg: "bg-gold-50", trend: `${DASHBOARD_STATS.applicationsByStatus.find((s) => s.name === "Interview")?.value} interviews` },
        { label: "Saved Items", value: (user.savedJobs.length + user.savedUniversities.length + user.savedProperties.length).toString(), icon: <BookmarkCheck size={20} />, color: "text-purple-600", bg: "bg-purple-50", trend: "Across all categories" },
        { label: "Match Score", value: "94%", icon: <Zap size={20} />, color: "text-emerald", bg: "bg-emerald-50", trend: "Top 6% of applicants" },
      ];
  }
}

function RoleBanner({ role }: { role: UserRole }) {
  const messages: Record<UserRole, { headline: string; sub: string; cta: string; ctaPath: string }> = {
    Traveler: { headline: "Plan your perfect European adventure", sub: "Discover 47 destinations with budget calculators, visa guides, and travel tips.", cta: "Explore Destinations", ctaPath: "/destinations" },
    Student: { headline: "Find your dream European university", sub: "850+ universities with scholarships, from ETH Zurich to Sciences Po.", cta: "Browse Universities", ctaPath: "/universities" },
    JobSeeker: { headline: "Land your career in Europe", sub: "12,400+ verified jobs with visa sponsorship across 27 countries.", cta: "Browse Jobs", ctaPath: "/jobs" },
    Professional: { headline: "Relocate to Europe, seamlessly", sub: "From visa guidance to housing — everything you need in one place.", cta: "Find Housing", ctaPath: "/properties" },
    Entrepreneur: { headline: "Build your European business", sub: "EU grants, company formation guides, and market insights for founders.", cta: "Browse Opportunities", ctaPath: "/opportunities" },
    Employer: { headline: "Hire exceptional global talent", sub: "Reach 2.1M+ qualified candidates across Europe and beyond.", cta: "Post a Job", ctaPath: "/jobs" },
    PropertyProvider: { headline: "List your property to 2.1M+ tenants", sub: "Verified tenant matching, smart pricing tools, and analytics.", cta: "View Properties", ctaPath: "/properties" },
    Admin: { headline: "Platform Administration Dashboard", sub: "Full system access — users, content, analytics, and configuration.", cta: "View All Users", ctaPath: "/dashboard/admin" },
  };

  const m = messages[role];

  return (
    <div className="card-base p-6 bg-gradient-to-br from-navy to-royal-700 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(212,167,44,0.6), transparent)" }} />
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">{ROLE_LABELS[role]}</p>
          <h3 className="text-white font-black text-xl mb-1">{m.headline}</h3>
          <p className="text-white/65 text-sm leading-relaxed max-w-xl">{m.sub}</p>
        </div>
        <Link to={m.ctaPath} className="btn-gold text-sm whitespace-nowrap flex-shrink-0">{m.cta}</Link>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, addToast, removeToast } = useToast();
  const [activeSection, setActiveSection] = useState("overview");
  const [profileViews, setProfileViews] = useState(DASHBOARD_STATS.profileViews);
  const [liveCounter, setLiveCounter] = useState(0);

  // If accessed via /saved, default to saved tab
  useEffect(() => {
    if (location.pathname === "/saved") setActiveSection("saved");
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProfileViews((prev) => prev + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let c = 0;
    const t = setInterval(() => { c++; setLiveCounter(c); if (c >= (user?.appliedJobs.length ?? 12)) clearInterval(t); }, 150);
    return () => clearInterval(t);
  }, [user]);

  // user is guaranteed by ProtectedRoute
  if (!user) return null;

  const savedJobsData = JOBS.filter((j) => user.savedJobs.includes(j.id));
  const savedUnisData = UNIVERSITIES.filter((u) => user.savedUniversities.includes(u.id));
  const kpis = getRoleKPIs(user.role as UserRole, { ...DASHBOARD_STATS, profileViews }, user);

  const NAV_SECTIONS = [
    { id: "overview", label: "Overview", icon: <TrendingUp size={16} /> },
    { id: "applications", label: "Applications", icon: <Briefcase size={16} /> },
    { id: "saved", label: "Saved Items", icon: <BookmarkCheck size={16} /> },
    { id: "profile", label: "My Profile", icon: <User size={16} /> },
  ];

  const greetings: Record<string, string> = {
    Traveler: "Adventure awaits you",
    Student: "Keep learning",
    JobSeeker: "Good morning",
    Professional: "Welcome back",
    Entrepreneur: "Build something great",
    Employer: "Find great talent",
    PropertyProvider: "Manage your listings",
    Admin: "System overview",
  };

  return (
    <div className="min-h-screen bg-soft pt-16">
      <div className="container-app py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card-base p-6 mb-4 text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-royal/20 mx-auto"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald rounded-full border-2 border-white" />
              </div>
              <h3 className="font-bold text-navy">{user.name}</h3>
              <p className="text-xs text-navy/50 mt-0.5">{ROLE_LABELS[user.role] ?? user.role}</p>
              <p className="text-sm text-navy/55 mt-0.5">{user.location}</p>
              {user.premiumMember && (
                <div className="badge-premium mx-auto mt-2">★ Premium</div>
              )}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-navy/55">Profile strength</span>
                  <span className="text-xs font-bold text-royal">{user.profileComplete}%</span>
                </div>
                <div className="w-full h-2 bg-navy/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-royal to-royal-400 rounded-full transition-all duration-1000"
                    style={{ width: `${user.profileComplete}%` }}
                  />
                </div>
                <Link to="/profile" className="text-xs text-royal hover:underline mt-1.5 block">
                  Edit profile →
                </Link>
              </div>
            </div>

            <div className="card-base p-2">
              {NAV_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150
                              ${activeSection === s.id ? "bg-royal text-white" : "text-navy/70 hover:text-navy hover:bg-navy/5"}`}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>

            <div className="card-base p-5 mt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">Quick Actions</p>
              <div className="space-y-2">
                <Link to="/jobs" className="flex items-center justify-between py-2 text-sm text-navy/70 hover:text-royal transition-colors">
                  Browse Jobs <ChevronRight size={14} />
                </Link>
                <Link to="/opportunities" className="flex items-center justify-between py-2 text-sm text-navy/70 hover:text-royal transition-colors">
                  Scholarships <ChevronRight size={14} />
                </Link>
                <Link to="/properties" className="flex items-center justify-between py-2 text-sm text-navy/70 hover:text-royal transition-colors">
                  Find Housing <ChevronRight size={14} />
                </Link>
                <Link to="/profile" className="flex items-center justify-between py-2 text-sm text-navy/70 hover:text-royal transition-colors">
                  My Profile <ChevronRight size={14} />
                </Link>
              </div>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="flex items-center gap-2 mt-4 pt-3 border-t border-navy/8 w-full text-sm text-red-400 hover:text-red-600 transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Overview */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-navy">{greetings[user.role] ?? "Good morning"}, {user.name.split(" ")[0]} 👋</h2>
                    <p className="text-navy/55 text-sm mt-1">Here's your Europium dashboard</p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-emerald">Live</span>
                  </div>
                </div>

                {/* Role banner */}
                <RoleBanner role={user.role as UserRole} />

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpis.map((kpi) => (
                    <div key={kpi.label} className="card-base p-5 hover:-translate-y-0.5 transition-transform duration-200">
                      <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}>
                        {kpi.icon}
                      </div>
                      <p className="text-2xl font-black text-navy">{kpi.value}</p>
                      <p className="text-xs text-navy/50 mt-0.5">{kpi.label}</p>
                      <p className="text-xs text-emerald font-medium mt-1">{kpi.trend}</p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card-base p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold text-navy text-base">Profile Views This Week</h3>
                      <span className="text-xs text-emerald font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">+24% ↑</span>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={PROFILE_VIEWS_DATA}>
                        <defs>
                          <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                        <Area type="monotone" dataKey="views" stroke="#2563EB" strokeWidth={2.5} fill="url(#viewsGrad)" dot={{ fill: "#2563EB", r: 3 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="card-base p-6">
                    <h3 className="font-bold text-navy text-base mb-5">Application Status</h3>
                    <div className="flex items-center gap-6">
                      <ResponsiveContainer width={140} height={140}>
                        <PieChart>
                          <Pie data={DASHBOARD_STATS.applicationsByStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                            {DASHBOARD_STATS.applicationsByStatus.map((entry, idx) => (
                              <Cell key={idx} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2.5 flex-1">
                        {DASHBOARD_STATS.applicationsByStatus.map((s) => (
                          <div key={s.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                              <span className="text-sm text-navy/70">{s.name}</span>
                            </div>
                            <span className="text-sm font-bold text-navy">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity feed */}
                <div className="card-base p-6">
                  <h3 className="font-bold text-navy text-base mb-5">Recent Activity</h3>
                  <div className="space-y-3">
                    {DASHBOARD_STATS.activityTimeline.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-soft transition-colors">
                        <div className={`w-8 h-8 ${activityColors[item.type]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {activityIcons[item.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-navy">{item.action}</p>
                          <p className="text-xs text-navy/55 mt-0.5 truncate">{item.details}</p>
                        </div>
                        <span className="text-xs text-navy/35 whitespace-nowrap">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Applications */}
            {activeSection === "applications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-navy text-2xl font-bold">My Applications</h2>
                  <Link to="/jobs" className="btn-primary text-sm py-2 px-4">Browse More Jobs</Link>
                </div>
                {user.appliedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {JOBS.filter((j) => user.appliedJobs.includes(j.id)).map((job) => (
                      <div key={job.id} className="card-base p-5 flex items-center gap-4">
                        <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-xl object-cover border border-navy/8" />
                        <div className="flex-1">
                          <h4 className="font-bold text-navy">{job.title}</h4>
                          <p className="text-sm text-navy/60">{job.company} · {job.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="badge-verified text-xs">✓ Applied</div>
                          <p className="text-xs text-navy/45 mt-1">{job.salary}</p>
                        </div>
                        <button
                          onClick={() => addToast("Interview prep guide sent to your email!", "success")}
                          className="btn-secondary text-xs py-2 px-3"
                        >
                          Prep Interview
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 card-base">
                    <Briefcase size={48} className="text-navy/20 mx-auto mb-4" />
                    <h3 className="font-bold text-navy mb-2">No applications yet</h3>
                    <p className="text-navy/50 text-sm mb-5">Start applying to jobs across Europe</p>
                    <Link to="/jobs" className="btn-primary text-sm">Browse Jobs</Link>
                  </div>
                )}
              </div>
            )}

            {/* Saved */}
            {activeSection === "saved" && (
              <div className="space-y-6">
                <h2 className="text-navy text-2xl font-bold">Saved Items</h2>
                {savedJobsData.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
                      <Briefcase size={16} className="text-royal" /> Saved Jobs ({savedJobsData.length})
                    </h3>
                    <div className="space-y-3">
                      {savedJobsData.map((job) => (
                        <div key={job.id} className="card-base p-4 flex items-center gap-3">
                          <img src={job.companyLogo} alt="" className="w-10 h-10 rounded-xl object-cover border border-navy/8" />
                          <div className="flex-1">
                            <p className="font-semibold text-navy text-sm">{job.title}</p>
                            <p className="text-xs text-navy/55">{job.company} · {job.countryFlag} {job.location}</p>
                          </div>
                          <p className="text-sm font-bold text-navy mr-2">{job.salary}</p>
                          <button onClick={() => addToast(`Applied to ${job.title}!`, "success")} className="btn-primary text-xs py-1.5 px-3">Apply</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {savedUnisData.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
                      <GraduationCap size={16} className="text-purple-600" /> Saved Universities ({savedUnisData.length})
                    </h3>
                    <div className="space-y-3">
                      {savedUnisData.map((uni) => (
                        <div key={uni.id} className="card-base p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-lg flex-shrink-0">{uni.countryFlag}</div>
                          <div className="flex-1">
                            <p className="font-semibold text-navy text-sm">{uni.name}</p>
                            <p className="text-xs text-navy/55">{uni.city} · {uni.rankLabel}</p>
                          </div>
                          <p className="text-sm font-bold text-navy">{uni.tuitionLabel}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {savedJobsData.length === 0 && savedUnisData.length === 0 && (
                  <div className="text-center py-16 card-base">
                    <BookmarkCheck size={48} className="text-navy/20 mx-auto mb-4" />
                    <h3 className="font-bold text-navy mb-2">Nothing saved yet</h3>
                    <p className="text-navy/50 text-sm mb-5">Save jobs, universities and properties to view them here</p>
                    <Link to="/jobs" className="btn-primary text-sm">Explore Opportunities</Link>
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-navy text-2xl font-bold">My Profile</h2>
                  <Link to="/profile" className="btn-primary text-sm py-2 px-4">Open Full Profile</Link>
                </div>
                <div className="card-base p-6">
                  <div className="flex items-start gap-5 mb-8">
                    <img src={user.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-royal/20" />
                    <div className="flex-1">
                      <h3 className="font-bold text-navy text-xl">{user.name}</h3>
                      <p className="text-navy/55 mb-1">{user.email}</p>
                      <p className="text-xs text-navy/40 mb-3">Member since {user.joinedDate}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="badge-verified">✓ Verified Account</span>
                        {user.premiumMember && <span className="badge-premium">★ Premium</span>}
                        <span className="text-xs bg-navy/5 text-navy/60 px-2.5 py-1 rounded-full font-medium">{ROLE_LABELS[user.role] ?? user.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { label: "Full Name", value: user.name },
                      { label: "Email Address", value: user.email },
                      { label: "Current Location", value: user.location },
                      { label: "Target Country", value: user.targetCountry ?? "Not set" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1.5">{field.label}</label>
                        <p className="text-sm text-navy font-medium bg-soft px-4 py-3 rounded-xl">{field.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5">
                    <Link to="/profile" className="btn-secondary text-sm py-2.5 px-5">Edit Full Profile →</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
