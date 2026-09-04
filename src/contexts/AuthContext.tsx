import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, UserRole, RegisteredAccount } from "@/types";

// ─── Storage Keys ───────────────────────────────────────────────────────────
const KEY_SESSION = "europium_session";
const KEY_ACCOUNTS = "europium_accounts";
const KEY_REMEMBER = "europium_remember";

// ─── Demo / seed accounts ────────────────────────────────────────────────────
const DEMO_ACCOUNTS: RegisteredAccount[] = [
  {
    id: "demo_001",
    name: "Demo User",
    email: "demo.user@europium.com",
    mobile: "+91 98765 43210",
    passwordHash: btoa("Demo@123"),
    role: "JobSeeker",
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "admin_001",
    name: "Admin User",
    email: "admin@europium.com",
    mobile: "+49 89 0000 0001",
    passwordHash: btoa("Admin@123"),
    role: "Admin",
    createdAt: Date.now() - 86400000 * 90,
  },
];

function buildUser(acc: RegisteredAccount): User {
  return {
    id: acc.id,
    name: acc.name,
    email: acc.email,
    mobile: acc.mobile,
    avatar: `https://picsum.photos/seed/${acc.id}/120/120`,
    role: acc.role ?? "JobSeeker",
    location: "India → Europe",
    savedJobs: acc.id === "demo_001" ? ["j1", "j4"] : [],
    savedUniversities: acc.id === "demo_001" ? ["u3"] : [],
    savedProperties: acc.id === "demo_001" ? ["p2"] : [],
    savedDestinations: acc.id === "demo_001" ? ["d1", "d3"] : [],
    appliedJobs: acc.id === "demo_001" ? ["j2"] : [],
    premiumMember: acc.id === "admin_001",
    joinedDate: new Date(acc.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    profileComplete: acc.id === "demo_001" ? 78 : 95,
    registeredAt: acc.createdAt,
  };
}

// ─── RBAC ────────────────────────────────────────────────────────────────────
export const ROLE_ROUTES: Record<UserRole, string> = {
  Traveler: "/dashboard/traveler",
  Student: "/dashboard/student",
  JobSeeker: "/dashboard",
  Professional: "/dashboard/professional",
  Entrepreneur: "/dashboard/entrepreneur",
  Employer: "/dashboard/employer",
  PropertyProvider: "/dashboard/property",
  Admin: "/dashboard/admin",
};

export const ROLE_CAN_ACCESS: Record<UserRole, string[]> = {
  Traveler: ["/dashboard/traveler", "/dashboard"],
  Student: ["/dashboard/student", "/dashboard"],
  JobSeeker: ["/dashboard"],
  Professional: ["/dashboard/professional", "/dashboard"],
  Entrepreneur: ["/dashboard/entrepreneur", "/dashboard"],
  Employer: ["/dashboard/employer", "/dashboard"],
  PropertyProvider: ["/dashboard/property", "/dashboard"],
  Admin: [
    "/dashboard",
    "/dashboard/traveler",
    "/dashboard/student",
    "/dashboard/professional",
    "/dashboard/entrepreneur",
    "/dashboard/employer",
    "/dashboard/property",
    "/dashboard/admin",
  ],
};

// ─── Context types ────────────────────────────────────────────────────────────
export interface AuthError {
  field?: string;
  message: string;
}

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  authError: AuthError | null;

  // Auth actions
  register: (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
  }) => Promise<{ success: boolean; error?: AuthError }>;
  login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: AuthError }>;
  loginSocial: (provider: "google" | "facebook" | "apple") => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateProfile: (data: Partial<User>) => void;
  clearAuthError: () => void;

  // Account checks
  accountExists: (email: string) => boolean;
  getPendingAccount: () => RegisteredAccount | null;

  // Saved items
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

