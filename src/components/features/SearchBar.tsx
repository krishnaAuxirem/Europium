import { Search, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import { COUNTRIES } from "@/constants/mockData";

interface Props {
  placeholder?: string;
  onSearch?: (query: string, country: string) => void;
  showCountry?: boolean;
  className?: string;
  size?: "default" | "large";
}

export default function SearchBar({
  placeholder = "Search jobs, universities, cities...",
  onSearch,
  showCountry = true,
  className = "",
  size = "default",
}: Props) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");

  const handleSearch = () => onSearch?.(query, country);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const isLarge = size === "large";

  return (
    <div className={`flex flex-col sm:flex-row gap-2 w-full ${className}`}>
      {/* Query */}
      <div className="relative flex-1">
        <Search size={isLarge ? 20 : 17} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className={`w-full bg-white border border-navy/12 text-navy placeholder-navy/35 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-royal-300 focus:border-royal/40
                      transition-all duration-200
                      ${isLarge ? "pl-12 pr-4 py-4 text-base" : "pl-10 pr-4 py-3 text-sm"}`}
        />
      </div>

      {/* Country filter */}
      {showCountry && (
        <div className="relative">
          <MapPin size={isLarge ? 20 : 17} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={`appearance-none bg-white border border-navy/12 text-navy rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-royal-300 focus:border-royal/40
                        transition-all duration-200 cursor-pointer
                        ${isLarge ? "pl-11 pr-8 py-4 text-base" : "pl-10 pr-8 py-3 text-sm"}
                        ${!country ? "text-navy/40" : ""}`}
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Search button */}
      <button
        onClick={handleSearch}
        className={`btn-primary whitespace-nowrap flex-shrink-0
                    ${isLarge ? "py-4 px-8 text-base" : "py-3 px-6 text-sm"}`}
      >
        <Search size={isLarge ? 18 : 16} />
        Search
      </button>
    </div>
  );
}
