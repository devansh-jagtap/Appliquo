import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Name */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Appliquo
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/assistant"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Assistant
                </Link>
                <Link
                  to="/resumes"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Resumes
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="ml-4"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Login / Sign Up
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
