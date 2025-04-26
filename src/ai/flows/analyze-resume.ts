// This file is machine-generated - changes may be lost.
'use server';
/**
 * @fileOverview An AI agent that analyzes a resume and provides feedback.
 *
 * - analyzeResume - A function that handles the resume analysis process.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume document (PDF or DOCX format) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  analysis: z.object({
    summary: z.string().describe('A summary of the resume.'),
    skills: z.array(z.string()).describe('A list of skills identified in the resume.'),
    experience: z.string().describe('A summary of the work experience.'),
    education: z.string().describe('A summary of the education section.'),
    feedback: z.string().describe('Feedback on areas for improvement in wording and formatting.'),
  }),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {
    schema: z.object({
      resumeDataUri: z
        .string()
        .describe(
          "The resume document (PDF or DOCX format) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    schema: z.object({
      analysis: z.object({
        summary: z.string().describe('A summary of the resume.'),
        skills: z.array(z.string()).describe('A list of skills identified in the resume.'),
        experience: z.string().describe('A summary of the work experience.'),
        education: z.string().describe('A summary of the education section.'),
        feedback: z.string().describe('Feedback on areas for improvement in wording and formatting.'),
      }),
    }),
  },
  prompt: `You are a resume expert. Analyze the uploaded resume and provide feedback.

Analyze the resume and extract key information such as skills, experience, and education.
Highlight possible areas of improvement in wording and formatting. Act as a helpful tool providing resume-writing suggestions.

Resume:
{{media url=resumeDataUri}}`,
});

const analyzeResumeFlow = ai.defineFlow<
  typeof AnalyzeResumeInputSchema,
  typeof AnalyzeResumeOutputSchema
>(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
