import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "@/types";

const MOCK_USER: User = {
  id: "u_demo_001",
  name: "Rahul Verma",
  email: "rahul.verma@email.com",
  avatar: "https://picsum.photos/seed/rahul-avatar/120/120",
  role: "seeker",
  location: "Munich, Germany",
  savedJobs: ["j1", "j4"],
  savedUniversities: ["u3"],
  savedProperties: ["p2"],
  savedDestinations: ["d1", "d3"],
  appliedJobs: ["j2"],
  premiumMember: true,
  joinedDate: "March 2026",
  profileComplete: 78,
};

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  toggleSaveJob: (jobId: string) => void;
  toggleSaveUniversity: (uniId: string) => void;
  toggleSaveProperty: (propId: string) => void;
  toggleSaveDestination: (destId: string) => void;
  applyToJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  isUniversitySaved: (uniId: string) => boolean;
  isPropertySaved: (propId: string) => boolean;
  isDestinationSaved: (destId: string) => boolean;
  isJobApplied: (jobId: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("europium_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { setUser(MOCK_USER); }
    }
  }, []);

  const persist = (u: User) => {
    setUser(u);
    localStorage.setItem("europium_user", JSON.stringify(u));
  };

  const login = () => persist(MOCK_USER);
  const logout = () => { setUser(null); localStorage.removeItem("europium_user"); };

  const toggleSaveJob = (jobId: string) => {
    if (!user) { login(); return; }
    const saved = user.savedJobs.includes(jobId)
      ? user.savedJobs.filter((id) => id !== jobId)
      : [...user.savedJobs, jobId];
    persist({ ...user, savedJobs: saved });
  };

  const toggleSaveUniversity = (uniId: string) => {
    if (!user) { login(); return; }
    const saved = user.savedUniversities.includes(uniId)
      ? user.savedUniversities.filter((id) => id !== uniId)
      : [...user.savedUniversities, uniId];
    persist({ ...user, savedUniversities: saved });
  };

  const toggleSaveProperty = (propId: string) => {
    if (!user) { login(); return; }
    const saved = user.savedProperties.includes(propId)
      ? user.savedProperties.filter((id) => id !== propId)
      : [...user.savedProperties, propId];
    persist({ ...user, savedProperties: saved });
  };

  const toggleSaveDestination = (destId: string) => {
    if (!user) { login(); return; }
    const saved = user.savedDestinations.includes(destId)
      ? user.savedDestinations.filter((id) => id !== destId)
      : [...user.savedDestinations, destId];
    persist({ ...user, savedDestinations: saved });
  };

  const applyToJob = (jobId: string) => {
    if (!user) { login(); return; }
    if (!user.appliedJobs.includes(jobId)) {
      persist({ ...user, appliedJobs: [...user.appliedJobs, jobId] });
    }
  };

  const isJobSaved = (id: string) => user?.savedJobs.includes(id) ?? false;
  const isUniversitySaved = (id: string) => user?.savedUniversities.includes(id) ?? false;
  const isPropertySaved = (id: string) => user?.savedProperties.includes(id) ?? false;
  const isDestinationSaved = (id: string) => user?.savedDestinations.includes(id) ?? false;
  const isJobApplied = (id: string) => user?.appliedJobs.includes(id) ?? false;

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user,
      login, logout,
      toggleSaveJob, toggleSaveUniversity, toggleSaveProperty, toggleSaveDestination, applyToJob,
      isJobSaved, isUniversitySaved, isPropertySaved, isDestinationSaved, isJobApplied,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
