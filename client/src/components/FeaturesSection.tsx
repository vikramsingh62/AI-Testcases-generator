import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FloatingBalls = ({ containerRef, isHovered }) => { // Added isHovered prop
    const ballCount = 10;
    const [balls, setBalls] = useState([]);

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
        return balls.map(ball => {
            let targetScale = ball.scale;
            let targetOpacity = ball.opacity;

             if (isHovered) {
                targetScale = ball.scale * 1.5;
                targetOpacity = Math.min(1, ball.opacity * 1.2);
            }

            return {
                x: ball.x,
                y: ball.y,
                scale: targetScale,
                opacity: targetOpacity,
                transition: {
                    type: "spring",
                    stiffness: 50,
                    damping: 20,
                    duration: 0.2
                }
            };
        });
    };

    return (
        <>
            {balls.map((ball, index) => (
                <motion.div
                    key={index}
                    initial={{
                        x: ball.x,
                        y: ball.y,
                        scale: ball.scale,
                        opacity: ball.opacity,
                    }}
                    animate={getBallVariants()[index]}
                    transition={{
                        type: "spring",
                        stiffness: 50,
                        damping: 20,
                        //duration: 2  Removed the hardcoded duration.  Handled in getBallVariants
                    }}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                        background: ball.color,
                        filter: `blur(${ball.blur}px)`,
                        pointerEvents: 'none'
                    }}
                />
            ))}
        </>
    );
};

export default function FeaturesSection() {
    // Refs for each card to attach animation
    const cardRefs = [useRef(null), useRef(null), useRef(null)];
    const [hoveredIndex, setHoveredIndex] = useState(null);  // Track which card is hovered

    return (
        <section className="mt-16">
            <h3 className="text-xl font-semibold text-gray-200 mb-6 text-center">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M9 3v18" />
                                <path d="M3 9h6" />
                                <path d="M3 15h6" />
                                <path d="M15 3v18" />
                                <path d="M15 9h6" />
                                <path d="M15 15h6" />
                            </svg>
                        ),
                        title: "Multiple Input Methods",
                        description: "Upload requirements via direct text input, file upload (PDF, DOC, DOCX), or Google Doc integration.",
                        dotColors: ["#8a8fff", "#9651cf", "#5c61c0"]
                    },
                    {
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M13.41 10.59a3 3 0 1 0 0 4.24" />
                                <path d="M16.95 7.05a7 7 0 1 0 0 9.9" />
                                <path d="M20.5 3.5a10.93 10.93 0 0 0-17 14" />
                                <path d="M3.5 20.5a10.93 10.93 0 0 0 17-14" />
                            </svg>
                        ),
                        title: "AI-Powered Generation",
                        description: "Gemini AI analyzes requirements to generate comprehensive test cases covering positive scenarios, negative scenarios, and edge cases.",
                        dotColors: ["#47c1bf", "#8a8fff", "#5c61c0"]
                    },
                    {
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
                                <path d="M8 3v4a2 2 0 1 0 4 0V3" />
                                <line x1="6" y1="9" x2="18" y2="9" />
                                <line x1="6" y1="13" x2="18" y2="13" />
                                <line x1="6" y1="17" x2="18" y2="17" />
                            </svg>
                        ),
                        title: "Structured Output",
                        description: "Export test cases in Excel or CSV format with organized sheets for requirements and corresponding test cases.",
                        dotColors: ["#9651cf", "#8a8fff", "#5c61c0"]
                    }
                ].map((feature, index) => (
                    <motion.div
                        key={index}
                        ref={cardRefs[index]}
                        className="bg-[#11142b] p-6 rounded-lg border border-[#1e2142] shadow-lg transition-all duration-300 relative overflow-hidden group"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0px 0px 30px rgba(92,97,192,0.3)",
                            borderColor: "#5c61c0",
                            transition: {
                                duration: 0.2
                            }
                        }}
                        whileTap={{
                            scale: 0.95,
                            transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 17
                            }
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#5c61c0]/5 to-[#9651cf]/5 opacity-20 z-0 group-hover:opacity-30 transition-opacity duration-300"></div>

                        {/* Floating dots */}
                        <FloatingBalls
                            containerRef={cardRefs[index]}
                            isHovered={hoveredIndex === index} // Pass hover state
                        />

                        {/* Icon and title */}
                        <div className="flex items-center mb-4 relative z-20">
                            <div className="w-10 h-10 rounded-full bg-[#5c61c0]/10 flex items-center justify-center mr-3 group-hover:bg-[#5c61c0]/20 transition-colors duration-300">
                                <div className="text-[#8a8fff] group-hover:text-[#a4b4ff] transition-colors duration-300">
                                    {feature.icon}
                                </div>
                            </div>
                            <h4 className="font-medium text-gray-200 group-hover:text-white transition-colors duration-300">
                                {feature.title}
                            </h4>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm relative z-20 group-hover:text-gray-300 transition-colors duration-300">
                            {feature.description}
                        </p>

                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-[#5c61c0]/0 group-hover:bg-[#5c61c0]/5 transition-colors duration-300 z-10 pointer-events-none"></div>

                        {/* Pulse effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none">
                            <div className="absolute inset-0 bg-[#5c61c0]/10 animate-ping rounded-lg opacity-0 group-hover:opacity-30"></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

