import { useEffect, useState, useMemo } from "react";
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

  // Check if content is a PDF (either new format "PDF:path" or old URL format)
  const isPdfContent =
    resume?.content &&
    (resume.content.startsWith("PDF:") ||
      resume.content.includes("/resumes/") ||
      (resume.content.startsWith("http") && resume.content.includes(".pdf")));

  useEffect(() => {
    const loadPdf = async () => {
      if (!isPdfContent && !resume?.file_path) return;

      try {
        setLoading(true);
        setError(null);

        let filePath = null;

        // New format: "PDF:filepath"
        if (resume.content?.startsWith("PDF:")) {
          filePath = resume.content.substring(4); // Remove "PDF:" prefix
        }
        // Old format: file_path field
        else if (resume.file_path) {
          filePath = resume.file_path;
        }
        // Legacy: old public URL format (try to extract path)
        else if (resume.content?.includes("/resumes/")) {
          const match = resume.content.match(/\/resumes\/(.+)$/);
          if (match) {
            filePath = match[1];
          }
        }

        if (!filePath) {
          throw new Error("Could not determine file path");
        }

        // Generate signed URL (valid for 1 hour)
        const { data, error: urlError } = await supabase.storage
          .from("resumes")
          .createSignedUrl(filePath, 3600);

        if (urlError) {
          throw urlError;
        }

        if (!data?.signedUrl) {
          throw new Error("No signed URL returned");
        }

        setUrl(data.signedUrl);
      } catch (err) {
        setError(`Failed to load PDF: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [resume, isPdfContent]);

  // Memoize file prop to prevent unnecessary reloads
  const fileOptions = useMemo(() => ({ url }), [url]);

  // Memoize options prop to prevent unnecessary reloads
  const documentOptions = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    [],
  );

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    setError(
      `Failed to load PDF document: ${error.message || "Unknown error"}`,
    );
  };

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Select a resume to view
      </div>
    );
  }

  // PDF resume (check if content indicates PDF)
  if (isPdfContent || resume.file_type === "pdf") {
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
      <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">{resume.title}</h2>
          {numPages && (
            <p className="text-sm text-gray-600 mt-1">
              {numPages} page{numPages !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="max-h-[600px] overflow-auto p-4">
          <Document
            file={fileOptions}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            options={documentOptions}
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

  // Text resume (content is plain text, not a PDF)
  if (resume.content && !isPdfContent) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {resume.title}
        </h2>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed dark:text-gray-200">
          {resume.content}
        </pre>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      Unknown resume format
    </div>
  );
}
