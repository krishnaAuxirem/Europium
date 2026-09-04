import { Calendar, CheckCircle, Star, ArrowRight, BookOpen, Award, Plane } from "lucide-react";
import type { Opportunity } from "@/types";

interface Props {
  opportunity: Opportunity;
  onApply?: (o: Opportunity) => void;
}

const typeColors: Record<string, string> = {
  Scholarship: "bg-royal-50 text-royal border-royal-200",
  Grant: "bg-gold-50 text-gold-500 border-gold-200",
  Fellowship: "bg-purple-50 text-purple-600 border-purple-200",
  Exchange: "bg-emerald-50 text-emerald border-emerald-200",
  Internship: "bg-orange-50 text-orange-600 border-orange-200",
  Training: "bg-pink-50 text-pink-600 border-pink-200",
};

const typeIcons: Record<string, React.ReactNode> = {
  Scholarship: <Award size={14} />,
  Grant: <Star size={14} />,
  Fellowship: <BookOpen size={14} />,
  Exchange: <Plane size={14} />,
  Internship: <BookOpen size={14} />,
  Training: <BookOpen size={14} />,
};

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

export default function OpportunityCard({ opportunity: o, onApply }: Props) {
  const days = daysUntil(o.deadline);
  const urgent = days <= 30;

  return (
    <div className={`card-base group p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300
                     ${o.featured ? "ring-2 ring-gold/30" : ""}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeColors[o.type]}`}>
              {typeIcons[o.type]} {o.type}
            </span>
            {o.featured && <span className="badge-premium">★ Featured</span>}
          </div>
          <h3 className="font-bold text-navy text-base leading-snug group-hover:text-royal transition-colors">{o.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-navy/60">{o.organization}</span>
            {o.verified && <CheckCircle size={13} className="text-emerald fill-emerald/20" />}
            <span className="text-sm text-navy/40">·</span>
            <span className="text-sm text-navy/60">{o.countryFlag} {o.country}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-navy/60 leading-relaxed line-clamp-2">{o.description}</p>

      {/* Eligibility */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-navy/40 uppercase tracking-wide">Eligibility</p>
        <div className="flex flex-wrap gap-1.5">
          {o.eligibility.map((e) => (
            <span key={e} className="text-xs text-navy/65 bg-navy/5 px-2 py-0.5 rounded-full">{e}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-navy/6 mt-auto">
        <div>
          <p className="text-base font-bold text-navy">{o.amountLabel}</p>
          <div className={`flex items-center gap-1 mt-1 ${urgent ? "text-red-500" : "text-navy/50"}`}>
            <Calendar size={12} />
            <span className="text-xs font-medium">
              {urgent ? `${days} days left!` : `Deadline: ${new Date(o.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
            </span>
          </div>
        </div>
        <button
          onClick={() => onApply?.(o)}
          className="btn-primary text-sm py-2 px-4 group/btn"
        >
          Apply <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
