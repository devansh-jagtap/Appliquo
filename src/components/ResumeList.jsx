import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { HiTrash, HiDocumentText, HiEye } from "react-icons/hi2";

export default function ResumeList({
  resumes,
  loading,
  onResumeDeleted,
  onResumeView,
}) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (resumeId) => {
    if (!confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      setDeleting(resumeId);

      // Find the resume to check if it has a file
      const resume = resumes.find((r) => r.id === resumeId);

      // If it's a PDF, delete from storage first
      if (resume?.file_type === "pdf" && resume?.file_path) {
        const { error: storageError } = await supabase.storage
          .from("resumes")
          .remove([resume.file_path]);

        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
          // Continue with DB deletion even if storage deletion fails
        }
      }

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
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {resume.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                      {resume.file_type || "text"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Uploaded {formatDate(resume.created_at)}
                  </p>
                  {resume.ats_score !== null && (
                    <p className="text-sm font-medium text-green-600">
                      ATS Score: {resume.ats_score}%
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {onResumeView && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResumeView(resume)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <HiEye className="h-5 w-5" />
                  </Button>
                )}
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
