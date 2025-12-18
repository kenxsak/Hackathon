import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Upload, ClipboardPaste, FileText, ChevronDown, Check } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";
import { ALL_LANGUAGES } from "../constants/languages";
import { ScrollArea } from "../components/ui/scroll-area";

export default function PlagiarismChecker() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [inputText, setInputText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<{ percentage: number; sources: { url: string; match: number }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const maxWords = 25000;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      textareaRef.current?.focus();
    } catch { console.error("Failed to read clipboard"); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setInputText(event.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handleScan = async () => {
    if (!inputText.trim()) return;
    setIsScanning(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/plagiarism", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Plagiarism check failed");
      }

      // Parse API response - adjust based on actual API response structure
      const plagiarismPercent = data.plagiarism_percentage || data.percentage || 0;
      const sources = data.sources || data.matches || [];
      
      setResults({
        percentage: Math.round(plagiarismPercent),
        sources: sources.map((s: { url?: string; source?: string; match?: number; percentage?: number }) => ({
          url: s.url || s.source || "Unknown source",
          match: s.match || s.percentage || 0,
        })),
      });
    } catch (err) {
      console.error("Plagiarism check error:", err);
      setError(err instanceof Error ? err.message : "Plagiarism check failed");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <DashboardLayout title="Plagiarism Checker">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Top Bar with Language */}
        <div className={`flex items-center justify-end mb-6 pb-4 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <div className="relative dropdown-container">
            <button onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} className={`flex items-center gap-2 text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
              <span>{selectedLanguage}</span><ChevronDown className={`w-4 h-4 transition-transform ${showLanguageDropdown ? "rotate-180" : ""}`} />
            </button>
            {showLanguageDropdown && (
              <div className={`absolute top-full right-0 mt-2 w-56 rounded-xl border shadow-xl z-50 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
                <ScrollArea className="h-72" data-lenis-prevent>
                  <div className="p-1">
                    {ALL_LANGUAGES.map((lang) => (
                      <button key={lang} onClick={() => { setSelectedLanguage(lang); setShowLanguageDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between rounded-lg ${selectedLanguage === lang ? "text-emerald-400" : ""} ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}>
                        {lang}
                        {selectedLanguage === lang && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Plagiarism Checker</h2>
          <p className={`text-sm md:text-base max-w-2xl mx-auto ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Stay original and confident with our AI-powered plagiarism checker—built to quickly spot unoriginal content and enhance your writing with precision.</p>
        </div>

        {/* Main Tool Card */}
        <div className={`border rounded-2xl overflow-hidden max-w-3xl mx-auto ${isDark ? "border-zinc-800 bg-[#111]" : "border-gray-200 bg-white"}`}>
          <div className="p-6">
            <p className={`text-sm mb-4 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>To check for plagiarism, add text, or upload a file (.docx)</p>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-6">
              <button onClick={handlePaste} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500/10" : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"}`}><ClipboardPaste className="w-4 h-4" />Paste text</button>
              <input ref={fileInputRef} type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}><Upload className="w-4 h-4" />Upload file</button>
            </div>

            {/* Text Area */}
            <textarea ref={textareaRef} value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Enter or paste your text here..." className={`w-full h-64 resize-none rounded-xl p-4 text-sm focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-800 focus:ring-zinc-700" : "bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 focus:ring-gray-300"}`} />

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
              <div className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>{wordCount}/{maxWords} words</div>
              <button onClick={handleScan} disabled={!inputText.trim() || isScanning} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${inputText.trim() && !isScanning ? "bg-emerald-500 hover:bg-emerald-600 text-white" : (isDark ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed")}`}>{isScanning ? "Scanning..." : "Scan for plagiarism"}</button>
            </div>
          </div>

          {/* Results */}
          {(isScanning || results || error) && (
            <div className={`border-t p-6 ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-gray-50"}`}>
              {isScanning && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Scanning for plagiarism...</p>
                </div>
              )}
              {error && !isScanning && (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-sm text-red-500">{error}</p>
                  <button onClick={() => setError(null)} className="mt-2 text-xs text-emerald-500 hover:underline">Try again</button>
                </div>
              )}
              {results && !isScanning && !error && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${results.percentage > 20 ? "bg-red-500/20 text-red-400" : results.percentage > 10 ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>{results.percentage}%</div>
                    <div>
                      <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{results.percentage > 20 ? "High similarity detected" : results.percentage > 10 ? "Some similarity found" : "Looks original!"}</p>
                      <p className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>{results.sources.length} potential sources found</p>
                    </div>
                  </div>
                  {results.sources.length > 0 && (
                    <div className="space-y-3">
                      <p className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Sources:</p>
                      {results.sources.map((source, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-zinc-800" : "bg-white border border-gray-200"}`}>
                          <div className="flex items-center gap-3">
                            <FileText className={`w-4 h-4 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
                            <span className={`text-sm ${isDark ? "text-zinc-300" : "text-gray-700"}`}>{source.url}</span>
                          </div>
                          <span className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-gray-500"}`}>{source.match}% match</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
