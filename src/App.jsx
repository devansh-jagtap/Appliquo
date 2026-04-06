import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Resume from "./pages/Resume";
import HeroSection from "./components/landing/HeroSection";
import Auth from "./pages/Auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { supabase } from "./lib/supabase";

function App() {
  useEffect(() => {
    const clearAuthUrlArtifacts = () => {
      if (window.location.hash || window.location.search) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    const isRecoverableAuthError = (message = "") => {
      const normalized = message.toLowerCase();
      return (
        normalized.includes("issued in the future") ||
        normalized.includes("jwt") ||
        normalized.includes("token") ||
        normalized.includes("401") ||
        normalized.includes("unauthorized")
      );
    };

    const handleOAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error && isRecoverableAuthError(error.message)) {
        await supabase.auth.signOut({ scope: "local" });
        clearAuthUrlArtifacts();
        return;
      }

      if (data?.session) {
        clearAuthUrlArtifacts();
      }
    };

    handleOAuthCallback();
  }, []);
  // const [applications, setApplications] = useState([]);
  // const isInitialMount = useRef(true);

  // useEffect(() => {
  //   const storedApplications = localStorage.getItem("applications");

  //   if (storedApplications) {
  //     setApplications(JSON.parse(storedApplications));
  //   }
  // }, []);

  // useEffect(() => {
  // if (isInitialMount.current) {
  //   isInitialMount.current = false;
  //   return;
  // }
  // localStorage.setItem("applications", JSON.stringify(applications));
  // }, [applications]);

  // const handleAddApplication = (newApplication) => {
  //   setApplications([...applications, newApplication]);
  // };

  // const handleUpdateStatus = (id, newStatus) => {
  //   setApplications(
  //     applications.map((app) =>
  //       app.id === id ? { ...app, status: newStatus } : app
  //     )
  //   );
  // };

  // const handleDeleteApplication = (id) => {
  //   setApplications(applications.filter((app) => app.id !== id));
  // };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assistant"
          element={
            <ProtectedRoute>
              <Assistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumes"
          element={
            <ProtectedRoute>
              <Resume />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
