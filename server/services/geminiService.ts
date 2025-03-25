import { GoogleGenerativeAI } from "@google/generative-ai";
import { Requirement, TestCase, GenerationOptions } from "@shared/schema";

/**
 * Generate sample test cases for development without API key
 */
function generateSampleTestCases(
  requirements: Requirement[],
  options: GenerationOptions
): TestCase[] {
  const testCases: TestCase[] = [];
  let testCaseCounter = 1;
  
  // Process each requirement
  requirements.forEach(requirement => {
    // Always add a positive test case
    testCases.push({
      id: `TC${testCaseCounter++}`,
      description: `Verify that ${requirement.text.toLowerCase()}`,
      precondition: "System is properly configured and accessible",
      type: "positive",
      expectedResult: `The system successfully implements the requirement: ${requirement.text}`,
      priority: "high",
      requirement: requirement.id
    });
    
    // Add a negative test case if enabled
    if (options.includeNegativeTests) {
      testCases.push({
        id: `TC${testCaseCounter++}`,
        description: `Verify system behavior when invalid input is provided for: ${requirement.text.toLowerCase()}`,
        precondition: "System is in a state ready to accept inputs",
        type: "negative",
        expectedResult: "The system should handle the error gracefully and display an appropriate error message",
        priority: "medium",
        requirement: requirement.id
      });
    }
    
    // Add an edge case if enabled
    if (options.includeEdgeCases) {
      testCases.push({
        id: `TC${testCaseCounter++}`,
        description: `Test boundary conditions for: ${requirement.text.toLowerCase()}`,
        precondition: "System is at the limits of its specified operational parameters",
        type: "edge_case",
        expectedResult: "The system should handle edge cases properly without crashing",
        priority: "medium",
        requirement: requirement.id
      });
    }
    
    // Add a performance test if enabled
    if (options.includePerformanceTests) {
      testCases.push({
        id: `TC${testCaseCounter++}`,
        description: `Measure performance metrics when: ${requirement.text.toLowerCase()}`,
        precondition: "System is under expected load conditions",
        type: "performance",
        expectedResult: "The operation should complete within acceptable time limits",
        priority: "low",
        requirement: requirement.id
      });
    }
  });
  
  return testCases;
}

// Initialize the Google Generative AI client with API key
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (!apiKey) {
    throw new Error("Missing Gemini API key. Please set GEMINI_API_KEY environment variable.");
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Generate test cases using Gemini API
 */
export async function generateTestCases(
  requirements: Requirement[],
  options: GenerationOptions
): Promise<TestCase[]> {
  try {
    // Check if API key is available, if not use sample data
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
      console.log("Missing Gemini API key - Using demonstration content for development");
      return generateSampleTestCases(requirements, options);
    }
    
    const genAI = getGeminiClient();
    // Update to use the correct model version
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Format the requirements as a numbered list for the prompt
    const formattedRequirements = requirements
      .map(req => `${req.id}: ${req.text}`)
      .join("\n");
    
    // Build the prompt based on the options
    let prompt = `Generate comprehensive test cases for the following requirements:\n\n${formattedRequirements}\n\n`;
    
    // Add option-specific instructions
    prompt += "Include test cases that verify the basic functionality (positive test cases).\n";
    
    if (options.includeNegativeTests) {
      prompt += "Include negative test cases that verify error handling and validation.\n";
    }
    
    if (options.includeEdgeCases) {
      prompt += "Include edge cases that test boundary conditions and unusual scenarios.\n";
    }
    
    if (options.includePerformanceTests) {
      prompt += "Include performance test considerations.\n";
    }
    
    // Format instructions
    prompt += `
Format each test case as a JSON object with the following structure:
{
  "id": "TC1", // Test Case ID, should be unique
  "description": "Test case description",
  "precondition": "Conditions that must be true before test execution",
  "type": "positive", // One of: "positive", "negative", "edge_case", "performance"
  "expectedResult": "Expected result description",
  "priority": "high", // One of: "high", "medium", "low"
  "requirement": "R1" // The requirement ID this test case covers
}

Return test cases as a JSON array of test case objects.
`;

    // Generate the test cases
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON array from the text
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse test cases from Gemini response");
    }
    
    // Parse the JSON array
    const testCases: TestCase[] = JSON.parse(jsonMatch[0]);
    
    // Validate and clean up the test cases
    return testCases.map(testCase => ({
      id: testCase.id,
      description: testCase.description,
      precondition: testCase.precondition || "System is properly configured",
      type: testCase.type,
      expectedResult: testCase.expectedResult,
      priority: testCase.priority || "medium",
      requirement: testCase.requirement
    }));
  } catch (error) {
    console.error("Error generating test cases with Gemini:", error);
    
    // When API key is not available, use a structured approach to generate sample test cases
    if ((error as Error).message?.includes("Missing Gemini API key")) {
      console.log("Missing Gemini API key - Using demonstration content for development");
      // Generate some sample test cases covering the different types requested by the options
      return generateSampleTestCases(requirements, options);
    }
    
    throw new Error(`Failed to generate test cases: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
