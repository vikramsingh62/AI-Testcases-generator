import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Info, 
  Layers, 
  Zap 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Background Balls Component
const BackgroundBalls = () => {
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    const colors = [
      'rgba(255, 75, 75, 0.5)',    // Soft red
      'rgba(75, 75, 255, 0.5)',    // Soft blue
      'rgba(255, 75, 255, 0.5)',   // Soft magenta
      'rgba(75, 255, 75, 0.5)',    // Soft green
      'rgba(255, 255, 75, 0.5)',   // Soft yellow
      'rgba(75, 255, 255, 0.5)'    // Soft cyan
    ];

    const generateBalls = () => {
      const newBalls = [];
      const ballCount = 25; // Increased number of balls

      // Distribute balls across entire width
      for (let i = 0; i < ballCount; i++) {
        newBalls.push({
          id: `ball-${i}`,
          x: Math.random() * 100, // Spread across full width
          y: Math.random() * 100,
          size: Math.random() * 100 + 50, // 50-150 pixels
          color: colors[Math.floor(Math.random() * colors.length)],
          animationDelay: Math.random() * 2
        });
      }

      setBalls(newBalls);
    };

    generateBalls();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {balls.map((ball) => (
        <motion.div
          key={ball.id}
          initial={{ 
            scale: 0, 
            x: `${ball.x}%`, 
            y: `${ball.y}%`
          }}
          animate={{ 
            scale: [0, 1, 0.8, 1],
            rotate: 360,
            transition: {
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: ball.animationDelay
            }
          }}
          style={{
            position: 'absolute',
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            borderRadius: '50%',
            backgroundColor: ball.color,
            filter: 'blur(60px)'
          }}
        />
      ))}
    </div>
  );
};

// Logo Component (unchanged)
const Logo = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={`w-10 h-10 ${className}`}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#6a11cb', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#2575fc', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="url(#logoGradient)" 
        opacity="0.2"
      />
      
      <path 
        d="M40 30 L60 30 L57 70 Q55 75 50 75 Q45 75 43 70 Z" 
        fill="url(#logoGradient)"
      />
      
      <circle 
        cx="50" 
        cy="35" 
        r="6" 
        fill="#ffffff" 
        opacity="0.8"
      />
      
      <path 
        d="M45 32 Q50 28 55 32" 
        stroke="#ffffff" 
        strokeWidth="2" 
        fill="none" 
        opacity="0.5"
      />
    </svg>
  );
};

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      href: "/docs", 
      label: "Docs", 
      icon: <BookOpen className="mr-2 h-5 w-5" />,
      activeClass: location === "/docs" 
        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
        : "text-slate-300 hover:bg-gradient-to-r hover:from-purple-800 hover:to-pink-800"
    },
    { 
      href: "/about", 
      label: "About", 
      icon: <Info className="mr-2 h-5 w-5" />,
      activeClass: location === "/about" 
        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" 
        : "text-slate-300 hover:bg-gradient-to-r hover:from-blue-800 hover:to-cyan-800"
    }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="relative bg-[#0F172A] shadow-lg sticky top-0 z-50 transition-all duration-500 ease-in-out">
      <BackgroundBalls />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative z-10">
        {/* Logo Section */}
        <div className="flex items-center">
          <Logo 
            className="mr-2 cursor-pointer hover:scale-110 transition-transform"
          />
          <Link href="/">
            <motion.h1 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-slate-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 cursor-pointer transition-all"
            >
              TestCase Generator
            </motion.h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  className={`${item.activeClass} flex items-center transition-all duration-300 ease-in-out`}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <motion.div
            whileHover={{ rotate: 360 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <Layers /> : <Zap />}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#0F172A]/95 z-40 md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="lg"
                      className={`${item.activeClass} w-64 flex items-center justify-center`}
                      onClick={toggleMobileMenu}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}