
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { 
  JOBSEEKER_NAV_ITEMS,
  EMPLOYER_NAV_ITEMS,
  ADMIN_NAV_ITEMS
} from "@/lib/constants";

export function DashboardSidebar({ role = "jobseeker" }) {
  const location = useLocation();

  const getNavItems = () => {
    switch (role) {
      case "employer":
        return EMPLOYER_NAV_ITEMS;
      case "admin":
        return ADMIN_NAV_ITEMS;
      default:
        return JOBSEEKER_NAV_ITEMS;
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
