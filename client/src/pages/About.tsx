import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <main className="flex-1 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
            About TestCase Generator
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-slate-500 sm:mt-4">
            An AI-powered tool to streamline your test case creation process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                TestCase Generator was developed to help software teams save valuable time in creating comprehensive test cases. By leveraging advanced AI technology, we analyze requirements and automatically generate test cases that cover all aspects of your software functionality, including edge cases and negative scenarios.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Our tool uses Google's Gemini AI to understand requirements from various input formats, extract meaningful testing criteria, and generate well-structured test cases. The AI has been trained on thousands of software testing examples to ensure high-quality output that follows industry best practices.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">Why Choose TestCase Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                    <path d="M12 2v2" />
                    <path d="M12 22v-2" />
                    <path d="m17 20.66-1-1.73" />
                    <path d="M11 10.27 7 3.34" />
                    <path d="m20.66 17-1.73-1" />
                    <path d="m3.34 7 1.73 1" />
                    <path d="M22 12h-2" />
                    <path d="M2 12h2" />
                    <path d="m20.66 7-1.73 1" />
                    <path d="m3.34 17 1.73-1" />
                    <path d="m17 3.34-1 1.73" />
                    <path d="m7 20.66 1-1.73" />
                  </svg>
                </div>
                <h4 className="font-medium text-slate-800">Time Efficiency</h4>
              </div>
              <p className="text-slate-600 text-sm">Reduce test case creation time by up to 80%. What normally takes hours can be accomplished in minutes.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <h4 className="font-medium text-slate-800">Comprehensive Coverage</h4>
              </div>
              <p className="text-slate-600 text-sm">Our AI identifies edge cases and negative scenarios that human testers might overlook, leading to more robust testing.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <h4 className="font-medium text-slate-800">Quality Assurance</h4>
              </div>
              <p className="text-slate-600 text-sm">Standardized and consistent test cases follow industry best practices, improving your QA process and reducing bugs in production.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">Contact Us</h2>
          <p className="text-slate-600 text-center mb-6">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="flex justify-center">
            <a 
              href="mailto:contact@testcasegenerator.com" 
              className="px-5 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
