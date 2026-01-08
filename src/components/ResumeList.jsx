import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { HiTrash, HiDocumentText } from "react-icons/hi2";

export default function ResumeList({ resumes, loading, onResumeDeleted }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (resumeId) => {
    if (!confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      setDeleting(resumeId);

      // Delete row from DB
      const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resumeId);

      if (error) throw error;

      // Update UI
      if (onResumeDeleted) {
        onResumeDeleted();
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume: " + error.message);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          Loading resumes...
        </CardContent>
      </Card>
    );
  }

  if (resumes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <HiDocumentText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600">No resumes yet</p>
          <p className="text-sm text-gray-500">
            Upload your first resume to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Resumes ({resumes.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-start gap-3 flex-1">
                <HiDocumentText className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {resume.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Uploaded {formatDate(resume.created_at)}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    ATS Score: {resume.ats_score ?? 0}%
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(resume.id)}
                disabled={deleting === resume.id}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <HiTrash className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
