
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
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

export function DashboardSidebar({ role = "jobseeker" }) {
  const location = useLocation();

  const jobseekerNavItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Briefcase, label: "Browse Jobs", href: "/jobs" },
    { icon: Heart, label: "Saved Jobs", href: "/saved-jobs" },
    { icon: FileText, label: "Applications", href: "/applications" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const employerNavItems = [
    { icon: Home, label: "Dashboard", href: "/employer/dashboard" },
    { icon: PlusCircle, label: "Post Job", href: "/post-job" },
    { icon: Briefcase, label: "My Jobs", href: "/employer/jobs" },
    { icon: Users, label: "Applications", href: "/employer/applications" },
    { icon: BarChart3, label: "Analytics", href: "/employer/analytics" },
    { icon: Building, label: "Company", href: "/employer/company" },
    { icon: Settings, label: "Settings", href: "/employer/settings" },
  ];

  const adminNavItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Briefcase, label: "Jobs", href: "/admin/jobs" },
    { icon: Building, label: "Companies", href: "/admin/companies" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const getNavItems = () => {
    switch (role) {
      case "employer":
        return employerNavItems;
      case "admin":
        return adminNavItems;
      default:
        return jobseekerNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <Logo />
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-jobconnect-primary/10 text-jobconnect-primary hover:bg-jobconnect-primary/20"
              )}
              asChild
            >
              <Link to={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/auth">Logout</Link>
        </Button>
      </div>
    </div>
  );
}
