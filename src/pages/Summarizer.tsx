import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, ClipboardPaste, ChevronDown, List, AlignLeft } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

const languages = ["Language (Auto)", "English", "Spanish", "French", "German", "Italian", "Portuguese"];
const lengths = ["Short", "Medium", "Long"];

export default function Summarizer() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [language, setLanguage] = useState("Language (Auto)");
  const [length, setLength] = useState("Short");
  const [outputType, setOutputType] = useState<"paragraph" | "bullets">("paragraph");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showLengthDropdown, setShowLengthDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setInputText(text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setInputText(event.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handleSummarize = async () => {
    if (!inputText.trim() || isProcessing) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim());
    const summaryCount = length === "Short" ? 2 : length === "Medium" ? 4 : 6;
    const summary = sentences.slice(0, Math.min(summaryCount, sentences.length));
    
    if (outputType === "bullets") {
      setOutputText(summary.map(s => `• ${s.trim()}`).join("\n"));
    } else {
      setOutputText(summary.join(". ").trim() + ".");
    }
    setIsProcessing(false);
  };

  return (
    <DashboardLayout title="Summarizer">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Free AI Summarizer</h1>
          <p className={`${isDark ? "text-zinc-400" : "text-gray-600"}`}>
            Condense articles, reports, or documents down to the key points instantly. Our AI uses natural language processing to locate critical information while maintaining the original context.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
          {/* Language */}
          <div className="relative">
            <button onClick={() => { setShowLangDropdown(!showLangDropdown); setShowLengthDropdown(false); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              {language} <ChevronDown className="w-4 h-4" />
            </button>
            {showLangDropdown && (
              <div className={`absolute top-full left-0 mt-2 w-48 rounded-lg border shadow-lg z-10 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
                {languages.map((lang) => (
                  <button key={lang} onClick={() => { setLanguage(lang); setShowLangDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm ${language === lang ? "text-emerald-400" : ""} ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}>{lang}</button>
                ))}
              </div>
            )}
          </div>

          {/* Length */}
          <div className="relative">
            <button onClick={() => { setShowLengthDropdown(!showLengthDropdown); setShowLangDropdown(false); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              {length} <ChevronDown className="w-4 h-4" />
            </button>
            {showLengthDropdown && (
              <div className={`absolute top-full left-0 mt-2 w-32 rounded-lg border shadow-lg z-10 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
                {lengths.map((l) => (
                  <button key={l} onClick={() => { setLength(l); setShowLengthDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm ${length === l ? "text-emerald-400" : ""} ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}>{l}</button>
                ))}
              </div>
            )}
          </div>

          {/* Output Type Toggle */}
          <div className={`flex items-center rounded-lg border ${isDark ? "border-zinc-700" : "border-gray-300"}`}>
            <button onClick={() => setOutputType("paragraph")} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-l-lg transition-colors ${outputType === "paragraph" ? (isDark ? "bg-zinc-700 text-white" : "bg-gray-200 text-gray-900") : (isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}`}>
              <AlignLeft className="w-4 h-4" />Paragraph
            </button>
            <button onClick={() => setOutputType("bullets")} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-r-lg transition-colors ${outputType === "bullets" ? (isDark ? "bg-zinc-700 text-white" : "bg-gray-200 text-gray-900") : (isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}`}>
              <List className="w-4 h-4" />Bullet Points
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className={`border rounded-2xl overflow-hidden ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <div className={`p-6 ${isDark ? "bg-[#111]" : "bg-white"}`}>
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder='Enter or paste your text and press "Summarize"'
              className={`w-full h-64 resize-none bg-transparent focus:outline-none text-sm ${isDark ? "text-white placeholder-zinc-500" : "text-gray-900 placeholder-gray-400"}`}
            />
            
            {!inputText && (
              <div className="flex items-center gap-3 mt-4">
                <button onClick={handlePaste} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
                  <ClipboardPaste className="w-4 h-4" />Paste
                </button>
                <input ref={fileInputRef} type="file" accept=".txt,.doc,.docx,.pdf" onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
                  <Upload className="w-4 h-4" />Upload
                </button>
              </div>
            )}
          </div>

          {/* Output Section */}
          {(outputText || isProcessing) && (
            <div className={`p-6 border-t ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-gray-50 border-gray-200"}`}>
              {isProcessing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className={`text-sm whitespace-pre-wrap ${isDark ? "text-white" : "text-gray-900"}`}>{outputText}</div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex items-center justify-end ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
            <button onClick={handleSummarize} disabled={!inputText.trim() || isProcessing} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${inputText.trim() && !isProcessing ? "bg-emerald-500 hover:bg-emerald-600 text-white" : (isDark ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed")}`}>
              {isProcessing ? "Summarizing..." : "Summarize"}
            </button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
