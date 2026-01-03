import "./App.css";
import { useState, useEffect, useRef } from "react";
import ApplicationForm from "./components/applicationForm";
import ApplicationList from "./components/applicationList";

function App() {
  const [applications, setApplications] = useState([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const storedApplications = localStorage.getItem("applications");

    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  const handleAddApplication = (newApplication) => {
    setApplications([...applications, newApplication]);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleDeleteApplication = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  return (
    <section className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-5xl font-extrabold text-foreground">Appliquo</h1>
          <p className="text-muted-foreground text-lg mt-2">
            AI-powered job application tracking and optimization
          </p>
        </header>

        {/* Add Application Form */}
        <ApplicationForm onAddApplication={handleAddApplication} />

        {/* Applications List */}
        <ApplicationList
          applications={applications}
          onUpdateStatus={handleUpdateStatus}
          onDeleteApplication={handleDeleteApplication}
        />
      </div>
    </section>
  );
}

export default App;
