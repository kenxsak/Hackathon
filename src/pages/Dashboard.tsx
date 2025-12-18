import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  ClipboardPaste,
  ChevronDown,
  Check,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";
import { ALL_LANGUAGES, QUICK_LANGUAGES } from "../constants/languages";
import { ScrollArea } from "../components/ui/scroll-area";
import TextHighlighter from "../components/TextHighlighter";

// Types
interface LinguisticMetrics {
  perplexityScore: number;
  burstinessScore: number;
  readabilityScore: number;
  repetitivenessScore: number;
}

interface SuspiciousSegment {
  segment: string;
  reason: string;
  severity: "high" | "medium" | "low";
}

interface AnalysisResult {
  verdict: string;
  confidenceScore: number;
  reasoning: string[];
  metrics: LinguisticMetrics;
  detectedPatterns: string[];
  suspiciousSegments: SuspiciousSegment[];
}

export default function Dashboard() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState(0);
  const [activeTab, setActiveTab] = useState<"input" | "highlighted">("input");
  const [dragActive, setDragActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const allButtonRef = useRef<HTMLButtonElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setShowAllLanguages(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const charCount = inputText.length;
  const minChars = 50;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      textareaRef.current?.focus();
    } catch {
      console.error("Failed to read clipboard");
    }
  };

  const handleFileUpload = (file: File) => {
    const validExtensions = [".txt", ".md", ".json", ".js", ".ts", ".py", ".csv"];
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (validExtensions.includes(extension) || file.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onload = (event) => setInputText(event.target?.result as string);
      reader.readAsText(file);
    } else {
      setError("Please upload text-based files (.txt, .md, .js, .py, .json)");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDetect = async () => {
    if (charCount < minChars) {
      setError(`Please enter at least ${minChars} characters for accurate analysis.`);
      return;
    }
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      console.log(" Analysis Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Detection failed");
      }

      setResult(data);
      if (data.suspiciousSegments?.length > 0) {
        setActiveTab("highlighted");
      }
    } catch (err) {
      console.error("Detection error:", err);
      setError(err instanceof Error ? err.message : "Detection failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictConfig = (verdict: string) => {
    if (verdict === "Human-Written") {
      return {
        icon: ShieldCheck,
        color: "text-emerald-400",
        bg: "bg-emerald-500/20",
        border: "border-emerald-500/30",
        label: "Human-Written",
      };
    } else if (verdict === "AI-Generated") {
      return {
        icon: ShieldAlert,
        color: "text-red-400",
        bg: "bg-red-500/20",
        border: "border-red-500/30",
        label: "AI-Generated",
      };
    }
    return {
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-500/20",
      border: "border-amber-500/30",
      label: "Mixed/Uncertain",
    };
  };

  const MetricBar = ({ label, value, inverted = false }: { label: string; value: number; inverted?: boolean }) => {
    const displayValue = Math.round(value);
    const isWarning = inverted ? value > 60 : value < 40;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className={isDark ? "text-zinc-400" : "text-gray-600"}>{label}</span>
          <span className={`font-mono ${isWarning ? "text-amber-400" : isDark ? "text-zinc-300" : "text-gray-700"}`}>
            {displayValue}
          </span>
        </div>
        <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-zinc-800" : "bg-gray-200"}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${displayValue}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${isWarning ? "bg-amber-400" : "bg-emerald-400"}`}
          />
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="AI Detector">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Fingerprint className={`w-8 h-8 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
            <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              AI  Detector
            </h2>
          </div>
          <p className={`text-sm md:text-base max-w-2xl mx-auto ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
            Advanced  analysis to detect AI-generated content. Identifies suspicious patterns, linguistic markers, and highlights specific AI-like segments.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="relative mb-6" ref={tabsContainerRef}>
          <div className={`flex items-center gap-1 overflow-x-auto pb-2 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
            {QUICK_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedLanguage === lang
                    ? isDark
                      ? "text-white border-b-2 border-white -mb-[2px]"
                      : "text-gray-900 border-b-2 border-gray-900 -mb-[2px]"
                    : isDark
                    ? "text-zinc-500 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {lang}
              </button>
            ))}
            <div className="dropdown-container">
              <button
                ref={allButtonRef}
                onClick={() => {
                  if (allButtonRef.current && tabsContainerRef.current) {
                    const btnRect = allButtonRef.current.getBoundingClientRect();
                    const containerRect = tabsContainerRef.current.getBoundingClientRect();
                    setDropdownPosition(btnRect.left - containerRect.left);
                  }
                  setShowAllLanguages(!showAllLanguages);
                }}
                className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${isDark ? "text-zinc-500 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
              >
                All <ChevronDown className={`w-4 h-4 transition-transform ${showAllLanguages ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
          {showAllLanguages && (
            <div
              style={{ left: dropdownPosition }}
              className={`absolute top-full mt-2 w-56 rounded-xl border shadow-xl z-50 dropdown-container ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}
            >
              <ScrollArea className="h-72" data-lenis-prevent>
                <div className="p-1">
                  {ALL_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setShowAllLanguages(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between rounded-lg ${
                        selectedLanguage === lang ? "text-emerald-400" : isDark ? "text-zinc-300" : "text-gray-700"
                      } ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}
                    >
                      {lang}
                      {selectedLanguage === lang && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Main Tool Card */}
        <div className={`border rounded-2xl overflow-hidden ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <div className="flex flex-col lg:flex-row">
            {/* Input Section */}
            <div className={`flex-1 ${isDark ? "bg-[#111]" : "bg-white"}`}>
              <div className={`px-6 py-4 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePaste}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500/10" : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"}`}
                    >
                      <ClipboardPaste className="w-4 h-4" />
                      Paste
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md,.json,.js,.ts,.py,.csv"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                  {result && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab("input")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${activeTab === "input" ? (isDark ? "bg-zinc-700 text-white" : "bg-gray-200 text-gray-900") : isDark ? "text-zinc-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                      >
                        Original
                      </button>
                      <button
                        onClick={() => setActiveTab("highlighted")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${activeTab === "highlighted" ? (isDark ? "bg-zinc-700 text-white" : "bg-gray-200 text-gray-900") : isDark ? "text-zinc-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                      >
                        Highlighted
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`p-6 min-h-[320px] transition-colors ${dragActive ? (isDark ? "bg-emerald-500/10" : "bg-emerald-50") : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <AnimatePresence mode="wait">
                  {activeTab === "input" || !result ? (
                    <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <textarea
                        ref={textareaRef}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste or type your text here for  analysis. Drag & drop files supported."
                        className={`w-full h-64 resize-none rounded-xl p-4 text-sm focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-800 focus:ring-zinc-700" : "bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 focus:ring-gray-300"}`}
                      />
                    </motion.div>
                  ) : (
                    <motion.div key="highlighted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <TextHighlighter text={inputText} segments={result.suspiciousSegments || []} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                <div className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                  {charCount} characters {charCount < minChars && `(min ${minChars})`}
                </div>
                <button
                  onClick={handleDetect}
                  disabled={charCount < minChars || isAnalyzing}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${charCount >= minChars && !isAnalyzing ? "bg-emerald-500 hover:bg-emerald-600 text-white" : isDark ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                  <Fingerprint className="w-4 h-4" />
                  {isAnalyzing ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className={`w-full lg:w-[420px] ${isDark ? "bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-zinc-800" : "bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200"}`}>
              <ScrollArea className="h-[480px]" data-lenis-prevent>
                <div className="p-6">
                  {!result && !isAnalyzing && !error && (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <Fingerprint className={`w-16 h-16 mb-4 ${isDark ? "text-zinc-700" : "text-gray-300"}`} />
                      <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Ready for Analysis</p>
                      <p className={`text-sm mt-1 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                        Add text to begin  detection
                      </p>
                    </div>
                  )}

                  {error && !isAnalyzing && (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
                      <p className="text-sm text-red-400">{error}</p>
                      <button onClick={() => setError(null)} className="mt-3 text-xs text-emerald-500 hover:underline">
                        Try again
                      </button>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-emerald-500/30 rounded-full" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <div className="text-center">
                        <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}> Analysis</p>
                        <p className={`text-sm mt-1 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                          Scanning for AI patterns...
                        </p>
                      </div>
                    </div>
                  )}

                  {result && !isAnalyzing && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      {/* Verdict */}
                      {(() => {
                        const config = getVerdictConfig(result.verdict);
                        const VerdictIcon = config.icon;
                        return (
                          <div className={`p-4 rounded-xl border ${config.bg} ${config.border}`}>
                            <div className="flex items-center gap-3">
                              <VerdictIcon className={`w-10 h-10 ${config.color}`} />
                              <div>
                                <p className={`text-lg font-bold ${config.color}`}>{config.label}</p>
                                <p className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                                  {result.confidenceScore}% confidence
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Metrics */}
                      <div>
                        <h4 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                          Linguistic Metrics
                        </h4>
                        <div className="space-y-3">
                          <MetricBar label="Perplexity (Lower = AI)" value={result.metrics.perplexityScore} />
                          <MetricBar label="Burstiness (Lower = AI)" value={result.metrics.burstinessScore} />
                          <MetricBar label="Readability" value={result.metrics.readabilityScore} />
                          <MetricBar label="Repetitiveness (Higher = AI)" value={result.metrics.repetitivenessScore} inverted />
                        </div>
                      </div>

                      {/* Detected Patterns */}
                      {result.detectedPatterns.length > 0 && (
                        <div>
                          <h4 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                            Detected Patterns
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.detectedPatterns.map((pattern, i) => (
                              <span
                                key={i}
                                className={`px-2.5 py-1 rounded-full text-xs ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-gray-200 text-gray-700"}`}
                              >
                                {pattern}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reasoning */}
                      {result.reasoning.length > 0 && (
                        <div>
                          <h4 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                            Analysis Notes
                          </h4>
                          <ul className="space-y-2">
                            {result.reasoning.map((reason, i) => (
                              <li key={i} className={`text-xs flex gap-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                                <span className="text-emerald-400">•</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Suspicious Segments Count */}
                      {result.suspiciousSegments.length > 0 && (
                        <div className={`p-3 rounded-lg ${isDark ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50 border border-amber-200"}`}>
                          <p className={`text-sm ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                            <strong>{result.suspiciousSegments.length}</strong> suspicious segment(s) highlighted.
                            <button onClick={() => setActiveTab("highlighted")} className="ml-2 underline hover:no-underline">
                              View highlighted text →
                            </button>
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>


      </motion.div>
    </DashboardLayout>
  );
}
