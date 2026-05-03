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
  const label = pct >= 70 ? "Good" : pct >= 40 ? "Fair" : "Poor";
  const labelColor =
    pct >= 70
      ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
      : pct >= 40
        ? "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30"
        : "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30";

  return (
    <div
      className="mt-2.5"
      aria-label={`ATS Score: ${pct}% - ${label}`}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">ATS Score</span>
        <div className="flex items-center gap-1.5">
          <span
            className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${labelColor}`}
          >
            {label}
          </span>
          <span
            className={`text-xs font-bold ${
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
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
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
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-primary/30 via-primary/60 to-primary animate-pulse" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <HiDocumentText className="h-5 w-5 text-primary" />
            </div>
            Your Resumes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (resumes.length === 0) {
    return (
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-primary/30 via-primary/60 to-primary" />
        <CardContent className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <HiDocumentText className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">No resumes yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
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
          className="gap-2"
        >
          ← Back to List
        </Button>
        <ResumeViewer resume={viewingResume} />
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-primary/30 via-primary/60 to-primary" />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <HiDocumentText className="h-5 w-5 text-primary" />
            </div>
            Your Resumes
          </CardTitle>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {resumes.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                    <HiDocumentText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate text-sm">
                      {resume.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Uploaded {formatDate(resume.created_at)}
                    </p>
                    <AtsScoreBar score={resume.ats_score} />
                  </div>
                </div>

                <div className="flex shrink-0 gap-1 mt-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingResume(resume)}
                    className="h-8 w-8 p-0 text-primary hover:text-primary/80 hover:bg-primary/10"
                    title="View resume"
                  >
                    <HiEye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(resume.id)}
                    disabled={deleting === resume.id}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete resume"
                  >
                    <HiTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
