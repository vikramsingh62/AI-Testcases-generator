import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GenerationOptions, InputType } from "@/lib/types";
import { FileText, X, Upload, Wand2, Zap, BarChart2 } from "lucide-react";

// Particle Component
const Particles = () => {
    const particles = Array(30).fill(null).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 5,
        color: [
            "bg-pink-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500",
            "bg-green-500", "bg-teal-500", "bg-cyan-500", "bg-red-500"
        ][Math.floor(Math.random() * 8)],
        duration: Math.random() * 80 + 60,  // Increased duration for smoother motion
        delay: Math.random() * 5
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
            {particles.map(particle => (
                <motion.div
                    key={particle.id}
                    className={`absolute rounded-full opacity-30 ${particle.color}`}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size
                    }}
                    animate={{
                        x: [0, Math.random() * 200 - 100],
                        y: [0, Math.random() * 200 - 100],
                        opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",  // Keep easeInOut for smooth transitions
                        repeatType: "reverse"
                    }}
                />
            ))}
        </div>
    );
};

// Animated File Preview Component
function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700 shadow-sm transition-all hover:bg-slate-700/50"
        >
            <FileText className="text-indigo-400 mr-3 size-5" />
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">{file.name}</p>
                <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
            </div>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-slate-400 hover:text-rose-400 transition-colors group"
                onClick={onRemove}
                aria-label="Remove file"
            >
                <X className="size-5 group-hover:rotate-90 transition-transform" />
            </motion.button>
        </motion.div>
    );
}

// Format file size utility
function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const FloatingBalls = () => {
    const ballCount = 15;
    const [balls, setBalls] = useState([]);
    const isMounted = useRef(true);

    const generateRandomBalls = (width, height) => {
        return Array.from({ length: ballCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            scale: Math.random() * 0.5 + 0.3,
            opacity: Math.random() * 0.5 + 0.3,
            blur: Math.random() * 5,
            color: `hsla(${Math.random() * 360}, 70%, 60%, 0.6)`,
            transition: {
                type: "spring",
                stiffness: 70,
                damping: 20,
                duration: 0.8,
            }
        }));
    };

    useEffect(() => {
        const updateBalls = () => {
            if (!isMounted.current) return;
            const width = window.innerWidth;
            const height = window.innerHeight;
            setBalls(generateRandomBalls(width, height));
        };

        updateBalls();
        window.addEventListener('resize', updateBalls);
        return () => {
            window.removeEventListener('resize', updateBalls);
            isMounted.current = false;
        };
    }, []);

    const getBallVariants = () => {
        return balls.map(ball => {
            const targetScale = ball.scale;
            const targetOpacity = ball.opacity;


            return {
                x: ball.x,
                y: ball.y,
                scale: targetScale,
                opacity: targetOpacity,
                transition: ball.transition
            };
        });
    };

    return (
        <div className="absolute inset-0 pointer-events-none -z-10">
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
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                        background: ball.color,
                        filter: `blur(${ball.blur}px)`,
                        pointerEvents: 'none'
                    }}
                />
            ))}
        </div>
    );
};

