import { GoogleGenerativeAI } from "@google/generative-ai";

// IMPORTANT SECURITY WARNING: 
// NEVER expose your actual API key in production code or public repositories
const GEMINI_API_KEY = 'AIzaSyBhvlo-L1QhgtS65SePh1XShTLFc-RyfoE';

export interface Requirement {
  id: string;
  text: string;
}

export interface GenerationOptions {
  includeNegativeTests: boolean;
  includeEdgeCases: boolean;
  includePerformanceTests: boolean;
}

export interface TestCase {
  id: string;
  description: string;
  precondition: string;
  type: 'positive' | 'negative' | 'edge_case' | 'performance';
  expectedResult: string;
  priority: 'high' | 'medium' | 'low';
  requirement: string;
}

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
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key.");
  }
  return new GoogleGenerativeAI(GEMINI_API_KEY);
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
    if (!GEMINI_API_KEY) {
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
    prompt += "Generate a diverse set of test cases that thoroughly cover the requirements.\n";
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
Provide test cases in a strict JSON array format with each test case having these properties and try to generate as much test cases you can with the given requiremnts:
- id: Unique test case identifier (string)
- description: Detailed test case description (string)
- precondition: Setup conditions before test (string)
- type: Test case type ("positive", "negative", "edge_case", or "performance")
- expectedResult: What should happen when the test is run (string)
- priority: Importance of the test ("high", "medium", or "low")
- requirement: ID of the requirement this test case covers (string)

Return ONLY a valid JSON array of test case objects.
`;
    
    // Generate the test cases
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON array from the text
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn("Failed to match JSON array in Gemini response, using fallback generation");
      return generateSampleTestCases(requirements, options);
    }
    
    try {
      // Try to parse the JSON array
      const jsonText = jsonMatch[0];
      
      // Additional cleaning to handle common JSON errors
      const cleanedJson = jsonText
        .replace(/,\s*\}/g, '}')  // Remove trailing commas in objects
        .replace(/,\s*\]/g, ']')  // Remove trailing commas in arrays
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":') // Ensure property names are double-quoted
        .replace(/:\s*'([^']*)'/g, ':"$1"'); // Replace single quotes with double quotes for string values
        
      const testCases: TestCase[] = JSON.parse(cleanedJson);
      
      // Validate and clean up the test cases
      return testCases.map(testCase => ({
        id: testCase.id || `TC${Math.floor(Math.random() * 1000)}`,
        description: testCase.description,
        precondition: testCase.precondition || "System is properly configured",
        type: testCase.type || "positive",
        expectedResult: testCase.expectedResult,
        priority: testCase.priority || "medium",
        requirement: testCase.requirement
      }));
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini response:", parseError);
      // Fallback to sample generation
      return generateSampleTestCases(requirements, options);
    }
  } catch (error) {
    console.error("Error generating test cases with Gemini:", error);
    throw new Error(`Failed to generate test cases: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Example usage function
export async function runTestCaseGeneration() {
  const requirements: Requirement[] = [
    { id: 'R1', text: 'User should be able to log in with valid credentials' },
    { id: 'R2', text: 'System must validate input fields before submission' }
  ];

  const options: GenerationOptions = {
    includeNegativeTests: true,
    includeEdgeCases: true,
    includePerformanceTests: false
  };

  try {
    const testCases = await generateTestCases(requirements, options);
    console.log("Generated Test Cases:", testCases);
    return testCases;
  } catch (error) {
    console.error("Test Case Generation Failed:", error);
  }
}

// Uncomment to run directly
// runTestCaseGeneration();