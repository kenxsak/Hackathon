import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, ClipboardPaste, Info, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

const languages = ["English", "French", "Spanish", "German"];

export default function Dashboard() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ aiGenerated: number; humanRefined: number; humanWritten: number } | null>(null);
  const [showUnderstanding, setShowUnderstanding] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const minWords = 40;

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

  const handleDetect = async () => {
    if (wordCount < minWords) return;
    setIsAnalyzing(true);
    setResults(null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const ai = Math.floor(Math.random() * 60);
    const refined = Math.floor(Math.random() * (100 - ai));
    setResults({ aiGenerated: ai, humanRefined: refined, humanWritten: 100 - ai - refined });
    setIsAnalyzing(false);
  };

  return (
    <DashboardLayout title="AI Detector">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Trusted AI Detector & AI Checker</h2>
          <p className={`text-sm md:text-base max-w-2xl mx-auto ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Paste your text below to check if it was written by AI. Our AI Detector is trained on GPT-4, Gemini, Claude, and Llama.</p>
        </div>

        {/* Language Tabs */}
        <div className={`flex items-center gap-1 mb-6 overflow-x-auto pb-2 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          {languages.map((lang) => (
            <button key={lang} onClick={() => setSelectedLanguage(lang)} className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${selectedLanguage === lang ? (isDark ? "text-white border-b-2 border-white -mb-[2px]" : "text-gray-900 border-b-2 border-gray-900 -mb-[2px]") : (isDark ? "text-zinc-500 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}>{lang}</button>
          ))}
          <button className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${isDark ? "text-zinc-500 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>All <ChevronDown className="w-4 h-4" /></button>
        </div>

        {/* Main Tool Card */}
        <div className={`border rounded-2xl overflow-hidden ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <div className="flex flex-col lg:flex-row">
            {/* Input Section */}
            <div className={`flex-1 ${isDark ? "bg-[#111]" : "bg-white"}`}>
              <div className={`px-6 py-4 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                <div className="flex items-center gap-3">
                  <button onClick={handlePaste} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? "text-zinc-300 hover:bg-zinc-800" : "text-gray-700 hover:bg-gray-100"}`}><ClipboardPaste className="w-4 h-4" />Paste text</button>
                  <input ref={fileInputRef} type="file" accept=".txt,.doc,.docx,.pdf" onChange={handleFileUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? "text-zinc-300 hover:bg-zinc-800" : "text-gray-700 hover:bg-gray-100"}`}><Upload className="w-4 h-4" />Upload doc</button>
                </div>
              </div>
              <div className="p-6">
                <textarea ref={textareaRef} value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="To analyze text, add at least 40 words." className={`w-full h-64 resize-none rounded-xl p-4 text-sm focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-800 focus:ring-zinc-700 focus:border-zinc-700" : "bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 focus:ring-gray-300 focus:border-gray-300"}`} />
                <div className="flex items-center justify-between mt-4">
                  <div className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>{wordCount} / {minWords} words minimum</div>
                  <button onClick={handleDetect} disabled={wordCount < minWords || isAnalyzing} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${wordCount >= minWords && !isAnalyzing ? "bg-emerald-500 hover:bg-emerald-600 text-white" : (isDark ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed")}`}>{isAnalyzing ? "Analyzing..." : "Detect AI"}</button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className={`w-full lg:w-96 p-6 ${isDark ? "bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-zinc-800" : "bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200"}`}>
              {!results && !isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <p className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Add text to begin analysis</p>
                </div>
              )}
              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Analyzing your text...</p>
                </div>
              )}
              {results && !isAnalyzing && (
                <div className="space-y-5">
                  {[
                    { label: "AI-generated", value: results.aiGenerated, color: "bg-amber-400", tooltip: "Text likely generated by AI, like ChatGPT or Gemini." },
                    { label: "Human-written & AI-refined", value: results.humanRefined, color: "bg-blue-400", tooltip: "Text likely written by humans, then refined using AI tools." },
                    { label: "Human-written", value: results.humanWritten, color: "bg-emerald-400", tooltip: "Text likely written by humans without AI help." },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>{item.label}</span>
                          <span title={item.tooltip}><Info className={`w-3.5 h-3.5 cursor-help ${isDark ? "text-zinc-600" : "text-gray-400"}`} /></span>
                        </div>
                        <span className={`text-sm font-semibold font-mono ${isDark ? "text-white" : "text-gray-900"}`}>{item.value}%</span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-zinc-800" : "bg-gray-200"}`}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 0.5, delay: index * 0.1 }} className={`h-full rounded-full ${item.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Understanding Results */}
              <div className={`mt-6 pt-4 border-t ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                <button onClick={() => setShowUnderstanding(!showUnderstanding)} className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                  {showUnderstanding ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Understanding your results
                </button>
                {showUnderstanding && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`mt-3 text-xs leading-relaxed ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                    Our AI detector flags text that may be AI-generated. Use your best judgment when reviewing results. Never rely on AI detection alone to make decisions that could impact someone's career or academic standing.
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Button */}
        <div className="fixed right-4 bottom-4 md:right-8 md:bottom-8">
          <button className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-colors ${isDark ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700" : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"}`}>
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Feedback</span>
          </button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
