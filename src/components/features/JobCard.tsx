import { Bookmark, MapPin, Clock, Users, CheckCircle, Zap, Wifi } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Job } from "@/types";

interface Props {
  job: Job;
  onApply?: (job: Job) => void;
  onSave?: (job: Job) => void;
}

export default function JobCard({ job, onApply, onSave }: Props) {
  const { isJobSaved, isJobApplied, toggleSaveJob, applyToJob } = useAuth();
  const saved = isJobSaved(job.id);
  const applied = isJobApplied(job.id);

  const handleSave = () => {
    toggleSaveJob(job.id);
    onSave?.(job);
  };

  const handleApply = () => {
    applyToJob(job.id);
    onApply?.(job);
  };

  return (
    <div className="card-base group p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-navy/8 flex-shrink-0 bg-gray-50">
            <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-navy text-base group-hover:text-royal transition-colors line-clamp-1">{job.title}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-sm text-navy/60 font-medium">{job.company}</p>
              {job.verified && <CheckCircle size={13} className="text-emerald fill-emerald/20" />}
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          aria-label={saved ? "Unsave job" : "Save job"}
          className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 mt-0.5
                      ${saved ? "text-royal bg-royal-50" : "text-navy/30 hover:text-royal hover:bg-royal-50"}`}
        >
          <Bookmark size={18} className={saved ? "fill-royal" : ""} />
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-xs text-navy/55 bg-navy/5 px-2.5 py-1 rounded-full">
          <MapPin size={11} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-navy/55 bg-navy/5 px-2.5 py-1 rounded-full">
          <Clock size={11} />
          <span>{job.type}</span>
        </div>
        {job.remote && (
          <div className="flex items-center gap-1 text-xs text-royal bg-royal-50 px-2.5 py-1 rounded-full">
            <Wifi size={11} />
            <span>Remote</span>
          </div>
        )}
        {job.visa && (
          <div className="flex items-center gap-1 text-xs text-emerald bg-emerald-50 px-2.5 py-1 rounded-full">
            <Zap size={11} />
            <span>Visa Sponsored</span>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {job.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="text-xs font-medium text-navy/60 bg-navy/5 px-2.5 py-1 rounded-lg">
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="text-xs font-medium text-navy/40 px-2 py-1">+{job.skills.length - 3} more</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-navy/6">
        <div>
          <p className="text-base font-bold text-navy">{job.salary}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Users size={11} className="text-navy/35" />
            <span className="text-xs text-navy/45">{job.applicants} applicants</span>
            <span className="text-xs text-navy/25">·</span>
            <span className="text-xs text-navy/45">{job.posted}</span>
          </div>
        </div>
        {applied ? (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald rounded-xl text-sm font-semibold">
            <CheckCircle size={14} className="fill-emerald/20" /> Applied
          </div>
        ) : (
          <button onClick={handleApply} className="btn-primary text-sm py-2 px-4">
            Apply Now
          </button>
        )}
      </div>

      {/* Badges */}
      <div className="flex gap-2 -mt-2">
        {job.featured && <span className="badge-premium">★ Featured</span>}
        {job.countryFlag && <span className="text-xs text-navy/50">{job.countryFlag} {job.country}</span>}
      </div>
    </div>
  );
}
