import { apiRequest } from "./queryClient";
import { GenerationOptions, Requirement, TestCase } from "./types";

// Process text input for test case generation
export async function analyzeTextInput(text: string, options: GenerationOptions) {
  const response = await apiRequest("POST", "/api/analyze/text", {
    text,
    options
  });
  
  return response.json() as Promise<{
    requirements: Requirement[];
    testCases: TestCase[];
  }>;
}

// Connect to Google Doc and fetch contents
export async function analyzeGoogleDoc(docUrl: string, options: GenerationOptions) {
  const response = await apiRequest("POST", "/api/analyze/gdoc", {
    docUrl,
    options
  });
  
  return response.json() as Promise<{
    requirements: Requirement[];
    testCases: TestCase[];
  }>;
}

// Export test cases to specified format
export async function exportTestCases(
  requirements: Requirement[],
  testCases: TestCase[],
  format: "excel" | "csv",
  title: string = "Test Cases"
) {
  // This needs to be handled specially to download a file
  const response = await fetch("/api/export", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      requirements,
      testCases,
      format,
      title
    }),
    credentials: "include"
  });
  
  if (!response.ok) {
    throw new Error(`Export failed: ${response.statusText}`);
  }
  
  return response.blob();
}
