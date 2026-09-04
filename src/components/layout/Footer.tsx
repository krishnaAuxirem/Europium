import { Link } from "react-router-dom";
import { Globe, Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

const FOOTER_LINKS = {
  Discover: [
    { label: "Jobs in Europe", path: "/jobs" },
    { label: "Universities", path: "/universities" },
    { label: "Properties", path: "/properties" },
    { label: "Destinations", path: "/destinations" },
    { label: "Opportunities", path: "/opportunities" },
  ],
  Company: [
    { label: "About Us", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Press", path: "/press" },
    { label: "Careers", path: "/careers" },
    { label: "Partner With Us", path: "/partners" },
  ],
  Support: [
    { label: "Help Center", path: "/help" },
    { label: "Visa Guidance", path: "/visa-guide" },
    { label: "Contact Us", path: "/contact" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Main footer content */}
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Globe size={20} className="text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">Europium</span>
            </div>
            <p className="text-white/65 text-sm leading-relaxed max-w-sm mb-6">
              Your premium gateway to European opportunities — from world-class careers and top universities
              to ideal homes and inspiring destinations. 27 countries, one platform.
            </p>
            {/* Contact */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2.5 text-white/60 text-sm">
                <MapPin size={14} className="text-gold" />
                <span>Maximilianstrasse 2, Munich, Germany</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/60 text-sm">
                <Mail size={14} className="text-gold" />
                <span>hello@europium.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/60 text-sm">
                <Phone size={14} className="text-gold" />
                <span>+49 89 1234 5678</span>
              </div>
            </div>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Social link"
                >
                  <Icon size={16} className="text-white/70" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-5">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-app py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2026 Europium Technologies GmbH. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/30">Made with ♥ in Munich</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
              <span className="text-xs text-white/40">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