export default function PreviewSection({
    requirements,
    testCases,
    loading,
    showPreview,
    generationStatus,
    positiveCount,
    negativeCount,
    edgeCaseCount,
    onExport
}: PreviewSectionProps) {
    const [activeTab, setActiveTab] = useState("requirements");
    const containerRef = useRef<HTMLDivElement>(null);

    // Empty state - no preview available yet
    const renderEmptyState = () => (
        <div className="text-center py-16 relative overflow-hidden">
            {/* Decorative particles */}
            <FloatingBalls />

            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-indigo-400 mb-4 relative z-10">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
            </svg>
            <h4 className="text-slate-200 font-medium mb-2 relative z-10">No Preview Available</h4>
            <p className="text-slate-400 text-sm max-w-sm mx-auto relative z-10">
                Enter your requirements and click the generate button to see a preview of your test cases.
            </p>
        </div>
    );

    // Loading state while generating test cases
    const renderLoadingState = () => (
        <div className="text-center py-16 relative overflow-hidden">
            {/* Decorative particles */}
            <FloatingBalls />

            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 relative z-10"></div>
            <h4 className="text-slate-200 font-medium mt-4 mb-1 relative z-10">Generating Test Cases</h4>
            <p className="text-slate-400 text-sm max-w-sm mx-auto relative z-10">{generationStatus}</p>
        </div>
    );

    // Requirements section with identified requirements
    const renderRequirementsPreview = () => (
        <div className="mb-4">
            <h4 className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2">
                Identified Requirements
            </h4>
            <div className="border border-slate-700 rounded-md bg-slate-800/50 backdrop-blur-sm">
                {requirements.map((req) => (
                    <div key={req.id} className="p-3 border-b border-slate-700 last:border-b-0">
                        <div className="flex items-start">
                            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                                {req.id}
                            </span>
                            <div>
                                <p className="text-sm text-slate-300">{req.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Test cases section with table of generated test cases
    const renderTestCasesPreview = () => (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-indigo-300 uppercase tracking-wider">
                    Test Case Preview
                </h4>
                <div className="text-xs text-indigo-200">
                    Total: <span className="font-medium">{testCases.length}</span> test cases
                </div>
            </div>

            <div className="overflow-x-auto rounded-md border border-slate-700">
                <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-800">
                        <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Precondition</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Expected Result</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Priority</th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-900 divide-y divide-slate-700">
                        {testCases.map((testCase) => (
                            <tr key={testCase.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-300">{testCase.id}</td>
                                <td className="px-3 py-2 text-xs text-slate-300">{testCase.description}</td>
                                <td className="px-3 py-2 text-xs text-slate-300">{testCase.precondition}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        testCase.type === 'positive'
                                            ? 'bg-green-900/50 text-green-300'
                                            : testCase.type === 'negative'
                                                ? 'bg-red-900/50 text-red-300'
                                                : testCase.type === 'edge_case'
                                                    ? 'bg-yellow-900/50 text-yellow-300'
                                                    : 'bg-blue-900/50 text-blue-300'
                                        }`}>
                                        {testCase.type === 'positive'
                                            ? 'Positive'
                                            : testCase.type === 'negative'
                                                ? 'Negative'
                                                : testCase.type === 'edge_case'
                                                    ? 'Edge Case'
                                                    : 'Performance'}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-xs text-slate-300">{testCase.expectedResult}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        testCase.priority === 'high'
                                            ? 'bg-red-900/50 text-red-300'
                                            : testCase.priority === 'medium'
                                                ? 'bg-yellow-900/50 text-yellow-300'
                                                : 'bg-green-900/50 text-green-300'
                                        }`}>
                                        {testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-green-500/30 mr-1"></span>
                        <span className="text-xs text-slate-300">Positive: <span className="text-green-300">{positiveCount}</span></span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-red-500/30 mr-1"></span>
                        <span className="text-xs text-slate-300">Negative: <span className="text-red-300">{negativeCount}</span></span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-yellow-500/30 mr-1"></span>
                        <span className="text-xs text-slate-300">Edge Cases: <span className="text-yellow-300">{edgeCaseCount}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );

    // Preview content with tabs for requirements and test cases
    const renderPreviewContent = () => (
        <>
            <div className="mb-4 border-b border-slate-700 relative" ref={containerRef}>
                <style jsx>{`
                    @keyframes float {
                        0% { transform: translateY(0) translateX(0); }
                        25% { transform: translateY(-10px) translateX(5px); }
                        50% { transform: translateY(0) translateX(10px); }
                        75% { transform: translateY(10px) translateX(5px); }
                        100% { transform: translateY(0) translateX(0); }
                    }
                `}</style>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="border-b-0 bg-slate-800">
                        <TabsTrigger
                            value="requirements"
                            className={activeTab === "requirements" ? "data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-200" : "text-slate-400 hover:text-indigo-200"}
                        >
                            Requirements
                        </TabsTrigger>
                        <TabsTrigger
                            value="test-cases"
                            className={activeTab === "test-cases" ? "data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-200" : "text-slate-400 hover:text-indigo-200"}
                        >
                            Test Cases
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <FloatingBalls />
            </div>

            {activeTab === "requirements" && renderRequirementsPreview()}
            {activeTab === "test-cases" && renderTestCasesPreview()}

            <div className="mt-6 relative">
                <Button
                    className="w-full py-6 text-base relative bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 border-0 text-slate-100"
                    onClick={() => onExport("excel")}
                    variant="secondary"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download Test Cases
                </Button>

                {/* Particle effects behind the button */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full opacity-30"
                            style={{
                                bottom: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][Math.floor(Math.random() * 6)]
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <Card className="bg-slate-900 border-slate-700 shadow-xl backdrop-blur-sm relative overflow-hidden" ref={containerRef}>
            {/* Background particles for the entire card */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full opacity-20"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][Math.floor(Math.random() * 6)]
                        }}
                    ></div>
                ))}
            </div>

            <CardContent className="p-6">
                <h3 className="text-lg font-medium text-slate-100 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-indigo-400">
                        <path d="M2 12h5"></path>
                        <path d="M9 12h5"></path>
                        <path d="M16 12h6"></path>
                        <path d="M3 7h7"></path>
                        <path d="M13 7h3"></path>
                        <path d="M19 7h2"></path>
                        <path d="M3 17h2"></path>
                        <path d="M8 17h8"></path>
                        <path d="M19 17h2"></path>
                    </svg>
                    Preview
                    <span className="ml-2 text-xs text-indigo-400 font-normal">(AI-Generated)</span>
                </h3>

                {loading && renderLoadingState()}
                {!loading && !showPreview && renderEmptyState()}
                {!loading && showPreview && renderPreviewContent()}
            </CardContent>
        </Card>
    );
}

