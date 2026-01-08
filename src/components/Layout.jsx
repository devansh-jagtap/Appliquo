import { HiBriefcase } from "react-icons/hi2";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <Navbar user={user} />

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <HiBriefcase className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Appliquo
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Appliquo. AI-powered job application tracking.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
