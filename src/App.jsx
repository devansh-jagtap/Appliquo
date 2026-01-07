import "./App.css";
import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import HeroSectionOne from "./components/hero-section-demo-1";
import { Layout } from "lucide-react";
import Auth from "./pages/Auth";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
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
    // <section className="min-h-screen bg-background py-8 px-4">
    //   <div className="max-w-4xl mx-auto space-y-8">
    //     {/* Header */}
    //     <header className="text-center">
    //       <h1 className="text-5xl font-extrabold text-foreground">Appliquo</h1>
    //       <p className="text-muted-foreground text-lg mt-2">
    //         AI-powered job application tracking and optimization
    //       </p>
    //     </header>

    //     {/* Add Application Form */}
    //     <ApplicationForm onAddApplication={handleAddApplication} />

    //     {/* Applications List */}
    //     <ApplicationList
    //       applications={applications}
    //       onUpdateStatus={handleUpdateStatus}
    //       onDeleteApplication={handleDeleteApplication}
    //     />
    //   </div>
    //   <div>
    //     <Faq />
    //   </div>
    // </section>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroSectionOne />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
              // applications={applications}
              // handleAddApplication={handleAddApplication}
              // handleUpdateStatus={handleUpdateStatus}
              // handleDeleteApplication={handleDeleteApplication}
              />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
