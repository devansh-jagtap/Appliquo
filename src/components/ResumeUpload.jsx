import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// ATS Score calculation helper
const calculateATSScore = (text) => {
  let score = 0;
  const lower = text.toLowerCase();

  // Length > 300 words (approx 1500 chars) → +20
  if (text.length > 1500) score += 20;

  // Keywords check → +10 each
  const keywords = ["react", "javascript", "node", "sql", "api"];
  keywords.forEach((k) => {
    if (lower.includes(k)) score += 10;
  });

  // Sections check → +10 each
  const sections = ["experience", "education", "skills"];
  sections.forEach((s) => {
    if (lower.includes(s)) score += 10;
  });

  return Math.min(score, 100);
};

export default function ResumeUpload({ onResumeUploaded }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please provide both title and resume content");
      return;
    }

    try {
      setUploading(true);

      // Get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("No user logged in");

      // Calculate ATS score
      const atsScore = calculateATSScore(content);

      // Insert into resumes table
      const { error: insertError } = await supabase.from("resumes").insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        ats_score: atsScore,
      });

      if (insertError) throw insertError;

      // Clear form
      setTitle("");
      setContent("");

      // Notify parent to refresh list
      if (onResumeUploaded) {
        onResumeUploaded();
      }

      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Resume Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Software Engineer Resume"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Resume Content</Label>
            <Textarea
              id="content"
              placeholder="Paste your resume text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={uploading}
              rows={12}
              required
              className="font-mono text-sm"
            />
          </div>

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? "Uploading..." : "Upload Resume"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
