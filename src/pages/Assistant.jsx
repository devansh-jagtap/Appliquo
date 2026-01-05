import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold">AI Job Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Get AI help to improve your job applications
          </p>
        </header>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={6}
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Resume */}
        <Card>
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={6}
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
          {isLoading ? "Generating..." : "Generate Suggestions"}
        </Button>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resume Improvements</CardTitle>
                </CardHeader>
                <CardContent>
                  {!result ? (
                    <p className="text-sm text-muted-foreground">
                      Resume improvements will appear here.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {result.resume}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  {!result ? (
                    <p className="text-sm text-muted-foreground">
                      Cover letter draft will appear here.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {result.coverLetter}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skill Gap Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {!result ? (
                    <p className="text-sm text-muted-foreground">
                      Skill gap analysis will appear here.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {result.skills}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assistant;
