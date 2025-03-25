export type InputType = "text" | "file" | "gdoc";

export interface Requirement {
  id: string;
  text: string;
}

export interface TestCase {
  id: string;
  description: string;
  precondition: string;
  type: "positive" | "negative" | "edge_case" | "performance";
  expectedResult: string;
  priority: "high" | "medium" | "low";
  requirement: string;
}

export interface GenerationOptions {
  includeEdgeCases: boolean;
  includeNegativeTests: boolean;
  includePerformanceTests: boolean;
  outputFormat: "excel" | "csv";
}

export interface GoogleDocMetadata {
  title: string;
  lastUpdated: string;
  preview: string;
}
