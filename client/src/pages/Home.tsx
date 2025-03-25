import InputSection from "@/components/InputSection";
import PreviewSection from "@/components/PreviewSection";
import FeaturesSection from "@/components/FeaturesSection";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GenerationOptions, InputType, Requirement, TestCase } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { saveAs } from "file-saver";

export default function Home() {
  const { toast } = useToast();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("Analyzing requirements...");
  const [showPreview, setShowPreview] = useState(false);
  
  // Counts for test case types
  const positiveCount = testCases.filter(tc => tc.type === "positive").length;
  const negativeCount = testCases.filter(tc => tc.type === "negative").length;
  const edgeCaseCount = testCases.filter(tc => tc.type === "edge_case").length;
  
  const handleGeneration = async (
    inputType: InputType, 
    data: any, 
    options: GenerationOptions
  ) => {
    setLoading(true);
    setGenerationStatus("Analyzing requirements...");
    setShowPreview(false);
    
    try {
      let endpoint;
      let requestData;
      
      switch (inputType) {
        case "text":
          endpoint = "/api/analyze/text";
          requestData = { text: data, options };
          break;
        case "file":
          endpoint = "/api/analyze/file";
          // For file uploads, we need to use FormData
          const formData = new FormData();
          formData.append("file", data);
          formData.append("options", JSON.stringify(options));
          
          // Custom request for file upload
          const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          
          if (!response.ok) {
            throw new Error(`Failed to process file: ${response.statusText}`);
          }
          
          const result = await response.json();
          setRequirements(result.requirements);
          setTestCases(result.testCases);
          setLoading(false);
          setShowPreview(true);
          return;
        
        case "gdoc":
          endpoint = "/api/analyze/gdoc";
          requestData = { docUrl: data, options };
          break;
      }
      
      // For text and Google Doc, use the common API request function
      setGenerationStatus("Generating test cases...");
      const result = await apiRequest("POST", endpoint, requestData);
      const data_1 = await result.json();
      
      setRequirements(data_1.requirements);
      setTestCases(data_1.testCases);
      
      toast({
        title: "Test cases generated successfully",
        description: `Generated ${data_1.testCases.length} test cases from ${data_1.requirements.length} requirements`,
        variant: "default",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error generating test cases",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowPreview(true);
    }
  };
  
  const handleExport = async (format: 'excel' | 'csv', title: string = 'Test Cases') => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requirements,
          testCases,
          format,
          title,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = title + (format === 'excel' ? '.xlsx' : '.csv');
      
      if (contentDisposition) {
        const matches = /filename=([^;]+)/g.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = decodeURIComponent(matches[1].replace(/["']/g, ''));
        }
      }
      
      // Convert response to blob and save file
      const blob = await response.blob();
      saveAs(blob, filename);
      
      toast({
        title: "Export successful",
        description: `Test cases exported as ${format.toUpperCase()} file`,
        variant: "default",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  return (
    <main className="flex-1 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">
            AI-Powered Test Case Generator
          </h2>
          <p className="text-slate-600 max-w-3xl">
            Upload your feature requirements and our AI will generate comprehensive test cases covering all requirements and edge cases, exportable to Excel or CSV format.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputSection 
            onGenerate={handleGeneration} 
            isGenerating={loading} 
          />
          
          <PreviewSection 
            requirements={requirements}
            testCases={testCases}
            loading={loading}
            showPreview={showPreview}
            generationStatus={generationStatus}
            positiveCount={positiveCount}
            negativeCount={negativeCount}
            edgeCaseCount={edgeCaseCount}
            onExport={handleExport}
          />
        </div>
        
        <FeaturesSection />
      </div>
    </main>
  );
}
