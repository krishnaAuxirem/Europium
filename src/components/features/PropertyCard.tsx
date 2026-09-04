import { Bookmark, MapPin, Star, Wifi, Sofa, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Property } from "@/types";

interface Props {
  property: Property;
  onContact?: (p: Property) => void;
}

export default function PropertyCard({ property: p, onContact }: Props) {
  const { isPropertySaved, toggleSaveProperty } = useAuth();
  const saved = isPropertySaved(p.id);

  return (
    <div className="card-base group overflow-hidden hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={p.image}
          alt={p.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Type badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-navy text-xs font-bold rounded-lg shadow-sm">
          {p.type}
        </div>
        <button
          onClick={() => toggleSaveProperty(p.id)}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200
                      ${saved ? "bg-red-500 text-white" : "bg-white/90 text-navy/50 hover:text-red-500"}`}
          aria-label={saved ? "Unsave" : "Save"}
        >
          <Heart size={16} className={saved ? "fill-white" : ""} />
        </button>
        {p.featured && (
          <div className="absolute bottom-3 left-3 badge-premium shadow-sm">★ Featured</div>
        )}
        {p.nearUniversity && (
          <div className="absolute bottom-3 right-3 text-xs bg-royal text-white px-2 py-0.5 rounded-full font-medium">Near University</div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-bold text-navy text-base leading-snug group-hover:text-royal transition-colors line-clamp-1">{p.title}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin size={13} className="text-navy/40" />
            <span className="text-sm text-navy/55">{p.city}, {p.countryFlag} {p.country}</span>
          </div>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-navy/60">
          {p.bedrooms > 0 && <span>{p.bedrooms} {p.bedrooms === 1 ? "bed" : "beds"}</span>}
          {p.bedrooms === 0 && <span>Studio</span>}
          <span>·</span>
          <span>{p.bathrooms} bath</span>
          <span>·</span>
          <span>{p.area}m²</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {p.furnished && (
            <span className="flex items-center gap-1 text-xs text-navy/60 bg-navy/5 px-2 py-0.5 rounded-full">
              <Sofa size={10} /> Furnished
            </span>
          )}
          {p.utilities && (
            <span className="flex items-center gap-1 text-xs text-navy/60 bg-navy/5 px-2 py-0.5 rounded-full">
              <Wifi size={10} /> Bills Incl.
            </span>
          )}
          {p.verified && (
            <span className="badge-verified text-xs">✓ Verified</span>
          )}
        </div>

        <div className="pt-3 border-t border-navy/6 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-royal">{p.rentLabel}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={11} className="text-gold fill-gold" />
              <span className="text-xs text-navy/50">{p.rating} ({p.reviews} reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-navy/45">Available</p>
            <p className="text-sm font-semibold text-emerald">{p.available}</p>
          </div>
        </div>

        <button onClick={() => onContact?.(p)} className="w-full btn-primary text-sm py-2.5">
          Contact Landlord
        </button>
      </div>
    </div>
  );
}