// ─── Helper ───────────────────────────────────────────────────────────────────
function loadAccounts(): RegisteredAccount[] {
  try {
    const stored = localStorage.getItem(KEY_ACCOUNTS);
    const user_accounts: RegisteredAccount[] = stored ? JSON.parse(stored) : [];
    // Merge demo accounts (don't duplicate)
    const merged = [...DEMO_ACCOUNTS];
    user_accounts.forEach((ua) => {
      if (!merged.find((d) => d.email === ua.email)) merged.push(ua);
    });
    return merged;
  } catch {
    return DEMO_ACCOUNTS;
  }
}

function saveAccounts(accounts: RegisteredAccount[]) {
  // Only persist non-demo accounts
  const toSave = accounts.filter((a) => !DEMO_ACCOUNTS.find((d) => d.id === a.id));
  localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(toSave));
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  // pending = registered but not yet logged in (OTP step passed, role not set)
  const [pendingAccount, setPendingAccount] = useState<RegisteredAccount | null>(null);

  useEffect(() => {
    const session = localStorage.getItem(KEY_SESSION) || sessionStorage.getItem(KEY_SESSION);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        /* ignore */
      }
    }
    setIsLoading(false);
  }, []);

  const persistUser = useCallback((u: User, remember = false) => {
    setUser(u);
    const data = JSON.stringify(u);
    if (remember) {
      localStorage.setItem(KEY_SESSION, data);
    } else {
      sessionStorage.setItem(KEY_SESSION, data);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem(KEY_SESSION);
    sessionStorage.removeItem(KEY_SESSION);
  }, []);

  // ── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(
    async (data: { name: string; email: string; mobile: string; password: string }) => {
      await new Promise((r) => setTimeout(r, 900)); // simulate API call
      const accounts = loadAccounts();
      const exists = accounts.find((a) => a.email.toLowerCase() === data.email.toLowerCase());
      if (exists) {
        const err: AuthError = { field: "email", message: "An account with this email already exists." };
        setAuthError(err);
        return { success: false, error: err };
      }
      const newAcc: RegisteredAccount = {
        id: `user_${Date.now()}`,
        name: data.name,
        email: data.email.toLowerCase(),
        mobile: data.mobile,
        passwordHash: btoa(data.password),
        role: null,
        createdAt: Date.now(),
      };
      const updated = [...accounts, newAcc];
      saveAccounts(updated);
      setPendingAccount(newAcc);
      setAuthError(null);
      return { success: true };
    },
    []
  );

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string, remember = false) => {
      await new Promise((r) => setTimeout(r, 800));
      const accounts = loadAccounts();
      const acc = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (!acc) {
        const err: AuthError = { field: "email", message: "No account found with this email. Please register first." };
        setAuthError(err);
        return { success: false, error: err };
      }
      if (atob(acc.passwordHash) !== password) {
        const err: AuthError = { field: "password", message: "Incorrect password. Please try again." };
        setAuthError(err);
        return { success: false, error: err };
      }
      const u = buildUser(acc);
      localStorage.setItem(KEY_REMEMBER, String(remember));
      persistUser(u, remember);
      setAuthError(null);
      return { success: true };
    },
    [persistUser]
  );

  // ── Social Login ────────────────────────────────────────────────────────────
  const loginSocial = useCallback(
    async (provider: "google" | "facebook" | "apple") => {
      await new Promise((r) => setTimeout(r, 1200));
      const mockAcc: RegisteredAccount = {
        id: `social_${provider}_${Date.now()}`,
        name: provider === "google" ? "Google User" : provider === "facebook" ? "Facebook User" : "Apple User",
        email: `${provider}.user.${Date.now()}@social.auth`,
        mobile: "",
        passwordHash: btoa("social_auth"),
        role: null,
        createdAt: Date.now(),
      };
      const accounts = loadAccounts();
      saveAccounts([...accounts, mockAcc]);
      setPendingAccount(mockAcc);
    },
    []
  );

  // ── Set Role ────────────────────────────────────────────────────────────────
  const setRole = useCallback(
    (role: UserRole) => {
      // Update persisted account role
      const accounts = loadAccounts();
      const target = pendingAccount ?? (user ? accounts.find((a) => a.id === user.id) : null);
      if (target) {
        target.role = role;
        saveAccounts(accounts.map((a) => (a.id === target.id ? target : a)));
        const u = buildUser(target);
        persistUser(u, localStorage.getItem(KEY_REMEMBER) === "true");
        setPendingAccount(null);
      }
    },
    [pendingAccount, user, persistUser]
  );

  // ── Update Profile ──────────────────────────────────────────────────────────
  const updateProfile = useCallback(
    (data: Partial<User>) => {
      if (!user) return;
      const updated = { ...user, ...data };
      persistUser(updated, localStorage.getItem(KEY_REMEMBER) === "true");
    },
    [user, persistUser]
  );

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearUser();
    setPendingAccount(null);
  }, [clearUser]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const accountExists = useCallback((email: string) => {
    return loadAccounts().some((a) => a.email.toLowerCase() === email.toLowerCase());
  }, []);

  const getPendingAccount = useCallback(() => pendingAccount, [pendingAccount]);

  // ── Saved items ─────────────────────────────────────────────────────────────
  const toggleSaveJob = (jobId: string) => {
    if (!user) return;
    const saved = user.savedJobs.includes(jobId)
      ? user.savedJobs.filter((id) => id !== jobId)
      : [...user.savedJobs, jobId];
    persistUser({ ...user, savedJobs: saved }, localStorage.getItem(KEY_REMEMBER) === "true");
  };

  const toggleSaveUniversity = (uniId: string) => {
    if (!user) return;
    const saved = user.savedUniversities.includes(uniId)
      ? user.savedUniversities.filter((id) => id !== uniId)
      : [...user.savedUniversities, uniId];
    persistUser({ ...user, savedUniversities: saved }, localStorage.getItem(KEY_REMEMBER) === "true");
  };

  const toggleSaveProperty = (propId: string) => {
    if (!user) return;
    const saved = user.savedProperties.includes(propId)
      ? user.savedProperties.filter((id) => id !== propId)
      : [...user.savedProperties, propId];
    persistUser({ ...user, savedProperties: saved }, localStorage.getItem(KEY_REMEMBER) === "true");
  };

  const toggleSaveDestination = (destId: string) => {
    if (!user) return;
    const saved = user.savedDestinations.includes(destId)
      ? user.savedDestinations.filter((id) => id !== destId)
      : [...user.savedDestinations, destId];
    persistUser({ ...user, savedDestinations: saved }, localStorage.getItem(KEY_REMEMBER) === "true");
  };

  const applyToJob = (jobId: string) => {
    if (!user) return;
    if (!user.appliedJobs.includes(jobId)) {
      persistUser({ ...user, appliedJobs: [...user.appliedJobs, jobId] }, localStorage.getItem(KEY_REMEMBER) === "true");
    }
  };

  const isJobSaved = (id: string) => user?.savedJobs.includes(id) ?? false;
  const isUniversitySaved = (id: string) => user?.savedUniversities.includes(id) ?? false;
  const isPropertySaved = (id: string) => user?.savedProperties.includes(id) ?? false;
  const isDestinationSaved = (id: string) => user?.savedDestinations.includes(id) ?? false;
  const isJobApplied = (id: string) => user?.appliedJobs.includes(id) ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        authError,
        register,
        login,
        loginSocial,
        logout,
        setRole,
        updateProfile,
        clearAuthError,
        accountExists,
        getPendingAccount,
        toggleSaveJob,
        toggleSaveUniversity,
        toggleSaveProperty,
        toggleSaveDestination,
        applyToJob,
        isJobSaved,
        isUniversitySaved,
        isPropertySaved,
        isDestinationSaved,
        isJobApplied,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
