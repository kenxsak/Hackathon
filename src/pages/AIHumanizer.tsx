import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, ClipboardPaste, Copy, Check, ChevronDown, Sparkles } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";
import { ALL_LANGUAGES } from "../constants/languages";
import { ScrollArea } from "../components/ui/scroll-area";

const modes = ["Basic", "Advanced"];

const modeInfo: Record<string, { uses: string[]; inputText: string; outputText: string; highlightWords: string[] }> = {
  Basic: {
    uses: ["Blog posts", "Social media", "Casual emails", "General content", "Quick humanization"],
    inputText: "The implementation of the system will facilitate better outcomes.",
    outputText: "Setting up the system will help achieve better results.",
    highlightWords: ["Setting up", "help achieve", "results"],
  },
  Advanced: {
    uses: ["Academic papers", "Professional documents", "Technical content", "Research articles", "Formal reports"],
    inputText: "Subsequently, the utilization of advanced methodologies will be implemented.",
    outputText: "Then, we'll use advanced methods to put this into practice.",
    highlightWords: ["Then", "use", "put this into practice"],
  },
};

export default function AIHumanizer() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");
  const [selectedMode, setSelectedMode] = useState("Basic");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setOutputText("");
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, mode: selectedMode.toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Humanization failed");
      }

      // Parse API response - adjust based on actual API response structure
      setOutputText(data.humanized_text || data.text || data.result || inputText);
    } catch (err) {
      console.error("Humanize error:", err);
      setError(err instanceof Error ? err.message : "Humanization failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTrySample = () => {
    setInputText(modeInfo[selectedMode].inputText);
  };

  const renderHighlightedText = (text: string, highlights: string[]) => {
    let result = text;
    highlights.forEach(word => {
      result = result.replace(new RegExp(`(${word})`, 'gi'), '|||$1|||');
    });
    return result.split('|||').map((part, i) => {
      const isHighlight = highlights.some(h => part.toLowerCase() === h.toLowerCase());
      return isHighlight ? <span key={i} className="text-emerald-400">{part}</span> : <span key={i}>{part}</span>;
    });
  };

  const currentModeInfo = modeInfo[selectedMode];

  return (
    <DashboardLayout title="Humanize AI">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Top Bar */}
        <div className={`flex items-center justify-between mb-6 pb-4 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <div className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Untitled document</div>
          <div className="flex items-center gap-4">
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
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Modes:</span>
          {modes.map((mode) => (
            <button key={mode} onClick={() => setSelectedMode(mode)} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${selectedMode === mode ? (isDark ? "bg-zinc-800 text-white" : "bg-gray-200 text-gray-900") : (isDark ? "text-zinc-500 hover:text-white hover:bg-zinc-800/50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100")}`}>{mode}</button>
          ))}
        </div>

        {/* Main Tool Card */}
        <div className={`border rounded-2xl overflow-hidden ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Input Section */}
            <div className={`${isDark ? "bg-[#111]" : "bg-white"}`}>
              <div className={`px-6 py-4 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                <div className="flex items-center gap-3">
                  <button onClick={handleTrySample} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-amber-500/50 text-amber-400 hover:bg-amber-500/10" : "border-amber-500 text-amber-600 hover:bg-amber-50"}`}>
                    <Sparkles className="w-4 h-4" />Try Sample Text
                  </button>
                  <button onClick={handlePaste} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500/10" : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"}`}>
                    <ClipboardPaste className="w-4 h-4" />Paste Text
                  </button>
                  <input ref={fileInputRef} type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                </div>
              </div>
              <div className="p-6">
                <textarea ref={textareaRef} value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Enter or paste your AI-generated text here and click Humanize." className={`w-full h-72 resize-none text-sm focus:outline-none ${isDark ? "bg-transparent text-white placeholder-zinc-500" : "bg-transparent text-gray-900 placeholder-gray-400"}`} />
              </div>
              <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-2 text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                  <Upload className="w-4 h-4" />Upload Doc
                </button>
                <button onClick={handleHumanize} disabled={!inputText.trim() || isProcessing} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${inputText.trim() && !isProcessing ? "bg-emerald-500 hover:bg-emerald-600 text-white" : (isDark ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed")}`}>
                  {isProcessing ? "Processing..." : "Humanize"}
                </button>
              </div>
            </div>

            {/* Output Section */}
            <div className={`${isDark ? "bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-zinc-800" : "bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200"}`}>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {!outputText && !isProcessing && (
                    <motion.div key="mode-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-72">
                      <div className={`rounded-xl p-5 h-full ${isDark ? "bg-zinc-800/50" : "bg-white border border-gray-200"}`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>{selectedMode} mode</h3>
                        <div className="mb-5">
                          <p className={`text-xs font-medium uppercase tracking-wide mb-2 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>USES</p>
                          <div className="flex flex-wrap gap-2">
                            {currentModeInfo.uses.map((use, i) => (
                              <span key={i} className={`px-3 py-1 rounded-full text-xs ${isDark ? "bg-zinc-700 text-zinc-300" : "bg-gray-100 text-gray-700"}`}>{use}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className={`text-xs font-medium mb-1 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Input Text</p>
                            <p className={`text-sm ${isDark ? "text-zinc-300" : "text-gray-700"}`}>{currentModeInfo.inputText}</p>
                          </div>
                          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${isDark ? "text-zinc-600" : "text-gray-400"}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs font-medium mb-1 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Humanized Text</p>
                            <p className={`text-sm ${isDark ? "text-zinc-300" : "text-gray-700"}`}>{renderHighlightedText(currentModeInfo.outputText, currentModeInfo.highlightWords)}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {isProcessing && (
                    <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-72 flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <p className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Humanizing your text...</p>
                    </motion.div>
                  )}
                  {error && !isProcessing && (
                    <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-72 flex flex-col items-center justify-center gap-3">
                      <p className="text-sm text-red-500">{error}</p>
                      <button onClick={() => setError(null)} className="text-xs text-emerald-500 hover:underline">Try again</button>
                    </motion.div>
                  )}
                  {outputText && !isProcessing && !error && (
                    <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`h-72 overflow-y-auto text-sm leading-relaxed ${isDark ? "text-white" : "text-gray-900"}`}>{outputText}</motion.div>
                  )}
                </AnimatePresence>
              </div>
              {outputText && !isProcessing && (
                <div className={`px-6 py-4 border-t flex items-center justify-end ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                  <button onClick={handleCopy} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? "text-zinc-300 hover:bg-zinc-800" : "text-gray-700 hover:bg-gray-100"}`}>
                    {copied ? <><Check className="w-4 h-4 text-emerald-500" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
