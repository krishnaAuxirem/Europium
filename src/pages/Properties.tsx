import heroProperties from "@/assets/hero-properties.jpg";
import { useState, useMemo } from "react";
import { Home, X, ChevronDown, MapPin, SlidersHorizontal } from "lucide-react";
import { PROPERTIES, COUNTRIES } from "@/constants/mockData";
import PropertyCard from "@/components/features/PropertyCard";
import SearchBar from "@/components/features/SearchBar";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/layout/ToastContainer";

const PROPERTY_TYPES = ["Apartment", "Studio", "House", "Shared", "Room"];
const BUDGETS = [
  { label: "Under ₹50,000", max: 50000 },
  { label: "₹50k–₹1L", max: 100000 },
  { label: "₹1L–₹2L", max: 200000 },
  { label: "₹2L+", max: Infinity },
];

export default function Properties() {
  const { toasts, addToast, removeToast } = useToast();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [maxBudget, setMaxBudget] = useState(Infinity);
  const [furnishedOnly, setFurnishedOnly] = useState(false);
  const [utilitiesOnly, setUtilitiesOnly] = useState(false);
  const [nearUniOnly, setNearUniOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const toggleType = (t: string) => setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const filtered = useMemo(() => {
    let props = PROPERTIES.filter((p) => {
      const q = query.toLowerCase();
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
      const matchC = !country || p.country === COUNTRIES.find((c) => c.code === country)?.name;
      const matchT = !selectedTypes.length || selectedTypes.includes(p.type);
      const matchB = p.rentMin <= maxBudget;
      const matchF = !furnishedOnly || p.furnished;
      const matchU = !utilitiesOnly || p.utilities;
      const matchN = !nearUniOnly || p.nearUniversity;
      return matchQ && matchC && matchT && matchB && matchF && matchU && matchN;
    });
    if (sortBy === "price_asc") props = props.sort((a, b) => a.rentMin - b.rentMin);
    else if (sortBy === "price_desc") props = props.sort((a, b) => b.rentMin - a.rentMin);
    else if (sortBy === "rating") props = props.sort((a, b) => b.rating - a.rating);
    else props = props.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return props;
  }, [query, country, selectedTypes, maxBudget, furnishedOnly, utilitiesOnly, nearUniOnly, sortBy]);

  const clearAll = () => {
    setQuery(""); setCountry(""); setSelectedTypes([]); setMaxBudget(Infinity);
    setFurnishedOnly(false); setUtilitiesOnly(false); setNearUniOnly(false);
  };

  const Toggle = ({ value, onChange, label }: { value: boolean; onChange: () => void; label: string }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-navy/70">{label}</span>
      <div onClick={onChange} className="relative rounded-full cursor-pointer transition-colors"
           style={{ width: 40, height: 22, background: value ? "#2563EB" : "rgba(18,53,91,0.15)" }}>
        <div style={{ width: 18, height: 18, top: 2, left: value ? 20 : 2, position: "absolute", background: "white", borderRadius: "50%", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-soft">
      {/* HERO */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 h-72">
          <img src={heroProperties} alt="European apartment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/65" />
        </div>
        <div className="relative z-10 container-app pt-20 pb-12 text-center">
          <p className="section-label text-gold mb-3">Homes Across Europe</p>
          <h1 className="text-white mb-4">Find Your Perfect European Home</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            28,000+ verified properties — studios, apartments, shared housing near top universities and workplaces.
          </p>
          <div className="max-w-3xl mx-auto">
            <SearchBar size="large" placeholder="City, neighborhood, or property type..." onSearch={(q, c) => { setQuery(q); setCountry(c); }} />
          </div>
        </div>
      </section>

      <div className="container-app py-10">
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Avg. Berlin Studio", value: "₹85,000/mo" },
            { label: "Avg. Paris Apartment", value: "₹1,50,000/mo" },
            { label: "Avg. Warsaw Room", value: "₹28,000/mo" },
            { label: "Avg. Amsterdam Room", value: "₹72,000/mo" },
          ].map((s) => (
            <div key={s.label} className="card-base p-4 text-center">
              <p className="font-bold text-royal text-lg">{s.value}</p>
              <p className="text-xs text-navy/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 hidden lg:block">
            <div className="card-base p-6 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-navy">Filters</h3>
                <button onClick={clearAll} className="text-xs text-red-500 font-medium flex items-center gap-1">
                  <X size={12} /> Clear
                </button>
              </div>

              {/* Type */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">Property Type</p>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((t) => (
                    <button key={t} onClick={() => toggleType(t)}
                      className={`filter-chip text-xs py-1.5 px-3 ${selectedTypes.includes(t) ? "filter-chip-active" : ""}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">Monthly Budget</p>
                <div className="space-y-1.5">
                  {BUDGETS.map((b) => (
                    <button key={b.label} onClick={() => setMaxBudget(b.max)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                                  ${maxBudget === b.max ? "bg-royal text-white" : "text-navy/70 hover:bg-navy/5"}`}>
                      {b.label}
                    </button>
                  ))}
                  <button onClick={() => setMaxBudget(Infinity)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                                ${maxBudget === Infinity ? "bg-royal text-white" : "text-navy/70 hover:bg-navy/5"}`}>
                    Any Budget
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <Toggle value={furnishedOnly} onChange={() => setFurnishedOnly(!furnishedOnly)} label="Furnished" />
                <Toggle value={utilitiesOnly} onChange={() => setUtilitiesOnly(!utilitiesOnly)} label="Bills Included" />
                <Toggle value={nearUniOnly} onChange={() => setNearUniOnly(!nearUniOnly)} label="Near University" />
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
              <h3 className="font-bold text-navy">{filtered.length} <span className="font-normal text-navy/60">properties found</span></h3>
              <div className="relative">
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none text-sm border border-navy/15 text-navy bg-white rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-royal-300">
                  <option value="featured">Featured First</option>
                  <option value="price_asc">Cheapest First</option>
                  <option value="price_desc">Most Expensive</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    onContact={(p) => addToast(`Contact request sent for "${p.title}"`, "success")}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 card-base">
                <Home size={48} className="text-navy/20 mx-auto mb-4" />
                <h3 className="font-bold text-navy mb-2">No properties found</h3>
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
