import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: generatePrompt(jobDescription, resumeText),
              },
            ],
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      const aiText = data.choices[0].message.content;
      const parsed = JSON.parse(aiText);

      setResult(parsed);
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI response.");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePrompt = (jobDescription, resumeText) => {
    return `
You are a professional career coach.

Job Description:
${jobDescription}

Resume:
${resumeText}

Tasks:
1. Suggest resume improvements (bullet points).
2. Write a short tailored cover letter.
3. Identify missing or weak skills.

Return the response in this JSON format:
{
  "resume": "...",
  "coverLetter": "...",
  "skills": "..."
}
`;
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

        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              rows={6}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={6}
            />
          </CardContent>
        </Card>

        <Button
          className="w-full"
          onClick={handleGenerator}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Suggestions"}
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Resume Improvements */}
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
                    <p className="text-sm text-muted-foreground">
                      {result.resume}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Cover Letter */}
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
                    <p className="text-sm text-muted-foreground">
                      {result.coverLetter}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Skill Gap Analysis */}
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
                    <p className="text-sm text-muted-foreground">
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
