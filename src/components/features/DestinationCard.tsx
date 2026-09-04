import { Bookmark, Briefcase, TrendingUp, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Destination } from "@/types";

interface Props {
  destination: Destination;
  onExplore?: (d: Destination) => void;
}

const costColors: Record<string, string> = {
  Low: "text-emerald bg-emerald-50 border-emerald-200",
  Medium: "text-gold-500 bg-gold-50 border-gold-200",
  High: "text-orange-600 bg-orange-50 border-orange-200",
  "Very High": "text-red-600 bg-red-50 border-red-200",
};

const workColors: Record<string, string> = {
  Excellent: "text-emerald",
  Good: "text-royal",
  Fair: "text-gold-500",
  Limited: "text-red-500",
};

export default function DestinationCard({ destination: d, onExplore }: Props) {
  const { isDestinationSaved, toggleSaveDestination } = useAuth();
  const saved = isDestinationSaved(d.id);

  return (
    <div className="card-base group overflow-hidden hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={d.image}
          alt={d.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
        <button
          onClick={() => toggleSaveDestination(d.id)}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200
                      ${saved ? "bg-royal text-white" : "bg-white/90 text-navy/50 hover:text-royal"}`}
          aria-label={saved ? "Unsave" : "Save"}
        >
          <Bookmark size={16} className={saved ? "fill-white" : ""} />
        </button>
        {/* Bottom overlay text */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{d.countryFlag}</span>
            <h3 className="text-xl font-black text-white">{d.name}</h3>
          </div>
          <p className="text-white/80 text-xs line-clamp-1">{d.tagline}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          {d.category.slice(0, 3).map((cat) => (
            <span key={cat} className="text-xs text-royal bg-royal-50 px-2.5 py-0.5 rounded-full font-medium">{cat}</span>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-soft rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Shield size={12} className="text-emerald" />
              <span className="text-xs font-bold text-navy">{d.safetyScore}</span>
            </div>
            <p className="text-xs text-navy/45">Safety</p>
          </div>
          <div className="bg-soft rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <TrendingUp size={12} className="text-royal" />
              <span className="text-xs font-bold text-navy">{d.qualityOfLife}</span>
            </div>
            <p className="text-xs text-navy/45">Quality</p>
          </div>
          <div className="bg-soft rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Briefcase size={12} className={workColors[d.workOpportunities]} />
              <span className={`text-xs font-bold ${workColors[d.workOpportunities]}`}>{d.workOpportunities.split(" ")[0]}</span>
            </div>
            <p className="text-xs text-navy/45">Jobs</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-navy/6">
          <div>
            <p className="text-base font-bold text-navy">₹{d.monthlyBudget.toLocaleString("en-IN")}/mo</p>
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border mt-1 ${costColors[d.costOfLiving]}`}>
              {d.costOfLiving} cost
            </div>
          </div>
          <button onClick={() => onExplore?.(d)} className="btn-primary text-sm py-2 px-4">
            Explore City
          </button>
        </div>
      </div>
    </div>
  );
}
