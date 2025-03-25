import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <Link href="/about">
                  <a className="hover:text-white transition-colors">About Us</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-white mb-4">Contact</h5>
            <p className="text-sm mb-2">Vikram Singh</p>
            <p className="text-sm mb-4">
              <a href="mailto:vikram.singh.qa@bluestacks.com" className="hover:text-white transition-colors">
                vikram.singh.qa@bluestacks.com
              </a>
            </p>
            <p className="text-sm">©2023 TestCase Generator</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
