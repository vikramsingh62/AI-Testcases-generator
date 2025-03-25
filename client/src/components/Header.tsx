import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <Link href="/">
            <h1 className="text-xl font-semibold text-slate-800 cursor-pointer">TestCase Generator</h1>
          </Link>
        </div>
        <nav>
          <Link href="/docs">
            <Button variant="ghost" className={
              location === "/docs" ? "text-primary" : "text-slate-600 hover:text-primary"
            }>
              Docs
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className={
              location === "/about" ? "text-primary" : "text-slate-600 hover:text-primary"
            }>
              About
            </Button>
          </Link>
          <Button variant="default" className="ml-4">
            Sign In
          </Button>
        </nav>
      </div>
    </header>
  );
}
