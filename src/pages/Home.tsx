import heroEurope from "@/assets/hero-europe.jpg";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Search, MapPin, Briefcase, GraduationCap, Home, Star, ArrowRight, CheckCircle, Globe, TrendingUp, Users, Building2, ChevronRight } from "lucide-react";
import SearchBar from "@/components/features/SearchBar";
import { JOBS, UNIVERSITIES, DESTINATIONS, STATS_NUMBERS, TESTIMONIALS } from "@/constants/mockData";
import JobCard from "@/components/features/JobCard";
import UniversityCard from "@/components/features/UniversityCard";
import DestinationCard from "@/components/features/DestinationCard";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/layout/ToastContainer";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { label: "Find Jobs", desc: "12,400+ openings", icon: <Briefcase size={24} />, path: "/jobs", color: "bg-royal-50 text-royal border-royal-100" },
  { label: "Universities", desc: "850+ programs", icon: <GraduationCap size={24} />, path: "/universities", color: "bg-purple-50 text-purple-600 border-purple-100" },
  { label: "Properties", desc: "28,000+ listings", icon: <Home size={24} />, path: "/properties", color: "bg-emerald-50 text-emerald border-emerald-100" },
  { label: "Destinations", desc: "47 cities", icon: <MapPin size={24} />, path: "/destinations", color: "bg-gold-50 text-gold-500 border-gold-100" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString("en-IN")}{suffix}</span>;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const featuredJobs = JOBS.filter((j) => j.featured).slice(0, 3);
  const featuredUnis = UNIVERSITIES.filter((u) => u.featured).slice(0, 3);
  const featuredDests = DESTINATIONS.filter((d) => d.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-soft">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroEurope} alt="European cityscape" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-navy/40" />
        </div>

        <div className="relative z-10 container-app py-32 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-8">
            <Globe size={14} className="text-gold" />
            27 European Countries · 2.1M+ Members
          </div>

          <h1 className="text-white font-black text-balance mb-6 max-w-4xl mx-auto leading-tight">
            Your Gateway to<br />
            <span className="text-gold">European</span> Opportunities
          </h1>

          <p className="text-white/75 text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Discover premium jobs, world-class universities, ideal properties, and life-changing
            experiences across Europe — all in one trusted platform.
          </p>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="glass-card rounded-2xl p-3 shadow-2xl">
              <SearchBar
                size="large"
                placeholder="Search jobs, cities, universities..."
                onSearch={(q, c) => {
                  addToast(`Searching for "${q || "all opportunities"}" in ${c || "Europe"}`, "info");
                  navigate("/jobs");
                }}
              />
            </div>
            <p className="text-white/50 text-sm mt-3">
              Popular: <button onClick={() => navigate("/jobs")} className="text-white/75 hover:text-white underline underline-offset-2">Tech Jobs</button>
              {" · "}
              <button onClick={() => navigate("/universities")} className="text-white/75 hover:text-white underline underline-offset-2">Top Universities</button>
              {" · "}
              <button onClick={() => navigate("/destinations")} className="text-white/75 hover:text-white underline underline-offset-2">Berlin</button>
              {" · "}
              <button onClick={() => navigate("/opportunities")} className="text-white/75 hover:text-white underline underline-offset-2">Erasmus Scholarship</button>
            </p>
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="glass-card rounded-2xl p-5 text-left hover:bg-white/95 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-11 h-11 rounded-xl ${cat.color} flex items-center justify-center mb-3 border`}>
                  {cat.icon}
                </div>
                <p className="font-bold text-navy text-sm">{cat.label}</p>
                <p className="text-navy/55 text-xs mt-0.5">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-6 h-9 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2.5 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-navy py-16">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { label: "Active Jobs", value: 12400, suffix: "+" },
              { label: "Universities", value: 850, suffix: "+" },
              { label: "Properties", value: 28000, suffix: "+" },
              { label: "Destinations", value: 47, suffix: "" },
              { label: "Members", value: 2100000, suffix: "+" },
              { label: "EU Countries", value: 27, suffix: "" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-white mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-white/50 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DISCOVERY TABS */}
      <section className="page-section">
        <div className="container-app">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="section-label">Discover</p>
              <h2 className="text-navy">Handpicked for You</h2>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-navy/5 rounded-2xl">
              {[
                { id: "jobs", label: "Jobs" },
                { id: "universities", label: "Universities" },
                { id: "destinations", label: "Destinations" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                              ${activeTab === tab.id ? "bg-white text-royal shadow-sm" : "text-navy/60 hover:text-navy"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "jobs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(loading ? Array(3).fill(null) : featuredJobs).map((job, i) =>
                loading ? (
                  <div key={i} className="card-base p-6 space-y-4">
                    <div className="skeleton h-12 w-full rounded-xl" />
                    <div className="skeleton h-4 w-2/3 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                ) : (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={(j) => addToast(`Applied to ${j.title} at ${j.company}! 🎉`, "success")}
                    onSave={(j) => addToast(`${j.title} saved to your list`, "success")}
                  />
                )
              )}
            </div>
          )}

          {activeTab === "universities" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredUnis.map((u) => (
                <UniversityCard
                  key={u.id}
                  university={u}
                  onExplore={(u) => addToast(`Viewing ${u.name}`, "info")}
                />
              ))}
            </div>
          )}

          {activeTab === "destinations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDests.map((d) => (
                <DestinationCard
                  key={d.id}
                  destination={d}
                  onExplore={(d) => addToast(`Exploring ${d.name}`, "info")}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <Link
              to={activeTab === "jobs" ? "/jobs" : activeTab === "universities" ? "/universities" : "/destinations"}
              className="btn-secondary gap-2"
            >
              View All {activeTab === "jobs" ? "Jobs" : activeTab === "universities" ? "Universities" : "Destinations"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY EUROPIUM */}
      <section className="page-section bg-white">
        <div className="container-app">
          <div className="text-center mb-16">
            <p className="section-label">Why Europium</p>
            <h2 className="text-navy mb-4">Everything You Need, One Place</h2>
            <p className="text-navy/55 max-w-xl mx-auto">From your first search to your first day in Europe — we've got every step covered.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle size={28} className="text-emerald" />,
                title: "Verified & Trusted",
                desc: "Every job, university, property, and employer is manually verified by our team. Zero scams, guaranteed quality.",
                bg: "bg-emerald-50",
              },
              {
                icon: <Globe size={28} className="text-royal" />,
                title: "All 27 EU Countries",
                desc: "Comprehensive coverage from Lisbon to Warsaw — the most complete Europe opportunity database available.",
                bg: "bg-royal-50",
              },
              {
                icon: <TrendingUp size={28} className="text-gold-500" />,
                title: "Real-Time Updates",
                desc: "Jobs, listings and opportunities refreshed daily. Be first to see new openings the moment they're posted.",
                bg: "bg-gold-50",
              },
              {
                icon: <Building2 size={28} className="text-purple-600" />,
                title: "Visa Guidance",
                desc: "Country-specific visa pathways, documentation checklists, and embassy links for every EU nation.",
                bg: "bg-purple-50",
              },
              {
                icon: <Users size={28} className="text-navy" />,
                title: "2.1M+ Community",
                desc: "Connect with Europeans, expats, and fellow aspirants who've made the move. Real stories, real advice.",
                bg: "bg-navy/5",
              },
              {
                icon: <Star size={28} className="text-gold-500" />,
                title: "Premium Matching",
                desc: "AI-powered matching finds your best-fit opportunities based on skills, preferences, and career goals.",
                bg: "bg-gold-50",
              },
            ].map((item) => (
              <div key={item.title} className="group p-7 rounded-2xl border border-navy/8 hover:border-royal/25 hover:shadow-card-hover transition-all duration-300">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:-translate-y-1 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-navy/55 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="page-section bg-soft">
        <div className="container-app">
          <div className="text-center mb-12">
            <p className="section-label">Success Stories</p>
            <h2 className="text-navy">From India to Europe</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="card-base p-7 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-navy/75 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-navy/6">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-navy text-sm">{t.name}</p>
                    <p className="text-xs text-navy/50">{t.role}</p>
                    <p className="text-xs text-royal font-medium">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 bg-gradient-navy">
        <div className="container-app text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-gold text-sm font-bold uppercase tracking-widest mb-4">Start Your Journey</p>
            <h2 className="text-white text-4xl md:text-5xl font-black mb-6">
              Your European Dream Starts Here
            </h2>
            <p className="text-white/65 text-lg mb-10 leading-relaxed">
              Join 2.1 million people who've already discovered their European opportunity with Europium.
              It's free, it's fast, and it works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/jobs" className="btn-gold text-base py-4 px-8 shadow-lg hover:shadow-xl">
                Explore Jobs <ArrowRight size={18} />
              </Link>
              <Link to="/opportunities" className="btn-secondary bg-white/10 text-white border-white/25 hover:bg-white/20 hover:text-white text-base py-4 px-8">
                View Scholarships
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
