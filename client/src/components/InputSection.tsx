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
        duration: Math.random() * 80000 + 60,  // Increased duration for smoother motion
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

const FloatingBalls = ({ isGenerating }: { isGenerating: boolean }) => { // Removed containerRef
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
            transition: {  // Store the transition here, so it does not re-create on every frame.
                type: "spring",
                stiffness: 70,
                damping: 20,
                duration: 0.8, // Increased duration for smoother effect
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
            let targetScale = ball.scale;
            let targetOpacity = ball.opacity;

            if (isGenerating) {
                targetScale = ball.scale * 1.4;  // Reduced scale increase
                targetOpacity = Math.min(1, ball.opacity * 1.1);  // Reduced opacity increase
            }

            return {
                x: ball.x,
                y: ball.y,
                scale: targetScale,
                opacity: targetOpacity,
                transition: ball.transition // Use the stored transition
            };
        });
    };

    return (
        <div className="absolute inset-0 pointer-events-none">
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

export default function InputSection({ onGenerate, isGenerating }: {
    onGenerate: (inputType: InputType, data: any, options: GenerationOptions) => void;
    isGenerating: boolean;
}) {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<InputType>("text");
    const containerRef = useRef<HTMLDivElement>(null);


    // State management
    const [requirementsText, setRequirementsText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // Generation options state
    const [options, setOptions] = useState({
        includeEdgeCases: true,
        includeNegativeTests: true,
        includePerformanceTests: false,
        outputFormat: "excel" as "excel" | "csv"
    });

    // File upload handling
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const uploadedFile = acceptedFiles[0];
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (!validTypes.includes(uploadedFile.type)) {
            toast({
                title: "Invalid File Type",
                description: "Please upload a PDF, DOC, or DOCX file",
                variant: "destructive"
            });
            return;
        }

        if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB limit
            toast({
                title: "File Size Exceeded",
                description: "Maximum file size is 10MB",
                variant: "destructive"
            });
            return;
        }

        setFile(uploadedFile);
    }, [toast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1,
    });

    // Handle generate button click
    const handleGenerate = () => {
        switch (activeTab) {
            case "text":
                if (!requirementsText.trim()) {
                    toast({
                        title: "Input Required",
                        description: "Please enter your requirements before generating",
                        variant: "destructive"
                    });
                    return;
                }
                onGenerate("text", requirementsText, options);
                break;

            case "file":
                if (!file) {
                    toast({
                        title: "File Required",
                        description: "Please upload a file before generating",
                        variant: "destructive"
                    });
                    return;
                }
                onGenerate("file", file, options);
                break;
        }
    };

    // Update option state
    const updateOption = (key: keyof typeof options, value: boolean | string) => {
        setOptions(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="bg-slate-950 min-h-screen relative" ref={containerRef}>
            <Particles />
            <FloatingBalls isGenerating={isGenerating} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl mx-auto pt-12 px-4 relative z-10"
            >
                <Card className="shadow-lg bg-slate-950/80 backdrop-blur-sm border border-slate-800 hover:shadow-xl hover:shadow-indigo-900/20 transition-shadow duration-300 relative overflow-hidden">
                    <CardHeader className="bg-slate-900/40 border-b border-slate-800 py-4">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <CardTitle className="flex items-center text-xl text-slate-200">
                                <Wand2 className="mr-3 text-indigo-400" />
                                Test Case Generator
                            </CardTitle>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <Tabs
                            value={activeTab}
                            onValueChange={(value) => setActiveTab(value as InputType)}
                            className="w-full"
                        >
                            <TabsList className="grid grid-cols-2 mb-6 bg-slate-900/40">
                                {["text", "file"].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-colors"
                                    >
                                        {tab === "text" ? "Text Input" : "File Upload"}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: activeTab === "text" ? -50 : 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: activeTab === "text" ? 50 : -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {activeTab === "text" ? (
                                        <Textarea
                                            className="w-full h-64 resize-none bg-slate-900/40 border-slate-700 text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                            placeholder="Paste your feature requirements here. Each requirement should be on a new line or clearly separated."
                                            value={requirementsText}
                                            onChange={(e) => setRequirementsText(e.target.value)}
                                        />
                                    ) : (
                                        <>
                                            <motion.div
                                                {...getRootProps()}
                                                whileHover={{ scale: 1.02 }}
                                                className={`drop-zone w-full h-64 flex flex-col items-center justify-center rounded-lg cursor-pointer border-2 border-dashed transition-all ${
                                                    isDragActive
                                                        ? "border-indigo-500 bg-indigo-900/20 scale-105"
                                                        : "border-slate-700 hover:border-indigo-500 hover:bg-indigo-900/10"
                                                }`}
                                            >
                                                <input {...getInputProps()} />
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.1, 1],
                                                        rotate: [0, 10, -10, 0]
                                                    }}
                                                    transition={{
                                                        duration: 0.6,
                                                        repeat: Infinity,
                                                        repeatType: "loop"
                                                    }}
                                                >
                                                    <Upload className="text-indigo-400 mb-4 size-12" />
                                                </motion.div>
                                                <p className="text-slate-300 mb-2 text-center">
                                                    {isDragActive
                                                        ? "Drop the file here..."
                                                        : "Drag & drop your files here or click to browse"}
                                                </p>
                                                <p className="text-sm text-slate-400">Supported formats: PDF, DOC, DOCX</p>
                                            </motion.div>

                                            <AnimatePresence>
                                                {file && (
                                                    <div className="mt-4">
                                                        <FilePreview file={file} onRemove={() => setFile(null)} />
                                                    </div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </Tabs>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mt-6 border-t border-slate-800 pt-6"
                        >
                            <h4 className="font-medium text-slate-200 mb-4 flex items-center">
                                <Zap className="mr-2 text-indigo-400" />
                                Generation Options
                            </h4>
                            <div className="space-y-4">
                                {[
                                    {
                                        id: "include-edge-cases",
                                        label: "Include edge cases",
                                        icon: <BarChart2 className="mr-2 text-indigo-400" />,
                                        checked: options.includeEdgeCases,
                                        onCheckedChange: (checked: boolean) => updateOption('includeEdgeCases', checked)
                                    },
                                    {
                                        id: "include-negative-tests",
                                        label: "Include negative test scenarios",
                                        icon: <X className="mr-2 text-indigo-400" />,
                                        checked: options.includeNegativeTests,
                                        onCheckedChange: (checked: boolean) => updateOption('includeNegativeTests', checked)
                                    },
                                    {
                                        id: "include-performance-tests",
                                        label: "Include performance test considerations",
                                        icon: <BarChart2 className="mr-2 text-indigo-400" />,
                                        checked: options.includePerformanceTests,
                                        onCheckedChange: (checked: boolean) => updateOption('includePerformanceTests', checked)
                                    }
                                ].map((option, index) => (
                                    <motion.div
                                        key={option.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                                        className="flex items-center space-x-2 hover:bg-slate-800/30 p-2 rounded-md transition-colors"
                                    >
                                        {option.icon}
                                        <Checkbox
                                            id={option.id}
                                            checked={option.checked}
                                            onCheckedChange={option.onCheckedChange}
                                            className="border-slate-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                                        />
                                        <Label htmlFor={option.id} className="text-sm text-slate-300 cursor-pointer">
                                            {option.label}
                                        </Label>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="mt-6"
                            >
                                <Label className="block text-sm font-medium text-slate-300 mb-2">
                                    Output Format
                                </Label>
                                <Select
                                    value={options.outputFormat}
                                    onValueChange={(value) => updateOption('outputFormat', value)}
                                >
                                    <SelectTrigger className="w-full bg-slate-900/40 border-slate-700 text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30">
                                        <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                        <SelectItem value="excel" className="hover:bg-indigo-900/30 focus:bg-indigo-900/30">
                                            Excel (.xlsx)
                                        </SelectItem>
                                        <SelectItem value="csv" className="hover:bg-indigo-900/30 focus:bg-indigo-900/30">
                                            CSV
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="mt-6"
                        >
                            <Button
                                className="w-full py-6 text-base bg-indigo-600 hover:bg-indigo-700 text-white group"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 group-hover:rotate-12 transition-transform" />
                                        Generate Test Cases
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

