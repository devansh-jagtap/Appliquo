import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../ui/button";
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
      ? "text-green-600 dark:text-green-400"
      : pct >= 40
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-500 dark:text-red-400";

  return (
    <div className="mt-3" aria-label={`ATS Score: ${pct}% - ${label}`}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">ATS Score</span>
        <span className={`text-xs font-bold ${labelColor}`}>{pct}% · {label}</span>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
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

  if (resumes.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
        >
          {/* Icon + title */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
              <HiDocumentText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
                {resume.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDate(resume.created_at)}
              </p>
            </div>
          </div>

          {/* ATS bar */}
          <AtsScoreBar score={resume.ats_score} />

          {/* Actions */}
          <div className="mt-4 flex gap-2 border-t border-border pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewingResume(resume)}
              className="flex-1 gap-1.5 text-xs h-8"
            >
              <HiEye className="h-3.5 w-3.5" />
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(resume.id)}
              disabled={deleting === resume.id}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <HiTrash className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
