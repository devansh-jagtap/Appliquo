import { useEffect, useState } from "react";
import ApplicationForm from "@/components/application/ApplicationForm";
import ApplicationList from "@/components/application/ApplicationList";
import Layout from "@/components/layout/Layout";
import {
  HiDocumentText,
  HiClock,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi2";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);

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

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: HiDocumentText,
      color: "blue",
    },
    {
      title: "Pending",
      value: pendingApplications,
      icon: HiClock,
      color: "amber",
    },
    {
      title: "Accepted",
      value: acceptedApplications,
      icon: HiCheckCircle,
      color: "green",
    },
    {
      title: "Rejected",
      value: rejectedApplications,
      icon: HiXCircle,
      color: "red",
    },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage your job applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorMap = {
              blue: {
                bg: "bg-primary/10",
                icon: "text-primary",
                value: "text-primary",
              },
              amber: {
                bg: "bg-amber-100 dark:bg-amber-900/30",
                icon: "text-amber-600 dark:text-amber-400",
                value: "text-amber-600 dark:text-amber-400",
              },
              green: {
                bg: "bg-green-100 dark:bg-green-900/30",
                icon: "text-green-600 dark:text-green-400",
                value: "text-green-600 dark:text-green-400",
              },
              red: {
                bg: "bg-red-100 dark:bg-red-900/30",
                icon: "text-red-500 dark:text-red-400",
                value: "text-red-500 dark:text-red-400",
              },
            };
            const colors = colorMap[stat.color] || colorMap.blue;
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className={`mt-2 text-3xl font-bold ${colors.value}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Application Form */}
          <div className="mb-8">
            <ApplicationForm onAddApplication={handleAddApplication} />
          </div>

          {/* Applications List */}
          <ApplicationList
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onDeleteApplication={handleDeleteApplication}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
