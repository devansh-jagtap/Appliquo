import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Layout from "../components/layout/Layout";
import ResumeUpload from "../components/resume/ResumeUpload";
import ResumeList from "../components/resume/ResumeList";
import { HiDocumentText, HiPlus, HiXMark } from "react-icons/hi2";

export default function Resume() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (user) {
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setResumes(data || []);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleResumeUploaded = () => {
    fetchResumes();
    setShowUpload(false);
  };

  const handleResumeDeleted = () => {
    fetchResumes();
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page title row */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              My Resumes
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {loading
                ? "Loading…"
                : resumes.length === 0
                  ? "No resumes uploaded yet"
                  : `${resumes.length} resume${resumes.length !== 1 ? "s" : ""} in your library`}
            </p>
          </div>
          <button
            onClick={() => setShowUpload((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
          >
            {showUpload ? (
              <>
                <HiXMark className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <HiPlus className="h-4 w-4" />
                Upload Resume
              </>
            )}
          </button>
        </div>

        {/* Upload panel (collapsible) */}
        {showUpload && (
          <div className="mb-6 max-w-xl rounded-xl border border-border bg-card shadow-sm">
            <ResumeUpload onResumeUploaded={handleResumeUploaded} />
          </div>
        )}

        {/* Empty state */}
        {!loading && resumes.length === 0 && !showUpload && (
          <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-border py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <HiDocumentText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No resumes yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click{" "}
              <button
                onClick={() => setShowUpload(true)}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Upload Resume
              </button>{" "}
              to add your first one
            </p>
          </div>
        )}

        {/* Resume list */}
        {(loading || resumes.length > 0) && (
          <ResumeList
            resumes={resumes}
            loading={loading}
            onResumeDeleted={handleResumeDeleted}
          />
        )}
      </div>
    </Layout>
  );
}
