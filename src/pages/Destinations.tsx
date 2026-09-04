import { useState, useMemo } from "react";
import { MapPin, X, ChevronDown, Globe2, Search } from "lucide-react";
import { DESTINATIONS, COUNTRIES } from "@/constants/mockData";
import DestinationCard from "@/components/features/DestinationCard";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/layout/ToastContainer";

const COST_OPTIONS = ["Low", "Medium", "High", "Very High"];
const WORK_OPTIONS = ["Excellent", "Good", "Fair"];
const CATEGORY_OPTIONS = ["Tech Hub", "Finance", "Affordable", "Culture", "Digital Nomad", "Sustainability", "Beach", "High Income"];

export default function Destinations() {
  const { toasts, addToast, removeToast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedCosts, setSelectedCosts] = useState<string[]>([]);
  const [selectedWork, setSelectedWork] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("quality");

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let dests = DESTINATIONS.filter((d) => {
      const q = query.toLowerCase();
      const matchQ = !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q);
      const matchCost = !selectedCosts.length || selectedCosts.includes(d.costOfLiving);
      const matchWork = !selectedWork.length || selectedWork.includes(d.workOpportunities);
      const matchCat = !selectedCategories.length || selectedCategories.some((c) => d.category.includes(c));
      return matchQ && matchCost && matchWork && matchCat;
    });
    if (sortBy === "quality") dests = dests.sort((a, b) => b.qualityOfLife - a.qualityOfLife);
    else if (sortBy === "safety") dests = dests.sort((a, b) => b.safetyScore - a.safetyScore);
    else if (sortBy === "budget_asc") dests = dests.sort((a, b) => a.monthlyBudget - b.monthlyBudget);
    else if (sortBy === "budget_desc") dests = dests.sort((a, b) => b.monthlyBudget - a.monthlyBudget);
    return dests;
  }, [query, selectedCosts, selectedWork, selectedCategories, sortBy]);

  const clearAll = () => { setQuery(""); setSelectedCosts([]); setSelectedWork([]); setSelectedCategories([]); };
  const hasFilters = query || selectedCosts.length || selectedWork.length || selectedCategories.length;

  return (
    <div className="min-h-screen bg-soft">
      {/* HERO */}
      <section className="relative pt-16 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212,167,44,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(37,99,235,0.4) 0%, transparent 50%)" }} />
        </div>
        <div className="relative z-10 container-app pt-20 pb-16 text-center">
          <p className="section-label text-gold mb-3">Explore Europe</p>
          <h1 className="text-white mb-4">47 Cities, Endless Possibilities</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Compare cities by cost of living, job markets, safety, and quality of life — find your perfect European home base.
          </p>
          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-navy/35" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cities, countries, lifestyle..."
              className="w-full bg-white/95 pl-12 pr-4 py-4 rounded-2xl border-0 text-navy placeholder-navy/40 text-base focus:outline-none focus:ring-2 focus:ring-royal-300 shadow-xl"
            />
          </div>
        </div>
      </section>

      <div className="container-app py-10">
        {/* Filter bar */}
        <div className="card-base p-5 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-navy/40">Cost:</p>
              <div className="flex gap-1.5">
                {COST_OPTIONS.map((c) => (
                  <button key={c} onClick={() => toggle(selectedCosts, setSelectedCosts, c)}
                    className={`filter-chip text-xs py-1.5 px-3 ${selectedCosts.includes(c) ? "filter-chip-active" : ""}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-navy/40">Jobs:</p>
              <div className="flex gap-1.5">
                {WORK_OPTIONS.map((w) => (
                  <button key={w} onClick={() => toggle(selectedWork, setSelectedWork, w)}
                    className={`filter-chip text-xs py-1.5 px-3 ${selectedWork.includes(w) ? "filter-chip-active" : ""}`}>
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-navy/40">Vibe:</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_OPTIONS.slice(0, 5).map((c) => (
                  <button key={c} onClick={() => toggle(selectedCategories, setSelectedCategories, c)}
                    className={`filter-chip text-xs py-1.5 px-3 ${selectedCategories.includes(c) ? "filter-chip-active" : ""}`}>
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
                  <option value="quality">Quality of Life</option>
                  <option value="safety">Safest First</option>
                  <option value="budget_asc">Cheapest First</option>
                  <option value="budget_desc">Premium First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-navy">{filtered.length} <span className="font-normal text-navy/60">destinations found</span></h3>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((d) => (
              <DestinationCard
                key={d.id}
                destination={d}
                onExplore={(d) => addToast(`Exploring ${d.name}, ${d.country} — ₹${d.monthlyBudget.toLocaleString("en-IN")}/month budget`, "info")}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 card-base">
            <Globe2 size={48} className="text-navy/20 mx-auto mb-4" />
            <h3 className="font-bold text-navy mb-2">No destinations found</h3>
            <p className="text-navy/50 text-sm mb-5">Try broadening your search criteria</p>
            <button onClick={clearAll} className="btn-primary text-sm">Show All Cities</button>
          </div>
        )}

        {/* Comparison teaser */}
        <div className="mt-16 bg-gradient-navy rounded-3xl p-10 text-center">
          <h3 className="text-white text-2xl font-bold mb-3">Compare Cities Side by Side</h3>
          <p className="text-white/65 mb-6">Cost of living, salaries, safety, climate — all in one comparison table.</p>
          <button onClick={() => addToast("City comparison tool coming soon!", "info")} className="btn-gold">
            Compare Cities
          </button>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
