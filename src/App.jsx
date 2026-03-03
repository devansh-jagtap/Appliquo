import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Resume from "./pages/Resume";
import HeroSection from "./components/landing/HeroSection";
import { Layout } from "lucide-react";
import Auth from "./pages/Auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { supabase } from "./lib/supabase";

function App() {
  useEffect(() => {
    // Handle OAuth callback
    const handleOAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session && window.location.hash) {
        // Clear the hash from URL
        window.history.replaceState(null, "", window.location.pathname);
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
