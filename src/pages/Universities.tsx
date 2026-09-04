import heroUniversities from "@/assets/hero-universities.jpg";
import { useState, useMemo } from "react";
import { GraduationCap, X, ChevronDown, MapPin, SlidersHorizontal } from "lucide-react";
import { UNIVERSITIES, COUNTRIES } from "@/constants/mockData";
import UniversityCard from "@/components/features/UniversityCard";
import SearchBar from "@/components/features/SearchBar";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/layout/ToastContainer";

const PROGRAM_CATEGORIES = ["Computer Science", "Engineering", "Business", "Medicine", "Law", "Arts", "Science", "Economics"];
const UNI_TYPES = ["Public", "Private"];
const INTAKES = ["September", "October", "February", "April"];

export default function Universities() {
  const { toasts, addToast, removeToast } = useToast();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [selectedIntake, setSelectedIntake] = useState("");
  const [sortBy, setSortBy] = useState("rank");

  const toggleProgram = (p: string) => setSelectedPrograms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  const toggleType = (t: string) => setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const filtered = useMemo(() => {
    let unis = UNIVERSITIES.filter((u) => {
      const q = query.toLowerCase();
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q) || u.country.toLowerCase().includes(q);
      const matchC = !country || u.country === COUNTRIES.find((c) => c.code === country)?.name;
      const matchP = !selectedPrograms.length || selectedPrograms.some((p) => u.programs.some((up) => up.toLowerCase().includes(p.toLowerCase())));
      const matchT = !selectedTypes.length || selectedTypes.includes(u.type);
      const matchS = !scholarshipOnly || u.scholarships;
      const matchI = !selectedIntake || u.intake.some((i) => i.toLowerCase().includes(selectedIntake.toLowerCase()));
      return matchQ && matchC && matchP && matchT && matchS && matchI;
    });
    if (sortBy === "rank") unis = unis.sort((a, b) => a.rank - b.rank);
    else if (sortBy === "acceptance") unis = unis.sort((a, b) => b.acceptance - a.acceptance);
    else if (sortBy === "tuition") unis = unis.sort((a, b) => a.tuitionMin - b.tuitionMin);
    return unis;
  }, [query, country, selectedPrograms, selectedTypes, scholarshipOnly, selectedIntake, sortBy]);

  const clearAll = () => {
    setQuery(""); setCountry(""); setSelectedPrograms([]); setSelectedTypes([]);
    setScholarshipOnly(false); setSelectedIntake("");
  };

  const hasFilters = query || country || selectedPrograms.length || selectedTypes.length || scholarshipOnly || selectedIntake;

  return (
    <div className="min-h-screen bg-soft">
      {/* HERO */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 h-72">
          <img src={heroUniversities} alt="European university campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/68" />
        </div>
        <div className="relative z-10 container-app pt-20 pb-12 text-center">
          <p className="section-label text-gold mb-3">Study in Europe</p>
          <h1 className="text-white mb-4">World-Class Universities Await</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            850+ European universities — from €0 tuition to elite private institutes. Find your perfect academic home.
          </p>
          <div className="max-w-3xl mx-auto">
            <SearchBar size="large" placeholder="University name, city, or program..." onSearch={(q, c) => { setQuery(q); setCountry(c); }} />
          </div>
        </div>
      </section>

      <div className="container-app py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 hidden lg:block">
            <div className="card-base p-6 space-y-7 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-navy">Filters</h3>
                {hasFilters && (
                  <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                    <X size={12} /> Clear
                  </button>
                )}
              </div>

              {/* Programs */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">Program Area</p>
                <div className="flex flex-wrap gap-2">
                  {PROGRAM_CATEGORIES.map((p) => (
                    <button
                      key={p}
                      onClick={() => toggleProgram(p)}
                      className={`filter-chip text-xs py-1.5 px-3 ${selectedPrograms.includes(p) ? "filter-chip-active" : ""}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">University Type</p>
                <div className="flex gap-2">
                  {UNI_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleType(t)}
                      className={`filter-chip text-xs py-1.5 px-3 flex-1 ${selectedTypes.includes(t) ? "filter-chip-active" : ""}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intake */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">Intake</p>
                <div className="flex flex-wrap gap-2">
                  {INTAKES.map((i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedIntake(selectedIntake === i ? "" : i)}
                      className={`filter-chip text-xs py-1.5 px-3 ${selectedIntake === i ? "filter-chip-active" : ""}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scholarships toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy/70">Scholarships Available</span>
                <div
                  onClick={() => setScholarshipOnly(!scholarshipOnly)}
                  className="relative rounded-full cursor-pointer transition-colors"
                  style={{ width: 40, height: 22, background: scholarshipOnly ? "#2563EB" : "rgba(18,53,91,0.15)" }}
                >
                  <div style={{ width: 18, height: 18, top: 2, left: scholarshipOnly ? 20 : 2, position: "absolute", background: "white", borderRadius: "50%", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
                </div>
              </div>

              {/* Country */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">Country</p>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full appearance-none input-base pl-8 pr-7 py-2.5 text-sm">
                    <option value="">All Countries</option>
                    {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h3 className="font-bold text-navy">{filtered.length} <span className="font-normal text-navy/60">universities found</span></h3>
              <div className="relative">
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none text-sm border border-navy/15 text-navy bg-white rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-royal-300">
                  <option value="rank">World Ranking</option>
                  <option value="acceptance">Acceptance Rate</option>
                  <option value="tuition">Lowest Tuition</option>
                </select>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((u) => (
                  <UniversityCard
                    key={u.id}
                    university={u}
                    onExplore={(u) => addToast(`Viewing ${u.name} — ${u.city}`, "info")}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 card-base">
                <GraduationCap size={48} className="text-navy/20 mx-auto mb-4" />
                <h3 className="font-bold text-navy mb-2">No universities found</h3>
                <p className="text-navy/50 text-sm mb-5">Try adjusting your filters</p>
                <button onClick={clearAll} className="btn-primary text-sm">Clear All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
