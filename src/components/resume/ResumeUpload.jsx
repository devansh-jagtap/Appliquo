import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Upload } from "lucide-react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ATS Score calculation helper
const calculateAtsScore = (text) => {
  let score = 0;
  const lower = text.toLowerCase();

  // Length strictly greater than 1500 characters → +20
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

const extractTextFromPdfFile = async (file) => {
  const typedArray = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
  let text = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    text += ` ${content.items.map((item) => item.str || "").join(" ")}`;
  }

  return text.trim();
};

export default function ResumeUpload({ onResumeUploaded }) {
  const [uploadType, setUploadType] = useState("text"); // "text" or "pdf"
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      // Auto-fill title from filename if empty
      if (!title) {
        setTitle(selectedFile.name.replace(".pdf", ""));
      }
    } else {
      alert("Please select a PDF file");
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation based on upload type
    if (!title.trim()) {
      alert("Please provide a resume title");
      return;
    }

    if (uploadType === "text" && !content.trim()) {
      alert("Please provide resume content");
      return;
    }

    if (uploadType === "pdf" && !file) {
      alert("Please select a PDF file");
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

      let resumeContent = "";
      let atsScore = 0;

      if (uploadType === "pdf") {
        // Upload PDF to storage
        const fileName = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        resumeContent = `PDF:${fileName}`;
        try {
          const extractedText = await extractTextFromPdfFile(file);
          atsScore = calculateAtsScore(extractedText);
        } catch (pdfError) {
          console.error("Failed to extract PDF text for ATS scoring:", pdfError);
          atsScore = 0;
        }
      } else {
        // Text resume
        resumeContent = content.trim();
        atsScore = calculateAtsScore(content);
      }

      // Insert into resumes table
      const { error: insertError } = await supabase.from("resumes").insert({
        user_id: user.id,
        title: title.trim(),
        content: resumeContent,
        ats_score: atsScore,
      });

      if (insertError) throw insertError;

      // Clear form
      setTitle("");
      setContent("");
      setFile(null);
      if (document.getElementById("file-upload")) {
        document.getElementById("file-upload").value = null;
      }

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
        {/* Tab Selector */}
        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => setUploadType("text")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadType === "text"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Text Resume
          </button>
          <button
            type="button"
            onClick={() => setUploadType("pdf")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadType === "pdf"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            PDF Resume
          </button>
        </div>

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

          {uploadType === "text" ? (
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
          ) : (
            <div>
              <Label htmlFor="file-upload">PDF File</Label>
              <div className="mt-2">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50 border-border transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      {file ? (
                        <span className="font-semibold text-foreground">
                          {file.name}
                        </span>
                      ) : (
                        <>
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">PDF only</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                    required={uploadType === "pdf"}
                  />
                </label>
              </div>
            </div>
          )}

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading
              ? "Uploading..."
              : uploadType === "text"
                ? "Upload Text Resume"
                : "Upload PDF Resume"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
