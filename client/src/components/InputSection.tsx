import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GenerationOptions, InputType } from "@/lib/types";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

function FilePreview({ file, onRemove }: FilePreviewProps) {
  return (
    <div className="flex items-center p-3 bg-slate-50 rounded-md border border-slate-200">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 mr-2">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-700">{file.name}</p>
        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
      </div>
      <button 
        className="text-slate-400 hover:text-rose-500 transition-colors"
        onClick={onRemove}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}

interface GoogleDocPreviewProps {
  title: string;
  lastUpdated: string;
  preview: string;
  onDisconnect: () => void;
}

function GoogleDocPreview({ title, lastUpdated, preview, onDisconnect }: GoogleDocPreviewProps) {
  return (
    <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 mr-2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p className="text-sm font-medium text-slate-700">{title}</p>
        </div>
        <button 
          className="text-slate-400 hover:text-rose-500 transition-colors"
          onClick={onDisconnect}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <p className="text-xs text-slate-500 mb-2">Last updated: {lastUpdated}</p>
      <div className="text-sm text-slate-600 line-clamp-3">{preview}</div>
    </div>
  );
}

// Format file size to human-readable format
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface InputSectionProps {
  onGenerate: (inputType: InputType, data: any, options: GenerationOptions) => void;
  isGenerating: boolean;
}

export default function InputSection({ onGenerate, isGenerating }: InputSectionProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<InputType>("text");
  
  // Text input state
  const [requirementsText, setRequirementsText] = useState("");
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  
  // Google Doc state
  const [googleDocUrl, setGoogleDocUrl] = useState("");
  const [isGoogleDocConnected, setIsGoogleDocConnected] = useState(false);
  const [googleDocData, setGoogleDocData] = useState({
    title: "",
    lastUpdated: "",
    preview: ""
  });
  
  // Generation options state
  const [includeEdgeCases, setIncludeEdgeCases] = useState(true);
  const [includeNegativeTests, setIncludeNegativeTests] = useState(true);
  const [includePerformanceTests, setIncludePerformanceTests] = useState(false);
  const [outputFormat, setOutputFormat] = useState<"excel" | "csv">("excel");
  
  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const uploadedFile = acceptedFiles[0];
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(uploadedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file",
        variant: "destructive"
      });
      return;
    }
    
    if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return;
    }
    
    setFile(uploadedFile);
  }, [toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
  });
  
  // Google Doc connection handling
  const connectGoogleDoc = () => {
    if (!googleDocUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a Google Doc URL",
        variant: "destructive"
      });
      return;
    }
    
    // Check if URL is a valid Google Docs URL
    const isValidUrl = googleDocUrl.match(/https:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    
    if (!isValidUrl) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Doc URL",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, we would fetch document metadata
    // For now, we'll simulate connection
    setIsGoogleDocConnected(true);
    setGoogleDocData({
      title: "Feature Requirements Document",
      lastUpdated: new Date().toLocaleDateString(),
      preview: "This document contains the requirements for the new feature..."
    });
    
    toast({
      title: "Connected",
      description: "Successfully connected to Google Doc",
      variant: "default"
    });
  };
  
  // Handle generate button click
  const handleGenerate = () => {
    // Collect generation options
    const options: GenerationOptions = {
      includeEdgeCases,
      includeNegativeTests, 
      includePerformanceTests,
      outputFormat
    };
    
    // Determine input type and data
    switch (activeTab) {
      case "text":
        if (!requirementsText.trim()) {
          toast({
            title: "Input Required",
            description: "Please enter your requirements before generating",
            variant: "destructive"
          });
          return;
        }
        onGenerate("text", requirementsText, options);
        break;
        
      case "file":
        if (!file) {
          toast({
            title: "File Required",
            description: "Please upload a file before generating",
            variant: "destructive"
          });
          return;
        }
        onGenerate("file", file, options);
        break;
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Input Requirements</h3>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InputType)} className="mb-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="file">File Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <Textarea 
              className="w-full h-64 resize-none" 
              placeholder="Paste your feature requirements here. Each requirement should be on a new line or clearly separated."
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
            />
          </TabsContent>
          
          <TabsContent value="file">
            <div 
              {...getRootProps()} 
              className={`drop-zone w-full h-64 flex flex-col items-center justify-center rounded-md cursor-pointer border-2 border-dashed ${
                isDragActive ? "border-primary bg-primary/5" : "border-slate-300"
              }`}
            >
              <input {...getInputProps()} />
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-slate-600 mb-2">
                {isDragActive ? "Drop the file here..." : "Drag & drop your files here or click to browse"}
              </p>
              <p className="text-sm text-slate-500">Supported formats: PDF, DOC, DOCX</p>
            </div>
            
            {file && (
              <div className="mt-4">
                <FilePreview file={file} onRemove={() => setFile(null)} />
              </div>
            )}
          </TabsContent>
          

        </Tabs>
        
        <div className="mt-6 border-t border-slate-200 pt-6">
          <h4 className="font-medium text-slate-800 mb-3">Generation Options</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <Checkbox 
                id="include-edge-cases" 
                checked={includeEdgeCases}
                onCheckedChange={(checked) => setIncludeEdgeCases(checked as boolean)}
              />
              <Label htmlFor="include-edge-cases" className="ml-2 text-sm text-slate-700">
                Include edge cases
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="include-negative-tests" 
                checked={includeNegativeTests}
                onCheckedChange={(checked) => setIncludeNegativeTests(checked as boolean)}
              />
              <Label htmlFor="include-negative-tests" className="ml-2 text-sm text-slate-700">
                Include negative test scenarios
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="include-performance-tests" 
                checked={includePerformanceTests}
                onCheckedChange={(checked) => setIncludePerformanceTests(checked as boolean)}
              />
              <Label htmlFor="include-performance-tests" className="ml-2 text-sm text-slate-700">
                Include performance test considerations
              </Label>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="output-format" className="block text-sm font-medium text-slate-700 mb-1">
              Output Format
            </Label>
            <Select value={outputFormat} onValueChange={(value) => setOutputFormat(value as "excel" | "csv")}>
              <SelectTrigger id="output-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            className="w-full py-6 text-base"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
                Generate Test Cases
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
