
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { 
  JOBSEEKER_NAV_ITEMS,
  EMPLOYER_NAV_ITEMS,
  ADMIN_NAV_ITEMS
} from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

export function DashboardSidebar({ role }) { // Role should now come from useAuth().user.role ideally or passed from parent
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  // Determine role from authenticated user, fallback to prop if user not loaded yet or for display consistency
  const displayRole = user?.role || role || "jobseeker";

  const getNavItems = () => {
    switch (displayRole) {
      case "employer":
        return EMPLOYER_NAV_ITEMS;
      case "admin":
        return ADMIN_NAV_ITEMS;
      case "jobSeeker": // Ensure this matches the role string from backend
      default:
        return JOBSEEKER_NAV_ITEMS;
    }
  };
  const navItems = getNavItems();

  const handleLogout = async () => {
    await logout();
    // Navigation to /auth is handled by AuthContext
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-background border-r sticky top-0"> {/* Use bg-background for theme, sticky */}
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <Logo />
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-primary/10 text-primary hover:bg-primary/20" // Use theme primary
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
      
      <div className="border-t p-4 space-y-3">
        {user && (
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profilePicture || undefined} alt={user.fullName || user.username} />
                    <AvatarFallback>{(user.fullName || user.username || "U").substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm overflow-hidden">
                    <span className="font-medium truncate">{user.fullName || user.username}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
            </div>
        )}
        <Button variant="outline" className="w-full" onClick={handleLogout} disabled={isLoading}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
