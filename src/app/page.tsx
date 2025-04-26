"use client";

import { useState } from 'react';
import { analyzeResume } from '@/ai/flows/analyze-resume';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [resumeDataUri, setResumeDataUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      setResumeDataUri(dataUri);
      setAnalysisResult(null); // Clear previous results
      setError(null); // Clear any previous errors
    };
    reader.onerror = () => {
      setError("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeResume = async () => {
    if (!resumeDataUri) {
      setError("Please upload a resume first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeResume({ resumeDataUri });
      setAnalysisResult(result);
    } catch (e: any) {
      setError(`Failed to analyze resume: ${e.message || "Unknown error"}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Resume Ace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-2">
            <label htmlFor="resume-upload" className="text-sm font-medium">
              Upload Resume (PDF or DOCX):
            </label>
            <div className="flex items-center space-x-2">
              <Input
                id="resume-upload"
                type="file"
                accept=".pdf, .docx"
                onChange={handleFileUpload}
                disabled={isAnalyzing}
              />
              <Button variant="secondary" size="sm" onClick={handleAnalyzeResume} disabled={isAnalyzing || !resumeDataUri}>
                {isAnalyzing ? (
                  <>
                    Analyzing...
                    <span className="animate-spin ml-2 h-4 w-4 rounded-full border-2 border-primary border-t-transparent"></span>
                  </>
                ) : (
                  <>
                    Analyze
                    <Upload className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {analysisResult && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Analysis Results</h2>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Summary</h3>
                <Textarea className="bg-muted" readOnly value={analysisResult.analysis.summary} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Skills</h3>
                <Textarea className="bg-muted" readOnly value={analysisResult.analysis.skills.join(', ')} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Experience</h3>
                <Textarea className="bg-muted" readOnly value={analysisResult.analysis.experience} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Education</h3>
                <Textarea className="bg-muted" readOnly value={analysisResult.analysis.education} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Feedback</h3>
                <Textarea className="bg-muted" readOnly value={analysisResult.analysis.feedback} />
              </div>
            </div>
          )}

          {isAnalyzing && !analysisResult && !error && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Analyzing Resume...</h2>
              <p>Please wait while the AI analyzes your resume.</p>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Summary</h3>
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Skills</h3>
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Experience</h3>
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Education</h3>
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Feedback</h3>
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
