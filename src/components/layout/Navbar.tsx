import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe, Bookmark, User, LogOut, ChevronDown, Bell, Briefcase, GraduationCap, Home, Map, Star, Settings } from "lucide-react";
import { useAuth, ROLE_ROUTES } from "@/contexts/AuthContext";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import type { UserRole } from "@/types";

const NAV_ITEMS = [
  { label: "Jobs", path: "/jobs", icon: <Briefcase size={16} /> },
  { label: "Universities", path: "/universities", icon: <GraduationCap size={16} /> },
  { label: "Properties", path: "/properties", icon: <Home size={16} /> },
  { label: "Destinations", path: "/destinations", icon: <Map size={16} /> },
  { label: "Opportunities", path: "/opportunities", icon: <Star size={16} /> },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { isScrolled } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isHome = pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                  ${isScrolled || !isHome
                    ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-navy/8"
                    : "bg-transparent"}`}
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-navy flex items-center justify-center shadow-sm">
              <Globe size={18} className="text-white" />
            </div>
            <span className={`text-xl font-black tracking-tight transition-colors
                             ${isScrolled || !isHome ? "text-navy" : "text-white"}`}>
              Europium
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
                              ${active
                                ? "text-royal bg-royal-50"
                                : isScrolled || !isHome
                                  ? "text-navy/70 hover:text-navy hover:bg-navy/5"
                                  : "text-white/85 hover:text-white hover:bg-white/10"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/saved")}
                  aria-label="Saved items"
                  className={`relative p-2 rounded-lg transition-colors
                              ${isScrolled || !isHome ? "text-navy/60 hover:text-navy hover:bg-navy/5" : "text-white/80 hover:text-white hover:bg-white/10"}`}
                >
                  <Bookmark size={20} />
                  {(user?.savedJobs.length ?? 0) > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-royal rounded-full" />
                  )}
                </button>
                <button
                  aria-label="Notifications"
                  className={`relative p-2 rounded-lg transition-colors
                              ${isScrolled || !isHome ? "text-navy/60 hover:text-navy hover:bg-navy/5" : "text-white/80 hover:text-white hover:bg-white/10"}`}
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
                </button>
                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-navy/5 transition-colors"
                  >
                    <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full object-cover border-2 border-royal/20" />
                    <span className={`text-sm font-semibold hidden xl:block ${isScrolled || !isHome ? "text-navy" : "text-white"}`}>
                      {user?.name.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} className={`${isScrolled || !isHome ? "text-navy/60" : "text-white/60"} transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-navy/8 py-2 z-50">
                      <div className="px-4 py-3 border-b border-navy/8">
                        <p className="text-sm font-semibold text-navy">{user?.name}</p>
                        <p className="text-xs text-navy/50">{user?.email}</p>
                      </div>
                      {user?.premiumMember && (
                        <div className="mx-3 my-2 px-3 py-1.5 bg-gold-50 border border-gold-200 rounded-lg flex items-center gap-2">
                          <Star size={12} className="text-gold fill-gold" />
                          <span className="text-xs font-semibold text-gold-500">Premium Member</span>
                        </div>
                      )}
                      <Link to={ROLE_ROUTES[user?.role as UserRole] ?? "/dashboard"} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy/70 hover:text-royal hover:bg-royal-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <User size={15} /> Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy/70 hover:text-royal hover:bg-royal-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Settings size={15} /> My Profile
                      </Link>
                      <Link to="/saved" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy/70 hover:text-royal hover:bg-royal-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Bookmark size={15} /> Saved Items
                      </Link>
                      <div className="border-t border-navy/8 mt-1 pt-1">
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors
                              ${isScrolled || !isHome ? "text-navy hover:text-royal" : "text-white/90 hover:text-white"}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm py-2 px-5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden p-2 rounded-lg ${isScrolled || !isHome ? "text-navy" : "text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-navy/8 shadow-xl">
          <div className="container-app py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                              ${active ? "text-royal bg-royal-50" : "text-navy/70 hover:text-navy hover:bg-navy/5"}`}
                >
                  {item.icon} {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-navy/8 flex gap-3">
              {isLoggedIn ? (
                <>
                  <Link to={ROLE_ROUTES[user?.role as UserRole] ?? "/dashboard"} onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-sm py-2.5 text-center">Dashboard</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="flex-1 py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-sm py-2.5 text-center">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-sm py-2.5 text-center">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
