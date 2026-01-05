import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Layout from "@/components/Layout";
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
        }
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <HiSparkles className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Job Assistant
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Get AI-powered suggestions to improve your applications
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Job Description */}
            <Card className="border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <HiBriefcase className="h-5 w-5 text-blue-600" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={8}
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </CardContent>
            </Card>

            {/* Resume */}
            <Card className="border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <HiDocumentText className="h-5 w-5 text-blue-600" />
                  Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={8}
                  placeholder="Paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
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
            <Card className="border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <HiDocumentText className="h-5 w-5 text-blue-600" />
                  Resume Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Resume improvements will appear here after generation.
                  </p>
                ) : (
                  <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
                    {result.resume}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card className="border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <HiPencil className="h-5 w-5 text-blue-600" />
                  Cover Letter Draft
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    A tailored cover letter will appear here after generation.
                  </p>
                ) : (
                  <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
                    {result.coverLetter}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Skill Gap Analysis */}
            <Card className="border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <HiChartBar className="h-5 w-5 text-blue-600" />
                  Skill Gap Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Missing skills analysis will appear here after generation.
                  </p>
                ) : (
                  <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
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
