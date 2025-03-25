import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-medium text-white mb-4">TestCase Generator</h5>
            <p className="text-sm">AI-powered test case generation tool that saves time and improves test coverage for software development teams.</p>
          </div>
          <div>
            <h5 className="font-medium text-white mb-4">Resources</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs">
                  <a className="hover:text-white transition-colors">Documentation</a>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">API Reference</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Examples</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-white mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <a className="hover:text-white transition-colors">About Us</a>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-white mb-4">Connect</h5>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
            <p className="text-sm">©2023 TestCase Generator</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
