import React from "react";
import ApplicationForm from "@/components/applicationForm";
import ApplicationList from "@/components/applicationList";
import { Faq } from "../components/faq";

const Dashboard = ({
  applications,
  handleAddApplication,
  handleUpdateStatus,
  handleDeleteApplication,
}) => {
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
      <div>
        <Faq />
      </div>
    </section>
  );
};

export default Dashboard;
