import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState("text");

  const handleTextSubmit = async (e) => {
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
        file_type: "text",
        file_path: null,
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

  const handlePdfSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      alert("Please select a PDF file");
      return;
    }

    if (pdfFile.type !== "application/pdf") {
      alert("Only PDF files are allowed");
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

      // Generate unique ID for the resume
      const resumeId = crypto.randomUUID();
      const filePath = `${user.id}/${resumeId}.pdf`;

      // 1. Upload PDF to storage
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, pdfFile);

      if (uploadError) throw uploadError;

      // 2. Insert metadata into resumes table
      const { error: dbError } = await supabase.from("resumes").insert({
        id: resumeId,
        user_id: user.id,
        title: title.trim() || pdfFile.name,
        file_type: "pdf",
        file_path: filePath,
        content: null,
        ats_score: null,
      });

      if (dbError) throw dbError;

      // Clear form
      setTitle("");
      setPdfFile(null);
      e.target.reset();

      // Notify parent to refresh list
      if (onResumeUploaded) {
        onResumeUploaded();
      }

      alert("PDF Resume uploaded successfully!");
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload PDF: " + error.message);
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
        <Tabs defaultValue="text" onValueChange={setUploadMode}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Resume</TabsTrigger>
            <TabsTrigger value="pdf">PDF Resume</TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <div>
                <Label htmlFor="text-title">Resume Title</Label>
                <Input
                  id="text-title"
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
                {uploading ? "Uploading..." : "Upload Text Resume"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="pdf">
            <form onSubmit={handlePdfSubmit} className="space-y-4">
              <div>
                <Label htmlFor="pdf-title">Resume Title (Optional)</Label>
                <Input
                  id="pdf-title"
                  type="text"
                  placeholder="Leave blank to use filename"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={uploading}
                />
              </div>

              <div>
                <Label htmlFor="pdf-file">PDF File</Label>
                <Input
                  id="pdf-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                  required
                  className="cursor-pointer"
                />
                {pdfFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {pdfFile.name}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? "Uploading..." : "Upload PDF Resume"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
