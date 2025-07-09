
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Menu, X, Bell, UserCircle, LogOut, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; // For notification count

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  const { user, isAuthenticated, logout, notifications } = useAuth(); // Get notifications from context

  const isActive = (path) => location.pathname === path;

  const commonNavItems = [
    { label: "Home", path: "/" },
    { label: "Jobs", path: "/jobs" },
    // { label: "About", path: "/about" }, // Example, can add back if needed
    // { label: "Contact", path: "/contact" },
  ];

  const getDashboardPath = () => {
    if (!user) return "/dashboard"; // Default fallback
    switch (user.role) {
      case "employer": return "/employer/dashboard";
      case "admin": return "/admin/dashboard";
      case "jobSeeker":
      default: return "/dashboard";
    }
  };

  const handleLogout = async () => {
    await logout();
    // Navigation is handled by AuthContext logout or can be done here too
    // navigate("/auth");
  };

  // Focus trapping and Escape key handling for mobile menu (remains the same)
  useEffect(() => {
    if (isMenuOpen) {
      const focusableElements = mobileMenuRef.current?.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      if (!focusableElements || focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          setIsMenuOpen(false);
          mobileMenuButtonRef.current?.focus();
        } else if (event.key === "Tab") {
          if (event.shiftKey) { if (document.activeElement === firstElement) { lastElement.focus(); event.preventDefault(); }
          } else { if (document.activeElement === lastElement) { firstElement.focus(); event.preventDefault(); } }
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      firstElement?.focus();
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isMenuOpen]);

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length; // Assuming notifications have an isRead property

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo />
          
          <div className="hidden md:flex items-center space-x-6">
            {commonNavItems.map((item) => (
              <Link key={item.path} to={item.path} className={`text-sm font-medium transition-colors hover:text-jobconnect-primary ${isActive(item.path) ? "text-jobconnect-primary" : "text-foreground"}`} aria-current={isActive(item.path) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
             {isAuthenticated && user?.role === 'employer' && (
                <Link to="/post-job" className="text-sm font-medium transition-colors hover:text-jobconnect-primary text-foreground">Post a Job</Link>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated && user ? (
              <>
                <Button variant="ghost" size="icon" asChild className="relative" title="Notifications">
                  <Link to="/notifications">
                    <Bell className="h-5 w-5" />
                    {unreadNotificationCount > 0 && (
                       <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                        {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                       </Badge>
                    )}
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePicture || undefined} alt={user.fullName || user.username} />
                        <AvatarFallback>{(user.fullName || user.username || "U").substring(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName || user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardPath()}><Briefcase className="mr-2 h-4 w-4" /> Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile"><UserCircle className="mr-2 h-4 w-4" /> Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 focus:bg-red-100 dark:focus:bg-red-700/50 focus:text-red-700 dark:focus:text-red-300">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild><Link to="/auth">Login</Link></Button>
                <Button asChild><Link to="/auth?tab=register">Sign Up</Link></Button>
              </div>
            )}
            <div className="md:hidden">
              <Button ref={mobileMenuButtonRef} variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700" ref={mobileMenuRef}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {commonNavItems.map((item) => (
                <Link key={item.path} to={item.path} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-jobconnect-primary ${isActive(item.path) ? "text-jobconnect-primary bg-accent" : "text-foreground"}`} onClick={() => setIsMenuOpen(false)} aria-current={isActive(item.path) ? "page" : undefined}>
                  {item.label}
                </Link>
              ))}
               {isAuthenticated && user?.role === 'employer' && (
                <Link to="/post-job" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-jobconnect-primary text-foreground`} onClick={() => setIsMenuOpen(false)}>Post a Job</Link>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                {isAuthenticated && user ? (
                  <>
                    <Link to={getDashboardPath()} className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                    <Button variant="ghost" className="w-full justify-start px-3 py-2 text-base font-medium text-red-600 hover:bg-red-100" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full justify-start px-3 py-2 text-base font-medium" asChild><Link to="/auth" onClick={() => setIsMenuOpen(false)}>Login</Link></Button>
                    <Button className="w-full justify-start px-3 py-2 text-base font-medium mt-1" asChild><Link to="/auth?tab=register" onClick={() => setIsMenuOpen(false)}>Sign Up</Link></Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
