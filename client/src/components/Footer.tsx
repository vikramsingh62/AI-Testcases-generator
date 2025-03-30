import React, { useState, useRef, useEffect } from 'react';
import { Link } from "wouter";
import { motion } from "framer-motion";

const BackgroundBalls = ({ activeSection, hoverPosition }) => {
  const ballCount = 50;
  const containerRef = useRef(null);
  
  const generateRandomBalls = (width, height) => {
    return Array.from({ length: ballCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      scale: Math.random() * 0.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.3,
      blur: Math.random() * 5,
      color: `hsla(${Math.random() * 360}, 70%, 60%, 0.6)`
    }));
  };

  const [balls, setBalls] = useState([]);

  useEffect(() => {
    const updateBalls = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setBalls(generateRandomBalls(width, height));
      }
    };

    updateBalls();
    window.addEventListener('resize', updateBalls);
    return () => window.removeEventListener('resize', updateBalls);
  }, []);

  const getBallVariants = () => {
    if (hoverPosition) {
      return balls.map((ball) => {
        // Calculate distance from hover position
        const dx = hoverPosition.x - ball.x;
        const dy = hoverPosition.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Balls closer to hover point get pulled in more strongly
        const pullFactor = Math.max(0, 1 - distance / 300);
        
        return {
          x: ball.x + dx * pullFactor * 0.8,
          y: ball.y + dy * pullFactor * 0.8,
          scale: ball.scale * (1 + pullFactor * 0.5),
          opacity: Math.min(1, ball.opacity * (1 + pullFactor)),
          transition: { 
            type: "spring", 
            stiffness: 100, 
            damping: 20 
          }
        };
      });
    }

    // Default state
    return balls.map(ball => ({
      x: ball.x,
      y: ball.y,
      scale: ball.scale,
      opacity: ball.opacity,
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 20 
      }
    }));
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {balls.map((ball, index) => (
        <motion.div
          key={index}
          initial={{
            x: ball.x,
            y: ball.y,
            scale: ball.scale,
            opacity: ball.opacity
          }}
          animate={getBallVariants()[index]}
          className="absolute w-4 h-4 rounded-full"
          style={{
            background: ball.color,
            filter: `blur(${ball.blur}px)`
          }}
        />
      ))}
    </div>
  );
};

export default function Footer() {
  const [hoverPosition, setHoverPosition] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setActiveSection(null);
  };

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-[#0F172A] text-slate-300 mt-16 py-8 overflow-hidden"
    >
      <BackgroundBalls 
        activeSection={activeSection} 
        hoverPosition={hoverPosition} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            onHoverStart={() => setActiveSection('testcase')}
            onHoverEnd={() => setActiveSection(null)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative p-4 rounded-lg group"
          >
            <h5 className="font-bold text-white mb-4 text-xl relative z-10">
              TestCase Generator
            </h5>
            <p className="text-sm text-slate-400 relative z-10">
              AI-powered test case generation tool that saves time and improves test coverage for software development teams.
            </p>
          </motion.div>
          
          <motion.div
            onHoverStart={() => setActiveSection('resources')}
            onHoverEnd={() => setActiveSection(null)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative p-4 rounded-lg group"
          >
            <h5 className="font-bold text-white mb-4 text-xl relative z-10">Resources</h5>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/docs", label: "Documentation" },
                { href: "/about", label: "About Us" }
              ].map((item) => (
                <motion.li
                  key={item.href}
                  whileHover={{ 
                    x: 10, 
                    color: "#ffffff",
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  <Link href={item.href}>
                    <a className="text-slate-400 hover:text-white transition-colors relative inline-block">
                      <motion.span
                        className="absolute -left-4 opacity-0 text-blue-500"
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                      >
                        →
                      </motion.span>
                      {item.label}
                    </a>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            onHoverStart={() => setActiveSection('contact')}
            onHoverEnd={() => setActiveSection(null)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative p-4 rounded-lg group"
          >
            <h5 className="font-bold text-white mb-4 text-xl relative z-10">Contact</h5>
            <p className="text-sm mb-2 text-slate-400 relative z-10">Vikram Singh</p>
            <p className="text-sm mb-4 relative z-10">
              <a 
                href="mailto:vikram.singh.qa@bluestacks.com" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                vikram.singh.qa@bluestacks.com
              </a>
            </p>
            <p className="text-sm text-slate-500 relative z-10">©2023 TestCase Generator</p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}