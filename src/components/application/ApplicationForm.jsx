import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ApplicationForm = ({ onAddApplication }) => {
  const [companyName, setCompanyName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [platform, setPlatform] = React.useState("");
  const [status, setStatus] = React.useState("Applied");

  const handleSubmit = () => {
    if (companyName && role) {
      onAddApplication({
        id: Date.now(),
        companyName,
        role,
        status,
        platform,
        date: new Date().toLocaleDateString(),
      });
      setCompanyName("");
      setRole("");
      setPlatform("");
      setStatus("Applied");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Application</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role / Position</Label>
          <Input
            id="role"
            placeholder="Enter role or position"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="Platform">
            Platform - Where you filed the application{" "}
          </Label>
          <Input
            id="Platform"
            placeholder="Enter Platform where you filled the application"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit}>Add Application</Button>
      </CardContent>
    </Card>
  );
};

export default ApplicationForm;
