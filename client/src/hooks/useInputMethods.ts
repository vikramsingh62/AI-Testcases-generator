import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GoogleDocMetadata } from "@/lib/types";

export function useInputMethods() {
  const { toast } = useToast();
  
  // Text input state
  const [requirementsText, setRequirementsText] = useState("");
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Google Doc state
  const [googleDocUrl, setGoogleDocUrl] = useState("");
  const [isGoogleDocConnected, setIsGoogleDocConnected] = useState(false);
  const [googleDocData, setGoogleDocData] = useState<GoogleDocMetadata>({
    title: "",
    lastUpdated: "",
    preview: "",
  });
  
  // Handle text input changes
  const handleTextChange = (text: string) => {
    setRequirementsText(text);
  };
  
  // Handle file upload
  const handleFileUpload = (file: File | null) => {
    if (!file) {
      setUploadedFile(null);
      return;
    }
    
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file",
        variant: "destructive"
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return;
    }
    
    setUploadedFile(file);
    
    toast({
      title: "File uploaded",
      description: `Successfully uploaded ${file.name}`,
    });
  };
  
  // Handle file removal
  const handleFileRemove = () => {
    setUploadedFile(null);
  };
  
  // Handle Google Doc URL changes
  const handleGoogleDocUrlChange = (url: string) => {
    setGoogleDocUrl(url);
  };
  
  // Connect to Google Doc
  const connectGoogleDoc = async () => {
    if (!googleDocUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a Google Doc URL",
        variant: "destructive"
      });
      return;
    }
    
    // Validate Google Doc URL format
    const isValidUrl = googleDocUrl.match(/https:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    
    if (!isValidUrl) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Doc URL",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // In a real implementation, we would fetch document metadata here
      // For now, we'll just simulate a successful connection
      setIsGoogleDocConnected(true);
      setGoogleDocData({
        title: "Feature Requirements Document",
        lastUpdated: new Date().toLocaleDateString(),
        preview: "This document contains the requirements for the new feature..."
      });
      
      toast({
        title: "Connected",
        description: "Successfully connected to Google Doc",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Google Doc",
        variant: "destructive"
      });
    }
  };
  
  // Disconnect from Google Doc
  const disconnectGoogleDoc = () => {
    setIsGoogleDocConnected(false);
    setGoogleDocData({
      title: "",
      lastUpdated: "",
      preview: ""
    });
  };
  
  return {
    // Text input
    requirementsText,
    handleTextChange,
    
    // File upload
    uploadedFile,
    handleFileUpload,
    handleFileRemove,
    
    // Google Doc
    googleDocUrl,
    isGoogleDocConnected,
    googleDocData,
    handleGoogleDocUrlChange,
    connectGoogleDoc,
    disconnectGoogleDoc
  };
}
