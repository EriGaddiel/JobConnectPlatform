import {
  Home,
  Briefcase,
  User,
  Settings,
  Heart,
  FileText,
  BarChart3,
  Building,
  Users,
  PlusCircle
} from "lucide-react";

export const JOBSEEKER_NAV_ITEMS = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Briefcase, label: "Browse Jobs", href: "/jobs" },
  { icon: Heart, label: "Saved Jobs", href: "/saved-jobs" },
  { icon: FileText, label: "Applications", href: "/applications" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const EMPLOYER_NAV_ITEMS = [
  { icon: Home, label: "Dashboard", href: "/employer/dashboard" },
  { icon: PlusCircle, label: "Post Job", href: "/post-job" },
  { icon: Briefcase, label: "My Jobs", href: "/employer/jobs" },
  { icon: Users, label: "Applications", href: "/employer/applications" },
  { icon: BarChart3, label: "Analytics", href: "/employer/analytics" },
  { icon: Building, label: "Company", href: "/employer/company" },
  { icon: Settings, label: "Settings", href: "/employer/settings" },
];

export const ADMIN_NAV_ITEMS = [
  { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Briefcase, label: "Jobs", href: "/admin/jobs" },
  { icon: Building, label: "Companies", href: "/admin/companies" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export const JOB_TYPES = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "freelance", label: "Freelance" },
  { id: "internship", label: "Internship" }
];

export const EXPERIENCE_LEVELS = [
  { id: "entry", label: "Entry Level" },
  { id: "mid", label: "Mid Level" },
  { id: "senior", label: "Senior Level" },
  { id: "executive", label: "Executive" }
];

export const JOB_CATEGORIES = [
  { value: "all", label: "All Jobs" },
  { value: "formal", label: "Formal Employment" },
  { value: "informal", label: "Informal Employment" }
];
