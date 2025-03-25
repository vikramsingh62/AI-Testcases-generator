export default function FeaturesSection() {
  return (
    <section className="mt-16">
      <h3 className="text-xl font-semibold text-slate-800 mb-6 text-center">Key Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
                <path d="M3 9h6" />
                <path d="M3 15h6" />
                <path d="M15 3v18" />
                <path d="M15 9h6" />
                <path d="M15 15h6" />
              </svg>
            </div>
            <h4 className="font-medium text-slate-800">Multiple Input Methods</h4>
          </div>
          <p className="text-slate-600 text-sm">Upload requirements via direct text input, file upload (PDF, DOC, DOCX), or Google Doc integration.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="3" />
                <path d="M13.41 10.59a3 3 0 1 0 0 4.24" />
                <path d="M16.95 7.05a7 7 0 1 0 0 9.9" />
                <path d="M20.5 3.5a10.93 10.93 0 0 0-17 14" />
                <path d="M3.5 20.5a10.93 10.93 0 0 0 17-14" />
              </svg>
            </div>
            <h4 className="font-medium text-slate-800">AI-Powered Generation</h4>
          </div>
          <p className="text-slate-600 text-sm">Gemini AI analyzes requirements to generate comprehensive test cases covering positive scenarios, negative scenarios, and edge cases.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M8 3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
                <path d="M8 3v4a2 2 0 1 0 4 0V3" />
                <line x1="6" y1="9" x2="18" y2="9" />
                <line x1="6" y1="13" x2="18" y2="13" />
                <line x1="6" y1="17" x2="18" y2="17" />
              </svg>
            </div>
            <h4 className="font-medium text-slate-800">Structured Output</h4>
          </div>
          <p className="text-slate-600 text-sm">Export test cases in Excel or CSV format with organized sheets for requirements and corresponding test cases.</p>
        </div>
      </div>
    </section>
  );
}
