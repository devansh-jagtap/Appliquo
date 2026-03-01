import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  Navbar as ResizableNavbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "./ui/resizable-navbar";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const navItems = user
    ? [
        { name: "Dashboard", to: "/dashboard" },
        { name: "Assistant", to: "/assistant" },
        { name: "Resumes", to: "/resumes" },
      ]
    : [];

  return (
    <div className="relative w-full">
      <ResizableNavbar>
        {/* Desktop navigation */}
        <NavBody>
          {/* Brand */}
          <Link
            to="/"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-lg">
              AQ
            </span>
            <span className="text-base font-semibold text-foreground">
              Appliquo
            </span>
          </Link>

          {/* Center nav items (desktop) */}
          <div className="absolute inset-0 hidden flex-1 items-center justify-center gap-1 text-sm font-medium lg:flex">
            {user &&
              navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative rounded-full px-4 py-2 text-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
                >
                  {item.name}
                </Link>
              ))}
          </div>

          {/* Right actions (desktop) */}
          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <NavbarButton
                as="button"
                type="button"
                variant="secondary"
                onClick={handleLogout}
              >
                Logout
              </NavbarButton>
            ) : (
              <NavbarButton as={Link} to="/auth" variant="primary">
                Login / Sign Up
              </NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile navigation */}
        <MobileNav>
          <MobileNavHeader>
            <Link
              to="/"
              className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-lg">
                AQ
              </span>
              <span className="text-base font-semibold text-foreground">
                Appliquo
              </span>
            </Link>

            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {user &&
              navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-md px-2 py-2 text-base text-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
                >
                  {item.name}
                </Link>
              ))}

            <div className="mt-4 flex w-full flex-col gap-3">
              {user ? (
                <NavbarButton
                  as="button"
                  type="button"
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </NavbarButton>
              ) : (
                <NavbarButton
                  as={Link}
                  to="/auth"
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login / Sign Up
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
    </div>
  );
}
