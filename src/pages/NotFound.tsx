import { Link } from "react-router-dom";
import { Globe, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-soft flex flex-col items-center justify-center text-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-royal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md">
        <div className="w-20 h-20 bg-gradient-navy rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
          <Globe size={40} className="text-white" />
        </div>

        <h1 className="text-8xl font-black text-navy/10 mb-2 leading-none">404</h1>
        <h2 className="text-2xl font-bold text-navy mb-3">Lost in Europe</h2>
        <p className="text-navy/55 mb-10 leading-relaxed">
          Looks like this page has moved to another country. Let's get you back on track to discover European opportunities.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary gap-2">
            <Home size={16} /> Back to Home
          </Link>
          <Link to="/jobs" className="btn-secondary gap-2">
            <ArrowLeft size={16} /> Explore Jobs
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          {["🇩🇪", "🇫🇷", "🇳🇱", "🇸🇪", "🇨🇭", "🇵🇹"].map((flag) => (
            <span key={flag} className="text-2xl opacity-40 hover:opacity-100 transition-opacity cursor-default">{flag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
