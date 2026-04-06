import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";
import { extractPDFText, isValidPDF, cleanExtractedText } from "../../lib/pdfExtractor";

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
  const [uploadType, setUploadType] = useState("text"); // "text" or "pdf"
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractingText, setExtractingText] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [textPreview, setTextPreview] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isValidPDF(selectedFile)) {
      setFile(selectedFile);
      
      // Auto-fill title from filename if empty
      if (!title) {
        setTitle(selectedFile.name.replace(".pdf", ""));
      }

      // Extract text from PDF for preview
      try {
        setExtractingText(true);
        const text = await extractPDFText(selectedFile);
        const cleanedText = cleanExtractedText(text);
        setExtractedText(cleanedText);
        setExtractingText(false);
        
        if (cleanedText) {
          setTextPreview(true);
        }
      } catch (error) {
        console.error("Error extracting PDF text:", error);
        setExtractingText(false);
        setExtractedText("");
        // Continue without text extraction - file can still be uploaded
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
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        
        resumeContent = `PDF:${fileName}`;
        
        // Use extracted text if available, otherwise calculate basic score
        atsScore = extractedText ? calculateATSScore(extractedText) : 75;
      } else {
        // Text resume
        resumeContent = content.trim();
        atsScore = calculateATSScore(content);
      }

      // Insert into resumes table (include extracted_text for PDFs)
      const insertData = {
        user_id: user.id,
        title: title.trim(),
        content: resumeContent,
        ats_score: atsScore,
      };

      // Add extracted text if available (for PDFs)
      if (uploadType === "pdf" && extractedText) {
        insertData.extracted_text = extractedText;
      } else if (uploadType === "text") {
        insertData.extracted_text = content.trim();
      }

      const { error: insertError } = await supabase.from("resumes").insert(insertData);

      if (insertError) throw insertError;

      // Clear form
      setTitle("");
      setContent("");
      setFile(null);
      setExtractedText("");
      setTextPreview(false);
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

              {/* PDF Text Extraction Status */}
              {file && (
                <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">PDF Text Extraction</span>
                  </div>
                  
                  {extractingText && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting text from PDF...
                    </div>
                  )}
                  
                  {!extractingText && extractedText && (
                    <div className="space-y-2">
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Text extracted successfully ({extractedText.length} characters)
                      </div>
                      
                      {!textPreview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setTextPreview(true)}
                        >
                          Preview Extracted Text
                        </Button>
                      )}
                      
                      {textPreview && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Extracted Text Preview:</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setTextPreview(false)}
                            >
                              Hide Preview
                            </Button>
                          </div>
                          <div className="max-h-32 overflow-y-auto p-2 bg-background border border-border rounded text-sm">
                            {extractedText.slice(0, 500)}
                            {extractedText.length > 500 && "..."}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!extractingText && !extractedText && (
                    <div className="text-sm text-orange-600">
                      ⚠ Could not extract text from PDF. File will be uploaded without text extraction.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
            {uploading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </div>
            ) : extractingText ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing PDF...
              </div>
            ) : uploadType === "text" ? (
              "Upload Text Resume"
            ) : (
              "Upload PDF Resume"
            )}
        </form>
      </CardContent>
    </Card>
  );
}
