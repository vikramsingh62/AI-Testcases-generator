import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GenerationOptions, InputType } from "@/lib/types";
import { FileText, X, Upload, Wand2, Zap, BarChart2 } from "lucide-react";

// Animated File Preview Component
function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200 shadow-sm transition-all hover:bg-slate-100"
    >
      <FileText className="text-slate-500 mr-3 size-5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">{file.name}</p>
        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
      </div>
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-slate-400 hover:text-rose-500 transition-colors group"
        onClick={onRemove}
        aria-label="Remove file"
      >
        <X className="size-5 group-hover:rotate-90 transition-transform" />
      </motion.button>
    </motion.div>
  );
}

// Format file size utility
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function InputSection({ onGenerate, isGenerating }: { 
  onGenerate: (inputType: InputType, data: any, options: GenerationOptions) => void;
  isGenerating: boolean;
}) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<InputType>("text");
  
  // State management
  const [requirementsText, setRequirementsText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  // Generation options state
  const [options, setOptions] = useState({
    includeEdgeCases: true,
    includeNegativeTests: true,
    includePerformanceTests: false,
    outputFormat: "excel" as "excel" | "csv"
  });

  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const uploadedFile = acceptedFiles[0];
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(uploadedFile.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOC, or DOCX file",
        variant: "destructive"
      });
      return;
    }
    
    if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Size Exceeded",
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
  
  // Handle generate button click
  const handleGenerate = () => {
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

  // Update option state
  const updateOption = (key: keyof typeof options, value: boolean | string) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle className="flex items-center text-xl text-slate-800">
              <Wand2 className="mr-3 text-primary" />
              Test Case Generation
            </CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as InputType)} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6 bg-slate-100">
              {["text", "file"].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white transition-colors"
                >
                  {tab === "text" ? "Text Input" : "File Upload"}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "text" ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "text" ? 50 : -50 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "text" ? (
                  <Textarea 
                    className="w-full h-64 resize-none border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all" 
                    placeholder="Paste your feature requirements here. Each requirement should be on a new line or clearly separated."
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                  />
                ) : (
                  <>
                    <motion.div 
                      {...getRootProps()}
                      whileHover={{ scale: 1.02 }}
                      className={`drop-zone w-full h-64 flex flex-col items-center justify-center rounded-lg cursor-pointer border-2 border-dashed transition-all ${
                        isDragActive 
                          ? "border-primary bg-primary/10 scale-105" 
                          : "border-slate-300 hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      >
                        <Upload className="text-slate-400 mb-4 size-12" />
                      </motion.div>
                      <p className="text-slate-600 mb-2 text-center">
                        {isDragActive 
                          ? "Drop the file here..." 
                          : "Drag & drop your files here or click to browse"}
                      </p>
                      <p className="text-sm text-slate-500">Supported formats: PDF, DOC, DOCX</p>
                    </motion.div>
                    
                    <AnimatePresence>
                      {file && (
                        <div className="mt-4">
                          <FilePreview file={file} onRemove={() => setFile(null)} />
                        </div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </Tabs>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 border-t border-slate-200 pt-6"
          >
            <h4 className="font-medium text-slate-800 mb-4 flex items-center">
              <Zap className="mr-2 text-primary" />
              Generation Options
            </h4>
            <div className="space-y-4">
              {[
                { 
                  id: "include-edge-cases", 
                  label: "Include edge cases", 
                  icon: <BarChart2 className="mr-2 text-slate-500" />,
                  checked: options.includeEdgeCases,
                  onCheckedChange: (checked: boolean) => updateOption('includeEdgeCases', checked)
                },
                { 
                  id: "include-negative-tests", 
                  label: "Include negative test scenarios", 
                  icon: <X className="mr-2 text-slate-500" />,
                  checked: options.includeNegativeTests,
                  onCheckedChange: (checked: boolean) => updateOption('includeNegativeTests', checked)
                },
                { 
                  id: "include-performance-tests", 
                  label: "Include performance test considerations", 
                  icon: <BarChart2 className="mr-2 text-slate-500" />,
                  checked: options.includePerformanceTests,
                  onCheckedChange: (checked: boolean) => updateOption('includePerformanceTests', checked)
                }
              ].map((option, index) => (
                <motion.div 
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  className="flex items-center space-x-2 hover:bg-slate-50 p-2 rounded-md transition-colors"
                >
                  {option.icon}
                  <Checkbox 
                    id={option.id} 
                    checked={option.checked}
                    onCheckedChange={option.onCheckedChange}
                  />
                  <Label htmlFor={option.id} className="text-sm text-slate-700 cursor-pointer">
                    {option.label}
                  </Label>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6"
            >
              <Label className="block text-sm font-medium text-slate-700 mb-2">
                Output Format
              </Label>
              <Select 
                value={options.outputFormat} 
                onValueChange={(value) => updateOption('outputFormat', value)}
              >
                <SelectTrigger className="w-full border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel" className="hover:bg-primary/10">
                    Excel (.xlsx)
                  </SelectItem>
                  <SelectItem value="csv" className="hover:bg-primary/10">
                    CSV
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6"
          >
            <Button 
              className="w-full py-6 text-base group"
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
                  <Wand2 className="mr-2 group-hover:rotate-12 transition-transform" />
                  Generate Test Cases
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}