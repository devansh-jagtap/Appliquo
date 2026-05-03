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
    <Card className="h-fit overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/30" />
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <HiPlusCircle className="h-5 w-5 text-primary" />
          </div>
          Track New Application
        </CardTitle>
        <p className="text-sm text-muted-foreground">Add a new job application to your tracker</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-sm font-medium">Company Name</Label>
          <Input
            id="company"
            placeholder="e.g. Google, Microsoft"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="transition-shadow focus:shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-sm font-medium">Role / Position</Label>
          <Input
            id="role"
            placeholder="e.g. Software Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="transition-shadow focus:shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status" className="text-sm font-medium">Application Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applied">🟦 Applied</SelectItem>
              <SelectItem value="Interview">🟨 Interview</SelectItem>
              <SelectItem value="Offer">🟩 Offer</SelectItem>
              <SelectItem value="Rejected">🟥 Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!companyName || !role}
          className="w-full gap-2 font-semibold"
        >
          <HiPlusCircle className="h-4 w-4" />
          Add Application
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApplicationForm;
