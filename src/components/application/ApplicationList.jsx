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
  Applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Interview:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Offer: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Rejected: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300",
  "In Progress":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Accepted:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
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
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Your Applications ({applications.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <HiBriefcase className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">No applications yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first application using the form
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-lg border border-border bg-background p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate font-semibold text-foreground">
                      {app.company}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {app.role}
                    </p>
                    {(app.created_at || app.date) && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(app.created_at) || app.date}
                      </p>
                    )}
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusStyles[app.status] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Select
                      value={app.status}
                      onValueChange={(newStatus) =>
                        onUpdateStatus(app.id, newStatus)
                      }
                      aria-label="Update application status"
                    >
                      <SelectTrigger className="w-[130px] text-xs">
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
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      onClick={() => onDeleteApplication(app.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationList;
