import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { HiBriefcase } from "react-icons/hi2";

const statusStyles = {
  Applied: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  Interview: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  Offer: {
    badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800",
    dot: "bg-green-500",
  },
  Rejected: {
    badge: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800",
    dot: "bg-red-500",
  },
  "In Progress": {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  Accepted: {
    badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800",
    dot: "bg-green-500",
  },
};

const avatarColors = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
];

const getAvatarColorClass = (name) => {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ApplicationList = ({
  applications,
  onUpdateStatus,
  onDeleteApplication,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <HiBriefcase className="h-4 w-4 text-muted-foreground" />
            All Applications
          </CardTitle>
          {applications.length > 0 && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {applications.length}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-border py-12 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <HiBriefcase className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No applications yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click <span className="font-semibold">Add Application</span> above to get started
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {applications.map((app) => {
              const style = statusStyles[app.status] ?? {
                badge: "bg-muted text-muted-foreground border border-border",
                dot: "bg-muted-foreground",
              };
              return (
                <div
                  key={app.id}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-all hover:border-primary/20 hover:bg-accent/30"
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm ${getAvatarColorClass(app.company)}`}
                  >
                    {getInitials(app.company)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-foreground text-sm">
                      {app.company}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {app.role}
                      {(app.created_at || app.date) && (
                        <span className="ml-1.5 text-muted-foreground/50">
                          · {formatDate(app.created_at) || app.date}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Status badge (desktop) */}
                  <span
                    className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-flex items-center gap-1 ${style.badge}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    {app.status}
                  </span>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Select
                      value={app.status}
                      onValueChange={(newStatus) =>
                        onUpdateStatus(app.id, newStatus)
                      }
                      aria-label="Update application status"
                    >
                      <SelectTrigger className="h-8 w-[110px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      onClick={() => onDeleteApplication(app.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationList;
