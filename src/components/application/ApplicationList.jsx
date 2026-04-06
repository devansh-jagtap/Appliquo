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

const ApplicationList = ({
  applications,
  onUpdateStatus,
  onDeleteApplication,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No applications yet
          </p>
        ) : (
<<<<<<< Updated upstream:src/components/application/ApplicationList.jsx
          <div className="space-y-4 grid grid-cols-1 gap-5">
=======
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
>>>>>>> Stashed changes:src/components/applicationList.jsx
            {applications.map((app) => (
              <Card key={app.id} className="relative">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{app.company}</CardTitle>
                  <p className="text-sm text-muted-foreground">{app.role}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {app.platform && (
                    <p className="text-xs text-muted-foreground">
                      Platform: {app.platform}
                    </p>
                  )}
                  <Select
                    value={app.status}
                    onValueChange={(newStatus) =>
                      onUpdateStatus(app.id, newStatus)
                    }
                  >
                    <SelectTrigger className="w-full">
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
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => onDeleteApplication(app.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationList;
