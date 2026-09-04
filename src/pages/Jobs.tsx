import heroJobs from "@/assets/hero-jobs.jpg";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Briefcase, MapPin, DollarSign, Wifi, Zap, ChevronDown } from "lucide-react";
import { JOBS, COUNTRIES, JOB_CATEGORIES } from "@/constants/mockData";
import JobCard from "@/components/features/JobCard";
import SearchBar from "@/components/features/SearchBar";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/layout/ToastContainer";
import type { Job } from "@/types";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const EXPERIENCE_LEVELS = ["Junior (1–2 years)", "Mid-level (3–5 years)", "Senior (5+ years)"];

export default function Jobs() {
  const { toasts, addToast, removeToast } = useToast();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [visaOnly, setVisaOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filtered = useMemo(() => {
    let jobs = JOBS.filter((j) => {
      const q = query.toLowerCase();
      const matchQuery = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.category.toLowerCase().includes(q);
      const matchCountry = !country || j.country === COUNTRIES.find((c) => c.code === country)?.name;
      const matchCategory = !selectedCategories.length || selectedCategories.includes(j.category);
      const matchType = !selectedTypes.length || selectedTypes.some((t) => j.type.toLowerCase().includes(t.toLowerCase()));
      const matchRemote = !remoteOnly || j.remote;
      const matchVisa = !visaOnly || j.visa;
      return matchQuery && matchCountry && matchCategory && matchType && matchRemote && matchVisa;
    });

    if (sortBy === "salary") jobs = jobs.sort((a, b) => b.salaryMax - a.salaryMax);
    else if (sortBy === "applicants") jobs = jobs.sort((a, b) => a.applicants - b.applicants);
    return jobs;
  }, [query, country, selectedCategories, selectedTypes, remoteOnly, visaOnly, sortBy]);

  const clearFilters = () => {
    setQuery("");
    setCountry("");
    setSelectedCategories([]);
    setSelectedTypes([]);
    setRemoteOnly(false);
    setVisaOnly(false);
  };

  const hasFilters = query || country || selectedCategories.length || selectedTypes.length || remoteOnly || visaOnly;

  return (
    <div className="min-h-screen bg-soft">
      {/* HERO */}
      <section className="relative pt-16 pb-0 overflow-hidden">
        <div className="absolute inset-0 h-72">
          <img src={heroJobs} alt="European business district" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/70" />
        </div>
        <div className="relative z-10 container-app pt-20 pb-12 text-center">
          <p className="section-label text-gold mb-3">Europe's #1 Job Board</p>
          <h1 className="text-white mb-4">Find Your Dream Job in Europe</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            12,400+ verified positions across 27 EU countries — with visa sponsorship, competitive salaries in ₹, and top employers.
          </p>
          <div className="max-w-3xl mx-auto">
            <SearchBar
              size="large"
              placeholder="Job title, company, or skill..."
              onSearch={(q, c) => { setQuery(q); setCountry(c); }}
            />
          </div>
        </div>
      </section>

      <div className="container-app py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar — desktop */}
          <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? "" : "hidden lg:block"}`}>
            <div className="card-base p-6 space-y-7 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-navy text-base">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                    <X size={12} /> Clear All
                  </button>
                )}
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">Category</p>
                <div className="space-y-1.5">
                  {JOB_CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="w-4 h-4 rounded border-navy/25 text-royal focus:ring-royal-300 cursor-pointer"
                      />
                      <span className="text-sm text-navy/70 group-hover:text-navy">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">Job Type</p>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`filter-chip text-xs py-1.5 px-3 ${selectedTypes.includes(type) ? "filter-chip-active" : ""}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-navy/70">
                    <Wifi size={14} className="text-royal" /> Remote Only
                  </div>
                  <div
                    onClick={() => setRemoteOnly(!remoteOnly)}
                    className={`w-10 h-5.5 rounded-full transition-colors cursor-pointer relative
                                ${remoteOnly ? "bg-royal" : "bg-navy/15"}`}
                    style={{ width: 40, height: 22 }}
                  >
                    <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${remoteOnly ? "translate-x-5" : "translate-x-0.5"}`}
                         style={{ width: 18, height: 18, top: 2, left: remoteOnly ? 20 : 2 }} />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-navy/70">
                    <Zap size={14} className="text-emerald" /> Visa Sponsored
                  </div>
                  <div
                    onClick={() => setVisaOnly(!visaOnly)}
                    className={`relative rounded-full transition-colors cursor-pointer`}
                    style={{ width: 40, height: 22, background: visaOnly ? "#16A34A" : "rgba(18,53,91,0.15)" }}
                  >
                    <div style={{ width: 18, height: 18, top: 2, left: visaOnly ? 20 : 2, position: "absolute", background: "white", borderRadius: "50%", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
                  </div>
                </label>
              </div>

              {/* Country */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">Country</p>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full appearance-none input-base pl-8 pr-7 py-2.5 text-sm"
                  >
                    <option value="">All Countries</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-navy">
                  {filtered.length} <span className="font-normal text-navy/60">jobs found</span>
                </h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full hover:bg-red-100">
                    <X size={11} /> Clear filters
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-navy border border-navy/15 px-3 py-2 rounded-xl hover:border-royal hover:text-royal transition-colors"
                >
                  <SlidersHorizontal size={15} /> Filters
                </button>
                <div className="relative">
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none text-sm border border-navy/15 text-navy bg-white rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-royal-300"
                  >
                    <option value="newest">Most Recent</option>
                    <option value="salary">Highest Salary</option>
                    <option value="applicants">Fewest Applicants</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active filters chips */}
            {(selectedCategories.length > 0 || selectedTypes.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCategories.map((c) => (
                  <button key={c} onClick={() => toggleCategory(c)} className="flex items-center gap-1.5 text-xs font-medium text-royal bg-royal-50 border border-royal-200 px-3 py-1.5 rounded-full hover:bg-royal-100">
                    {c} <X size={10} />
                  </button>
                ))}
                {selectedTypes.map((t) => (
                  <button key={t} onClick={() => toggleType(t)} className="flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full hover:bg-purple-100">
                    {t} <X size={10} />
                  </button>
                ))}
              </div>
            )}

            {/* Job Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={(j) => addToast(`Applied to ${j.title} at ${j.company}! 🎉`, "success")}
                    onSave={(j) => addToast(`${j.title} saved to your list`, "success")}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 card-base">
                <Briefcase size={48} className="text-navy/20 mx-auto mb-4" />
                <h3 className="font-bold text-navy mb-2">No jobs found</h3>
                <p className="text-navy/50 text-sm mb-5">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary text-sm">Clear All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
