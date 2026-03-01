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
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <HiSparkles className="h-7 w-7 text-primary" />
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
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HiBriefcase className="h-5 w-5 text-primary" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={8}
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Resume */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HiDocumentText className="h-5 w-5 text-primary" />
                  Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={8}
                  placeholder="Paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              className="w-full"
              onClick={handleGenerator}
              disabled={isLoading}
            >
              <HiSparkles className="mr-2 h-5 w-5" />
              {isLoading ? "Generating..." : "Generate AI Suggestions"}
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Resume Improvements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HiDocumentText className="h-5 w-5 text-primary" />
                  Resume Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <p className="text-sm text-muted-foreground">
                    Resume improvements will appear here after generation.
                  </p>
                ) : (
                  <p className="whitespace-pre-line text-sm text-card-foreground">
                    {result.resume}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HiPencil className="h-5 w-5 text-primary" />
                  Cover Letter Draft
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <p className="text-sm text-muted-foreground">
                    A tailored cover letter will appear here after generation.
                  </p>
                ) : (
                  <p className="whitespace-pre-line text-sm text-card-foreground">
                    {result.coverLetter}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Skill Gap Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HiChartBar className="h-5 w-5 text-primary" />
                  Skill Gap Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <p className="text-sm text-muted-foreground">
                    Missing skills analysis will appear here after generation.
                  </p>
                ) : (
                  <p className="whitespace-pre-line text-sm text-card-foreground">
                    {result.skills}
                  </p>
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
