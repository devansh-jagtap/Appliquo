import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const Assistant = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

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
    } catch (error) {
      console.error("GEMINI ERROR:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border border-primary/10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 shadow-inner">
              <HiSparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                AI Job Assistant
              </h1>
              <p className="mt-1 text-muted-foreground">
                Get AI-powered suggestions to improve your applications
              </p>
            </div>
          </div>
          {/* Steps */}
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { num: "1", label: "Paste job description" },
              { num: "2", label: "Paste your resume" },
              { num: "3", label: "Get AI suggestions" },
            ].map((step) => (
              <div key={step.num} className="flex items-center gap-2 rounded-full bg-background/60 px-3 py-1.5 text-xs font-medium border border-border shadow-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {step.num}
                </span>
                {step.label}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Input */}
          <div className="space-y-5">
            {/* Job Description */}
            <Card className="overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                    <HiBriefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={8}
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="resize-none text-sm"
                />
                {jobDescription && (
                  <p className="mt-1.5 text-right text-xs text-muted-foreground">
                    {jobDescription.length} chars
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Resume */}
            <Card className="overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-900/30">
                    <HiDocumentText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={8}
                  placeholder="Paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="resize-none text-sm"
                />
                {resumeText && (
                  <p className="mt-1.5 text-right text-xs text-muted-foreground">
                    {resumeText.length} chars
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              className="w-full gap-2 py-6 text-base font-semibold"
              onClick={handleGenerator}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating suggestions…
                </>
              ) : (
                <>
                  <HiSparkles className="h-5 w-5" />
                  Generate AI Suggestions
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-5">
            {/* Resume Improvements */}
            <Card className="overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
                    <HiDocumentText className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  Resume Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-border py-8 text-center text-muted-foreground">
                    <HiDocumentText className="mb-2 h-8 w-8 opacity-30" />
                    <p className="text-sm">Improvements will appear here after generation.</p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-green-50 dark:bg-green-900/10 p-3">
                    <p className="whitespace-pre-line text-sm text-card-foreground leading-relaxed">
                      {result.resume}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card className="overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                    <HiPencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Cover Letter Draft
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-border py-8 text-center text-muted-foreground">
                    <HiPencil className="mb-2 h-8 w-8 opacity-30" />
                    <p className="text-sm">A tailored cover letter will appear here after generation.</p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/10 p-3">
                    <p className="whitespace-pre-line text-sm text-card-foreground leading-relaxed">
                      {result.coverLetter}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skill Gap Analysis */}
            <Card className="overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900/30">
                    <HiChartBar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  Skill Gap Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-border py-8 text-center text-muted-foreground">
                    <HiChartBar className="mb-2 h-8 w-8 opacity-30" />
                    <p className="text-sm">Missing skills analysis will appear here after generation.</p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-900/10 p-3">
                    <p className="whitespace-pre-line text-sm text-card-foreground leading-relaxed">
                      {result.skills}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Assistant;
