import { useState, useMemo } from "react";
import { Star, X, ChevronDown, Search } from "lucide-react";
import { OPPORTUNITIES } from "@/constants/mockData";
import OpportunityCard from "@/components/features/OpportunityCard";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/layout/ToastContainer";

const OPP_TYPES = ["Scholarship", "Grant", "Fellowship", "Exchange", "Internship", "Training"];
const OPP_CATEGORIES = ["Education", "Research", "Visa", "Professional", "Training", "Residency"];

export default function Opportunities() {
  const { toasts, addToast, removeToast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let opps = OPPORTUNITIES.filter((o) => {
      const q = query.toLowerCase();
      const matchQ = !q || o.title.toLowerCase().includes(q) || o.organization.toLowerCase().includes(q) || o.country.toLowerCase().includes(q);
      const matchT = !selectedTypes.length || selectedTypes.includes(o.type);
      const matchC = !selectedCats.length || selectedCats.includes(o.category);
      return matchQ && matchT && matchC;
    });
    if (sortBy === "featured") opps = opps.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    else if (sortBy === "amount") opps = opps.sort((a, b) => b.amount - a.amount);
    else if (sortBy === "deadline") opps = opps.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    return opps;
  }, [query, selectedTypes, selectedCats, sortBy]);

  const clearAll = () => { setQuery(""); setSelectedTypes([]); setSelectedCats([]); };
  const hasFilters = query || selectedTypes.length || selectedCats.length;

  return (
    <div className="min-h-screen bg-soft">
      {/* HERO */}
      <section className="relative pt-16 bg-navy overflow-hidden">
        <div className="absolute inset-0">
          <div style={{ background: "radial-gradient(circle at 30% 50%, rgba(212,167,44,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(37,99,235,0.15) 0%, transparent 60%)" }} className="absolute inset-0" />
        </div>
        <div className="relative z-10 container-app pt-20 pb-16">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12">
            <div className="flex-1">
              <p className="section-label text-gold mb-3">Life-Changing Opportunities</p>
              <h1 className="text-white mb-4">Scholarships, Grants & Fellowships</h1>
              <p className="text-white/70 text-lg max-w-xl leading-relaxed">
                Fully funded scholarships, fast-track visas, research grants, and professional exchanges —
                all curated and verified for ambitious individuals.
              </p>
            </div>
            <div className="lg:w-80 grid grid-cols-2 gap-4">
              {[
                { label: "Scholarships", value: "180+", color: "bg-royal/20 text-royal-300" },
                { label: "Total Value", value: "₹2.1Cr+", color: "bg-gold/20 text-gold" },
                { label: "Countries", value: "27", color: "bg-emerald/20 text-emerald-300" },
                { label: "Verified", value: "100%", color: "bg-white/10 text-white/80" },
              ].map((s) => (
                <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center border border-white/10`}>
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container-app py-10">
        {/* Search & Filters */}
        <div className="card-base p-5 mb-8 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scholarships, grants, organizations..."
              className="w-full input-base pl-11"
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-navy/40">Type:</p>
              <div className="flex flex-wrap gap-1.5">
                {OPP_TYPES.map((t) => (
                  <button key={t} onClick={() => toggle(selectedTypes, setSelectedTypes, t)}
                    className={`filter-chip text-xs py-1.5 px-3 ${selectedTypes.includes(t) ? "filter-chip-active" : ""}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-navy/40">Area:</p>
              <div className="flex flex-wrap gap-1.5">
                {OPP_CATEGORIES.map((c) => (
                  <button key={c} onClick={() => toggle(selectedCats, setSelectedCats, c)}
                    className={`filter-chip text-xs py-1.5 px-3 ${selectedCats.includes(c) ? "filter-chip-active" : ""}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {hasFilters && (
                <button onClick={clearAll} className="flex items-center gap-1 text-xs text-red-500 font-medium">
                  <X size={12} /> Clear
                </button>
              )}
              <div className="relative">
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none text-sm border border-navy/15 text-navy bg-white rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-royal-300">
                  <option value="featured">Featured First</option>
                  <option value="amount">Highest Amount</option>
                  <option value="deadline">Earliest Deadline</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-navy">{filtered.length} <span className="font-normal text-navy/60">opportunities found</span></h3>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((o) => (
              <OpportunityCard
                key={o.id}
                opportunity={o}
                onApply={(o) => addToast(`Application started for "${o.title}" — good luck! 🌟`, "success")}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 card-base">
            <Star size={48} className="text-navy/20 mx-auto mb-4" />
            <h3 className="font-bold text-navy mb-2">No opportunities found</h3>
            <p className="text-navy/50 text-sm mb-5">Try broadening your search</p>
            <button onClick={clearAll} className="btn-primary text-sm">Show All Opportunities</button>
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
