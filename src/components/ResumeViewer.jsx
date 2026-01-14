import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { supabase } from "../lib/supabase";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker using react-pdf's bundled version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ResumeViewer({ resume }) {
  const [url, setUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (resume?.file_type === "pdf" && resume?.file_path) {
        try {
          setLoading(true);
          setError(null);

          const { data, error: urlError } = await supabase.storage
            .from("resumes")
            .createSignedUrl(resume.file_path, 3600);

          if (urlError) {
            console.error("Signed URL error:", urlError);
            throw urlError;
          }

          if (!data?.signedUrl) {
            throw new Error("No signed URL returned");
          }

          console.log("PDF URL loaded:", data.signedUrl);
          setUrl(data.signedUrl);
        } catch (err) {
          console.error("Error loading PDF:", err);
          setError(`Failed to load PDF: ${err.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPdf();
  }, [resume]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log("PDF loaded successfully, pages:", numPages);
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error("PDF document load error:", error);
    setError(
      `Failed to load PDF document: ${error.message || "Unknown error"}`
    );
  };

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Select a resume to view
      </div>
    );
  }

  // Text resume
  if (resume.file_type === "text") {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-bold mb-4">{resume.title}</h2>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {resume.content}
        </pre>
      </div>
    );
  }

  // PDF resume
  if (resume.file_type === "pdf") {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading PDF...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (!url) {
      return null;
    }

    return (
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">{resume.title}</h2>
          {numPages && (
            <p className="text-sm text-gray-600 mt-1">
              {numPages} page{numPages !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="max-h-[600px] overflow-auto p-4">
          <Document
            file={{ url }}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            options={{
              cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
              cMapPacked: true,
              standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
            }}
            loading={
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading document...</p>
              </div>
            }
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                className="mb-4"
                width={Math.min(window.innerWidth * 0.8, 800)}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            ))}
          </Document>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      Unknown resume format
    </div>
  );
}
