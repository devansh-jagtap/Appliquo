import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Layout from "../components/Layout";
import ResumeUpload from "../components/ResumeUpload";
import ResumeList from "../components/ResumeList";

export default function Resume() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Resumes</h1>
          <p className="mt-2 text-muted-foreground">
            Upload and manage your resumes for job applications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
