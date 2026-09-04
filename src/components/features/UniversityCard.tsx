import { Bookmark, MapPin, Star, Users, CheckCircle, BookOpen, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { University } from "@/types";

interface Props {
  university: University;
  onExplore?: (u: University) => void;
}

export default function UniversityCard({ university: u, onExplore }: Props) {
  const { isUniversitySaved, toggleSaveUniversity } = useAuth();
  const saved = isUniversitySaved(u.id);

  return (
    <div className="card-base group overflow-hidden hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={u.image}
          alt={u.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
        {/* Rank badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-gold text-white text-xs font-bold rounded-lg shadow-sm">
          {u.rankLabel}
        </div>
        <button
          onClick={() => toggleSaveUniversity(u.id)}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200
                      ${saved ? "bg-royal text-white" : "bg-white/90 text-navy/50 hover:text-royal"}`}
          aria-label={saved ? "Unsave" : "Save"}
        >
          <Bookmark size={16} className={saved ? "fill-white" : ""} />
        </button>
        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={12} className="text-white/80" />
              <span className="text-white/90 text-xs font-medium">{u.city}, {u.countryFlag}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star size={11} className="text-gold fill-gold" />
            <span className="text-white text-xs font-bold">{u.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-navy text-base leading-snug group-hover:text-royal transition-colors line-clamp-2">{u.name}</h3>
            {u.verified && <CheckCircle size={16} className="text-emerald fill-emerald/20 flex-shrink-0 mt-0.5" />}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {u.programs.slice(0, 3).map((p) => (
              <span key={p} className="text-xs text-navy/60 bg-navy/5 px-2 py-0.5 rounded-full">{p}</span>
            ))}
            {u.programs.length > 3 && <span className="text-xs text-navy/40">+{u.programs.length - 3}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-navy/60">
            <BookOpen size={14} className="text-royal" />
            <span>{u.type}</span>
          </div>
          <div className="flex items-center gap-2 text-navy/60">
            <Users size={14} className="text-royal" />
            <span>{u.students.toLocaleString("en-IN")} students</span>
          </div>
          <div className="flex items-center gap-2 text-navy/60">
            <Award size={14} className="text-gold" />
            <span>{u.acceptance}% acceptance</span>
          </div>
          <div className="flex items-center gap-2">
            {u.scholarships ? (
              <span className="text-xs badge-verified">Scholarships</span>
            ) : (
              <span className="text-xs text-navy/40">No scholarship</span>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-navy/6 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-navy">{u.tuitionLabel}</p>
            <p className="text-xs text-navy/45">Annual tuition</p>
          </div>
          <button
            onClick={() => onExplore?.(u)}
            className="btn-primary text-sm py-2 px-4"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}
