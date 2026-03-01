import { HiBriefcase } from "react-icons/hi2";
import Navbar from "./Navbar";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen mt-10">
      {/* Navigation */}
      <Navbar user={user} />

      {/* Theme Toggle - Fixed Bottom Left */}
      <ThemeToggle />

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
