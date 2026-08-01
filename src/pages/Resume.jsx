import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Layout from "../components/layout/Layout";
import ResumeUpload from "../components/resume/ResumeUpload";
import ResumeList from "../components/resume/ResumeList";
import { HiDocumentText } from "react-icons/hi2";

export default function Resume() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

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
  };

  const handleResumeDeleted = () => {
    fetchResumes();
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border border-primary/10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 shadow-inner">
              <HiDocumentText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Resumes</h1>
              <p className="mt-1 text-muted-foreground">
                Upload and manage your resumes for job applications
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <ResumeUpload onResumeUploaded={handleResumeUploaded} />
          </div>

          {/* Resume List Section */}
          <div className="lg:col-span-2">
            <ResumeList
              resumes={resumes}
              loading={loading}
              onResumeDeleted={handleResumeDeleted}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
