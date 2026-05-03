import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { HiTrash, HiDocumentText, HiEye } from "react-icons/hi2";
import ResumeViewer from "./ResumeViewer";

const AtsScoreBar = ({ score }) => {
  const pct = score ?? 0;
  const color =
    pct >= 70
      ? "bg-green-500"
      : pct >= 40
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div
      className="mt-2"
      aria-label={`ATS Score: ${pct}% - ${pct >= 70 ? "Good" : pct >= 40 ? "Fair" : "Poor"}`}
    >
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">ATS Score</span>
        <span
          className={`font-semibold ${
            pct >= 70
              ? "text-green-600 dark:text-green-400"
              : pct >= 40
                ? "text-amber-600 dark:text-amber-400"
                : "text-red-500 dark:text-red-400"
          }`}
        >
          {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default function ResumeList({ resumes, loading, onResumeDeleted }) {
  const [deleting, setDeleting] = useState(null);
  const [viewingResume, setViewingResume] = useState(null);

  const handleDelete = async (resumeId) => {
    if (!confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      setDeleting(resumeId);

      // Find the resume to check if it has a PDF file
      const resume = resumes.find((r) => r.id === resumeId);

      // If it's a PDF, delete from storage first
      if (resume?.content?.startsWith("PDF:")) {
        const filePath = resume.content.substring(4);
        const { error: storageError } = await supabase.storage
          .from("resumes")
          .remove([filePath]);

        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
          // Continue anyway to delete DB record
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
        <CardHeader>
          <CardTitle>Your Resumes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (resumes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <HiDocumentText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-foreground">No resumes yet</p>
          <p className="text-sm text-muted-foreground">
            Upload your first resume to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  // If viewing a resume, show the viewer
  if (viewingResume) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setViewingResume(null)}
          className="mb-4"
        >
          Back to List
        </Button>
        <ResumeViewer resume={viewingResume} />
      </div>
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
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <HiDocumentText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {resume.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Uploaded {formatDate(resume.created_at)}
                  </p>
                  <AtsScoreBar score={resume.ats_score} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingResume(resume)}
                  className="text-primary hover:text-primary/80 hover:bg-primary/10"
                >
                  <HiEye className="h-5 w-5" />
                </Button>
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
