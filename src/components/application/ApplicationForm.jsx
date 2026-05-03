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
import { HiPlusCircle } from "react-icons/hi2";

const ApplicationForm = ({ onAddApplication }) => {
  const [companyName, setCompanyName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [status, setStatus] = React.useState("Applied");

  const handleSubmit = () => {
    if (companyName && role) {
      onAddApplication({
        id: Date.now(),
        companyName,
        role,
        status,
        date: new Date().toLocaleDateString(),
      });
      setCompanyName("");
      setRole("");
      setStatus("Applied");
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HiPlusCircle className="h-5 w-5 text-primary" />
          Add Application
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            placeholder="e.g. Google, Microsoft"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role">Role / Position</Label>
          <Input
            id="role"
            placeholder="e.g. Software Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
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

        <Button
          onClick={handleSubmit}
          disabled={!companyName || !role}
          className="w-full"
        >
          <HiPlusCircle className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApplicationForm;
