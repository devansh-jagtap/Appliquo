import { Link, useLocation } from "react-router-dom";
import { HiBriefcase, HiSparkles, HiChartBarSquare } from "react-icons/hi2";

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <HiBriefcase className="h-8 w-8 text-blue-600" />
              <Link
                to="/"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Appliquo
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                <HiChartBarSquare className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/assistant"
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive("/assistant")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                <HiSparkles className="h-5 w-5" />
                AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
