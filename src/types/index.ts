export type UserRole =
  | "Traveler"
  | "Student"
  | "JobSeeker"
  | "Professional"
  | "Entrepreneur"
  | "Employer"
  | "PropertyProvider"
  | "Admin";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  avatar: string;
  role: UserRole;
  location: string;
  savedJobs: string[];
  savedUniversities: string[];
  savedProperties: string[];
  savedDestinations: string[];
  appliedJobs: string[];
  premiumMember: boolean;
  joinedDate: string;
  profileComplete: number;
  bio?: string;
  targetCountry?: string;
  linkedIn?: string;
  languages?: string[];
  registeredAt: number;
}

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string; // base64 in mock
  role: UserRole | null;
  createdAt: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  country: string;
  countryFlag: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  type: "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote";
  category: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
  deadline: string;
  applicants: number;
  verified: boolean;
  featured: boolean;
  remote: boolean;
  visa: boolean;
  experience: string;
  skills: string[];
}

export interface University {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  city: string;
  image: string;
  rank: number;
  rankLabel: string;
  programs: string[];
  tuitionMin: number;
  tuitionMax: number;
  tuitionLabel: string;
  type: "Public" | "Private";
  intake: string[];
  language: string[];
  acceptance: number;
  scholarships: boolean;
  verified: boolean;
  featured: boolean;
  description: string;
  founded: number;
  students: number;
  rating: number;
}

export interface Property {
  id: string;
  title: string;
  type: "Apartment" | "Studio" | "House" | "Shared" | "Room";
  country: string;
  countryFlag: string;
  city: string;
  image: string;
  images: string[];
  rentMin: number;
  rentMax: number;
  rentLabel: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnished: boolean;
  utilities: boolean;
  petFriendly: boolean;
  verified: boolean;
  featured: boolean;
  nearUniversity: boolean;
  available: string;
  description: string;
  amenities: string[];
  rating: number;
  reviews: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  tagline: string;
  image: string;
  category: string[];
  costOfLiving: "Low" | "Medium" | "High" | "Very High";
  costIndex: number;
  safetyScore: number;
  qualityOfLife: number;
  climate: string;
  language: string[];
  population: string;
  visaFriendly: boolean;
  workOpportunities: "Excellent" | "Good" | "Fair" | "Limited";
  description: string;
  highlights: string[];
  monthlyBudget: number;
  featured: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  country: string;
  countryFlag: string;
  type: "Scholarship" | "Grant" | "Fellowship" | "Exchange" | "Internship" | "Training";
  amount: number;
  amountLabel: string;
  deadline: string;
  eligibility: string[];
  description: string;
  featured: boolean;
  verified: boolean;
  category: string;
  link: string;
}

export interface DashboardStats {
  profileViews: number;
  applicationsCount: number;
  savedItems: number;
  interviews: number;
  activityTimeline: ActivityItem[];
  applicationsByStatus: StatusData[];
  jobsByCategory: CategoryData[];
}

export interface ActivityItem {
  id: string;
  action: string;
  details: string;
  time: string;
  type: "application" | "save" | "view" | "message" | "match";
}

export interface StatusData {
  name: string;
  value: number;
  color: string;
}

export interface CategoryData {
  name: string;
  jobs: number;
  applications: number;
}

export interface SearchFilters {
  query: string;
  country: string;
  category: string;
  type: string;
  salaryMin: number;
  salaryMax: number;
  remote: boolean;
  visa: boolean;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
