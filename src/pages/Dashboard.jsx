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
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border border-primary/10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 shadow-inner">
              <HiDocumentText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="mt-1 text-muted-foreground">
                Track and manage your job applications
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorMap = {
              blue: {
                gradient: "from-primary/15 to-primary/5",
                border: "border-primary/20",
                iconBg: "bg-primary/15",
                icon: "text-primary",
                value: "text-primary",
                bar: "bg-primary",
              },
              amber: {
                gradient: "from-amber-500/15 to-amber-500/5",
                border: "border-amber-500/20",
                iconBg: "bg-amber-100 dark:bg-amber-900/30",
                icon: "text-amber-600 dark:text-amber-400",
                value: "text-amber-600 dark:text-amber-400",
                bar: "bg-amber-500",
              },
              green: {
                gradient: "from-green-500/15 to-green-500/5",
                border: "border-green-500/20",
                iconBg: "bg-green-100 dark:bg-green-900/30",
                icon: "text-green-600 dark:text-green-400",
                value: "text-green-600 dark:text-green-400",
                bar: "bg-green-500",
              },
              red: {
                gradient: "from-red-500/15 to-red-500/5",
                border: "border-red-500/20",
                iconBg: "bg-red-100 dark:bg-red-900/30",
                icon: "text-red-500 dark:text-red-400",
                value: "text-red-500 dark:text-red-400",
                bar: "bg-red-500",
              },
            };
            const colors = colorMap[stat.color] || colorMap.blue;
            return (
              <div
                key={index}
                className={`group rounded-xl border ${colors.border} bg-gradient-to-br ${colors.gradient} p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className={`mt-2 text-4xl font-extrabold ${colors.value}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${colors.iconBg} shadow-sm`}
                  >
                    <Icon className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                </div>
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${colors.bar} opacity-60`}
                    style={{
                      width: totalApplications > 0
                        ? `${Math.round((stat.value / totalApplications) * 100)}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Application Form */}
          <div>
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
