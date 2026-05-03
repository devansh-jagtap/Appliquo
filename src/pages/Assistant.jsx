import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import {
  HiSparkles,
  HiDocumentText,
  HiPencil,
  HiChartBar,
  HiBriefcase,
} from "react-icons/hi2";
import { Loader2 } from "lucide-react";

const generatePrompt = (jobDescription, resumeText) => {
  return `
You are a professional career coach.

Job Description:
${jobDescription}

Resume:
${resumeText}

Provide the response in EXACTLY this format:

RESUME:
- improvement 1
- improvement 2

COVER LETTER:
(write a short tailored cover letter)

SKILLS:
- missing skill 1
- missing skill 2
`;
};

const TABS = [
  { id: "resume", label: "Resume Tips", icon: HiDocumentText, accentClass: "text-emerald-600 dark:text-emerald-400", activeBorder: "border-emerald-500", emptyIcon: HiDocumentText },
  { id: "coverLetter", label: "Cover Letter", icon: HiPencil, accentClass: "text-blue-600 dark:text-blue-400", activeBorder: "border-blue-500", emptyIcon: HiPencil },
  { id: "skills", label: "Skill Gaps", icon: HiChartBar, accentClass: "text-amber-600 dark:text-amber-400", activeBorder: "border-amber-500", emptyIcon: HiChartBar },
];

const Assistant = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("resume");

  const handleGenerator = async () => {
    if (!jobDescription || !resumeText) {
      alert("Please provide both job description and resume.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: generatePrompt(jobDescription, resumeText),
                  },
                ],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Gemini request failed (${response.status})`);
      }

      const data = await response.json();

      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) {
        throw new Error("Empty AI response");
      }

      setResult({
        resume:
          aiText.match(/RESUME:([\s\S]*?)COVER LETTER:/)?.[1]?.trim() || "",
        coverLetter:
          aiText.match(/COVER LETTER:([\s\S]*?)SKILLS:/)?.[1]?.trim() || "",
        skills: aiText.match(/SKILLS:([\s\S]*)/)?.[1]?.trim() || "",
      });
      setActiveTab("resume");
    } catch (error) {
      console.error("GEMINI ERROR:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const activeTabConfig = TABS.find((t) => t.id === activeTab);

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              AI Job Assistant
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Paste a job description and your resume — get tailored suggestions instantly
            </p>
          </div>
          <span className="hidden shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
            Powered by Gemini
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* ── Left: inputs (2 / 5 columns) ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Job description */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                  <HiBriefcase className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-semibold text-foreground">Job Description</span>
                {jobDescription && (
                  <span className="ml-auto text-xs text-muted-foreground/70">
                    {jobDescription.length} chars
                  </span>
                )}
              </div>
              <Textarea
                rows={7}
                placeholder="Paste the job description here…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="resize-none rounded-none border-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>

            {/* Resume text */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-900/30">
                  <HiDocumentText className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-sm font-semibold text-foreground">Your Resume</span>
                {resumeText && (
                  <span className="ml-auto text-xs text-muted-foreground/70">
                    {resumeText.length} chars
                  </span>
                )}
              </div>
              <Textarea
                rows={7}
                placeholder="Paste your resume text here…"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="resize-none rounded-none border-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>

            <Button
              className="gap-2 py-5 text-sm font-semibold"
              onClick={handleGenerator}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analysing…
                </>
              ) : (
                <>
                  <HiSparkles className="h-4 w-4" />
                  Generate Suggestions
                </>
              )}
            </Button>
          </div>

          {/* ── Right: tabbed results (3 / 5 columns) ── */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Tab bar */}
            <div className="flex gap-0 border-b border-border">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      isActive
                        ? `${tab.activeBorder} ${tab.accentClass}`
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Result panel */}
            <div className="flex-1 rounded-b-xl rounded-tr-xl border border-t-0 border-border bg-card p-5 min-h-[420px]">
              {isLoading ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">Generating your suggestions…</p>
                </div>
              ) : result ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-card-foreground">
                  {result[activeTab]}
                </p>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                  {activeTabConfig && (
                    <activeTabConfig.emptyIcon className="h-10 w-10 opacity-20" />
                  )}
                  <p className="text-sm">
                    Fill in the inputs on the left, then click{" "}
                    <span className="font-semibold text-foreground">Generate Suggestions</span>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Assistant;
