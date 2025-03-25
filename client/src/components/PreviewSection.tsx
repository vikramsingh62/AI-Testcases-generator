import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Requirement, TestCase } from "@/lib/types";

interface PreviewSectionProps {
  requirements: Requirement[];
  testCases: TestCase[];
  loading: boolean;
  showPreview: boolean;
  generationStatus: string;
  positiveCount: number;
  negativeCount: number;
  edgeCaseCount: number;
  onExport: (format: 'excel' | 'csv', title?: string) => void;
}

export default function PreviewSection({
  requirements,
  testCases,
  loading,
  showPreview,
  generationStatus,
  positiveCount,
  negativeCount,
  edgeCaseCount,
  onExport
}: PreviewSectionProps) {
  const [activeTab, setActiveTab] = useState("requirements");
  
  // Empty state - no preview available yet
  const renderEmptyState = () => (
    <div className="text-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-300 mb-4">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
      <h4 className="text-slate-600 font-medium mb-2">No Preview Available</h4>
      <p className="text-slate-500 text-sm max-w-sm mx-auto">
        Enter your requirements and click the generate button to see a preview of your test cases.
      </p>
    </div>
  );
  
  // Loading state while generating test cases
  const renderLoadingState = () => (
    <div className="text-center py-16">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <h4 className="text-slate-600 font-medium mt-4 mb-1">Generating Test Cases</h4>
      <p className="text-slate-500 text-sm max-w-sm mx-auto">{generationStatus}</p>
    </div>
  );
  
  // Requirements section with identified requirements
  const renderRequirementsPreview = () => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
        Identified Requirements
      </h4>
      <div className="border border-slate-200 rounded-md">
        {requirements.map((req) => (
          <div key={req.id} className="p-3 border-b border-slate-200 last:border-b-0">
            <div className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                {req.id}
              </span>
              <div>
                <p className="text-sm text-slate-700">{req.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Test cases section with table of generated test cases
  const renderTestCasesPreview = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          Test Case Preview
        </h4>
        <div className="text-xs text-slate-500">
          Total: <span className="font-medium">{testCases.length}</span> test cases
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Precondition</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Expected Result</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {testCases.map((testCase) => (
              <tr key={testCase.id}>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-700">{testCase.id}</td>
                <td className="px-3 py-2 text-xs text-slate-700">{testCase.description}</td>
                <td className="px-3 py-2 text-xs text-slate-700">{testCase.precondition}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    testCase.type === 'positive'
                      ? 'bg-green-100 text-green-800'
                      : testCase.type === 'negative'
                      ? 'bg-red-100 text-red-800'
                      : testCase.type === 'edge_case'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {testCase.type === 'positive'
                      ? 'Positive'
                      : testCase.type === 'negative'
                      ? 'Negative'
                      : testCase.type === 'edge_case'
                      ? 'Edge Case'
                      : 'Performance'}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-slate-700">{testCase.expectedResult}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    testCase.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : testCase.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-100 mr-1"></span>
            <span className="text-xs text-slate-600">Positive: <span>{positiveCount}</span></span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-100 mr-1"></span>
            <span className="text-xs text-slate-600">Negative: <span>{negativeCount}</span></span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-100 mr-1"></span>
            <span className="text-xs text-slate-600">Edge Cases: <span>{edgeCaseCount}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Preview content with tabs for requirements and test cases
  const renderPreviewContent = () => (
    <>
      <div className="mb-4 border-b border-slate-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border-b-0">
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeTab === "requirements" && renderRequirementsPreview()}
      {activeTab === "test-cases" && renderTestCasesPreview()}
      
      <div className="mt-6">
        <Button 
          className="w-full py-6 text-base"
          onClick={() => onExport("excel")}
          variant="secondary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Test Cases
        </Button>
      </div>
    </>
  );
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Preview</h3>
        
        {loading && renderLoadingState()}
        {!loading && !showPreview && renderEmptyState()}
        {!loading && showPreview && renderPreviewContent()}
      </CardContent>
    </Card>
  );
}
