import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Documentation() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
    
    // Create dots with random positions, colors, and speeds
    const dots = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#5A89FC', '#F9CE54', '#AC8AF8', '#FC5A8D'];
    
    for (let i = 0; i < 30; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1, // Semi-transparent dots
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15
      });
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw each dot and update its position
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y*2, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color + Math.floor(dot.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Move dot and wrap around edges
        dot.x += dot.speedX;
        dot.y += dot.speedY;
        
        if (dot.x < 0) dot.x = canvas.width;
        if (dot.x > canvas.width) dot.x = 0;
        if (dot.y < 0) dot.y = canvas.height;
        if (dot.y > canvas.height) dot.y = 0;
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, []);

  return (
    <main className="flex-1 min-h-screen bg-[#0E1527]">
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none"
        style={{ opacity: 0.8 }}
      />
      
      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Documentation
          </h1>
          <p className="text-xl text-gray-400">
            Learn how to use TestCase Generator effectively
          </p>
        </div>

        <Tabs defaultValue="getting-started" className="mb-12">
          <TabsList className="grid grid-cols-3 max-w-md mb-8 bg-[#1a2742] text-gray-400">
            <TabsTrigger value="getting-started" className="data-[state=active]:bg-[#2a3755] data-[state=active]:text-white">Getting Started</TabsTrigger>
            <TabsTrigger value="input-methods" className="data-[state=active]:bg-[#2a3755] data-[state=active]:text-white">Input Methods</TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-[#2a3755] data-[state=active]:text-white">Advanced Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started">
            <Card className="bg-[#1a2742] border-[#2a3755] shadow-xl">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Getting Started with TestCase Generator</h3>
                
                <div className="prose prose-invert max-w-none text-gray-300">
                  <p>
                    TestCase Generator is an AI-powered tool that helps you create comprehensive test cases from your requirements. Here's how to get started:
                  </p>
                  
                  <h4 className="text-gray-200">Step 1: Enter Your Requirements</h4>
                  <p>
                    Start by entering your requirements using one of three methods:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Type or paste your requirements directly into the text input</li>
                    <li>Upload a document file (PDF, DOC, or DOCX)</li>
                    <li>Link to a Google Doc containing your requirements</li>
                  </ul>
                  
                  <h4 className="text-gray-200">Step 2: Choose Generation Options</h4>
                  <p>
                    Customize your test case generation by selecting options:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Include edge cases (recommended)</li>
                    <li>Include negative test scenarios (recommended)</li>
                    <li>Include performance test considerations (optional)</li>
                    <li>Select your preferred output format (Excel or CSV)</li>
                  </ul>
                  
                  <h4 className="text-gray-200">Step 3: Generate & Review</h4>
                  <p>
                    Click the "Generate Test Cases" button and wait for the AI to analyze your requirements. Once complete, you'll see a preview of the identified requirements and generated test cases.
                  </p>
                  
                  <h4 className="text-gray-200">Step 4: Export</h4>
                  <p>
                    When you're satisfied with the generated test cases, click "Download Test Cases" to export them in your chosen format.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="input-methods">
            <Card className="bg-[#1a2742] border-[#2a3755] shadow-xl">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Input Methods</h3>
                
                <div className="prose prose-invert max-w-none text-gray-300">
                  <h4 className="text-gray-200">Text Input</h4>
                  <p>
                    Direct text input is the simplest method. Type or paste your requirements into the text box. For best results:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Place each requirement on a new line</li>
                    <li>Be clear and specific about each requirement</li>
                    <li>Use consistent formatting for similar types of requirements</li>
                  </ul>
                  
                  <h4 className="text-gray-200">File Upload</h4>
                  <p>
                    Upload a document containing your requirements. Supported formats:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>PDF (.pdf)</li>
                    <li>Microsoft Word (.doc, .docx)</li>
                  </ul>
                  <p>
                    For best results with file uploads:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use documents with clear headings and structure</li>
                    <li>Avoid complex formatting or tables</li>
                    <li>Keep file size under 10MB</li>
                  </ul>
                  
                  <h4 className="text-gray-200">Google Doc</h4>
                  <p>
                    Link directly to a Google Doc containing your requirements:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Enter the full URL of your Google Doc</li>
                    <li>Ensure the document has been shared with appropriate permissions (at least "Anyone with the link can view")</li>
                    <li>Click "Connect" to authorize and fetch the document content</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card className="bg-[#1a2742] border-[#2a3755] shadow-xl">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Advanced Options</h3>
                
                <div className="prose prose-invert max-w-none text-gray-300">
                  <h4 className="text-gray-200">Generation Options</h4>
                  <p>
                    Customize your test case generation with these advanced options:
                  </p>
                  
                  <h5 className="text-gray-200">Include Edge Cases</h5>
                  <p>
                    When enabled, the AI will generate test cases for boundary conditions and exceptional scenarios that might not be explicitly mentioned in your requirements. This helps catch potential issues at the extremes of your application's functionality.
                  </p>
                  
                  <h5 className="text-gray-200">Include Negative Tests</h5>
                  <p>
                    When enabled, the AI will generate test cases that verify your application behaves correctly when given invalid inputs or when operations fail. These test cases validate error handling and system robustness.
                  </p>
                  
                  <h5 className="text-gray-200">Include Performance Tests</h5>
                  <p>
                    When enabled, the AI will suggest performance-related test considerations for your requirements. These are not executable performance tests but rather guidelines for areas where performance testing might be valuable.
                  </p>
                  
                  <h4 className="text-gray-200">Output Format</h4>
                  <p>
                    Choose between two output formats:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong className="text-white">Excel (.xlsx)</strong> - Recommended for most users. Creates a multi-sheet document with the first sheet containing requirements and additional sheets for test cases, organized by requirement.
                    </li>
                    <li>
                      <strong className="text-white">CSV</strong> - A simpler format that's compatible with more tools. Creates a single CSV file with all test cases and their associated requirements.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-[#1a2742] border-[#2a3755] shadow-xl">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h4 className="font-medium text-gray-200 mb-2">How accurate is the AI-based test case generation?</h4>
                <p>
                  The AI generates test cases with approximately 90-95% accuracy for most common software features. The quality depends on the clarity and specificity of your requirements. While comprehensive, we recommend reviewing the generated test cases before implementation.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-200 mb-2">Is my data secure?</h4>
                <p>
                  Yes, we take data security seriously. Your requirements are processed securely, not stored permanently, and are never used to train our models. All connections are encrypted, and we adhere to strict privacy policies.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-200 mb-2">Can I customize the output format?</h4>
                <p>
                  Currently, we support Excel and CSV formats. The Excel format includes multiple sheets with requirements and test cases, while CSV is a simpler single-file format. Additional customization options will be available in future updates.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-200 mb-2">What types of requirements work best?</h4>
                <p>
                  The tool works best with functional requirements that clearly describe what the system should do. User stories, feature descriptions, and acceptance criteria all work well. Very technical or implementation-specific requirements may result in more generic test cases.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}