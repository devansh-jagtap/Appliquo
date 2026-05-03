import React from "react";
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
    <div className="p-5">
      <p className="mb-4 text-sm font-semibold text-foreground">Track New Application</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Company</Label>
          <Input
            id="company"
            placeholder="e.g. Google"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</Label>
          <Input
            id="role"
            placeholder="e.g. Software Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</Label>
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

        <div className="flex items-end">
          <Button
            onClick={handleSubmit}
            disabled={!companyName || !role}
            className="w-full gap-2 font-semibold"
          >
            <HiPlusCircle className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
