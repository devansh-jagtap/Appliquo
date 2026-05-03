import { useEffect, useState } from "react";
import ApplicationForm from "@/components/application/ApplicationForm";
import ApplicationList from "@/components/application/ApplicationList";
import Layout from "@/components/layout/Layout";
import {
  HiDocumentText,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiPlus,
  HiXMark,
} from "react-icons/hi2";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setApplications(data);
      }
    };

    loadApplications();
  }, []);

  const handleAddApplication = async (newApplication) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) return;

    const { error } = await supabase.from("applications").insert([
      {
        company: newApplication.companyName,
        role: newApplication.role,
        status: newApplication.status,
        user_id: user.id,
      },
    ]);

    if (!error) {
      // reload jobs
      const { data } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      setApplications(data);
      setShowForm(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app,
        ),
      );
    }
  };

  const handleDeleteApplication = async (id) => {
    const { error } = await supabase.from("applications").delete().eq("id", id);

    if (!error) {
      setApplications((prev) => prev.filter((app) => app.id !== id));
    }
  };

  // Calculate stats
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (app) => app.status === "Applied" || app.status === "In Progress",
  ).length;
  const acceptedApplications = applications.filter(
    (app) => app.status === "Accepted" || app.status === "Offer",
  ).length;
  const rejectedApplications = applications.filter(
    (app) => app.status === "Rejected",
  ).length;

  const pipeline = [
    {
      label: "Applied",
      value: pendingApplications,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500",
      track: "bg-blue-100 dark:bg-blue-900/30",
      icon: HiClock,
    },
    {
      label: "Accepted",
      value: acceptedApplications,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500",
      track: "bg-emerald-100 dark:bg-emerald-900/30",
      icon: HiCheckCircle,
    },
    {
      label: "Rejected",
      value: rejectedApplications,
      color: "text-rose-500 dark:text-rose-400",
      bg: "bg-rose-500",
      track: "bg-rose-100 dark:bg-rose-900/30",
      icon: HiXCircle,
    },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page title row */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              My Applications
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {totalApplications === 0
                ? "No applications tracked yet"
                : `${totalApplications} application${totalApplications !== 1 ? "s" : ""} tracked`}
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
          >
            {showForm ? (
              <>
                <HiXMark className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <HiPlus className="h-4 w-4" />
                Add Application
              </>
            )}
          </button>
        </div>

        {/* Inline add form */}
        {showForm && (
          <div className="mb-6 rounded-xl border border-border bg-card shadow-sm">
            <ApplicationForm onAddApplication={handleAddApplication} />
          </div>
        )}

        {/* Pipeline stats bar */}
        <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
          {pipeline.map((item) => {
            const Icon = item.icon;
            const pct =
              totalApplications > 0
                ? Math.round((item.value / totalApplications) * 100)
                : 0;
            return (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </span>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <p className={`text-3xl font-extrabold ${item.color}`}>
                  {item.value}
                </p>
                <div className={`mt-3 h-1.5 w-full rounded-full ${item.track}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.bg}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {pct}% of total
                </p>
              </div>
            );
          })}
        </div>

        {/* Applications list — full width */}
        <ApplicationList
          applications={applications}
          onUpdateStatus={handleUpdateStatus}
          onDeleteApplication={handleDeleteApplication}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
