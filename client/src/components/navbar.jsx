
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Jobs", path: "/jobs" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // Focus trapping and Escape key handling for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      const focusableElements = mobileMenuRef.current.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          setIsMenuOpen(false);
          mobileMenuButtonRef.current?.focus();
        } else if (event.key === "Tab") {
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      firstElement?.focus();

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isMenuOpen]);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-jobconnect-primary ${
                  isActive(item.path)
                    ? "text-jobconnect-primary"
                    : "text-foreground"
                }`}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/auth?tab=register">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              ref={mobileMenuButtonRef}
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden" ref={mobileMenuRef}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-jobconnect-primary ${
                    isActive(item.path)
                      ? "text-jobconnect-primary"
                      : "text-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Button variant="ghost" asChild>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?tab=register" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
