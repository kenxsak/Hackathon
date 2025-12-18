import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, ClipboardPaste, Copy, Check, ChevronDown, Sparkles } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

const languages = ["English (US)", "French", "Spanish", "German"];
const modes = ["Standard", "Fluency", "Humanize", "Formal", "Academic", "Simple", "Creative", "Expand", "Shorten", "Custom"];

export default function Paraphraser() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");
  const [selectedMode, setSelectedMode] = useState("Standard");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [synonymsLevel, setSynonymsLevel] = useState(50);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleParaphrase = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setOutputText("");
    
    // Simulate paraphrasing (replace with actual API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock paraphrased output
    const words = inputText.split(" ");
    const paraphrased = words.map((word, i) => {
      if (i % 3 === 0 && word.length > 3) {
        const synonyms: Record<string, string> = {
          "good": "excellent", "bad": "poor", "big": "large", "small": "tiny",
          "happy": "joyful", "sad": "melancholy", "fast": "rapid", "slow": "gradual",
          "important": "crucial", "help": "assist", "make": "create", "use": "utilize",
        };
        return synonyms[word.toLowerCase()] || word;
      }
      return word;
    }).join(" ");
    
    setOutputText(paraphrased);
    setIsProcessing(false);
  };

  const loadSampleText = () => {
    setInputText("The quick brown fox jumps over the lazy dog. This is a sample text that demonstrates how the paraphraser works. It will help you understand the different modes and settings available for rewriting your content in a more engaging way.");
  };

  return (
    <DashboardLayout title="Paraphrasing Tool">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Language Tabs */}
        <div className={`flex items-center gap-1 mb-4 overflow-x-auto pb-2 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          {languages.map((lang) => (
            <button key={lang} onClick={() => setSelectedLanguage(lang)} className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${selectedLanguage === lang ? (isDark ? "text-white border-b-2 border-white -mb-[2px]" : "text-gray-900 border-b-2 border-gray-900 -mb-[2px]") : (isDark ? "text-zinc-500 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}>{lang}</button>
          ))}
          <button className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${isDark ? "text-zinc-500 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>All <ChevronDown className="w-4 h-4" /></button>
        </div>

        {/* Mode Tabs */}
        <div className={`flex items-center gap-2 mb-6 overflow-x-auto pb-2`}>
          <span className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Modes:</span>
          {modes.map((mode) => (
            <button key={mode} onClick={() => setSelectedMode(mode)} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${selectedMode === mode ? (isDark ? "bg-zinc-800 text-white" : "bg-gray-200 text-gray-900") : (isDark ? "text-zinc-500 hover:text-white hover:bg-zinc-800/50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100")}`}>{mode}</button>
          ))}
          {/* Synonyms Slider */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-zinc-700">
            <span className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Synonyms:</span>
            <input type="range" min="0" max="100" value={synonymsLevel} onChange={(e) => setSynonymsLevel(Number(e.target.value))} className="w-24 accent-emerald-500" />
          </div>
        </div>

        {/* Main Tool Card */}
        <div className={`border rounded-2xl overflow-hidden ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Input Section */}
            <div className={`${isDark ? "bg-[#111]" : "bg-white"}`}>
              <div className="p-6">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="To rewrite text, enter or paste it here and press 'Paraphrase.'"
                  className={`w-full h-72 resize-none rounded-xl p-4 text-sm focus:outline-none transition-all border-0 ${isDark ? "bg-transparent text-white placeholder-zinc-500" : "bg-transparent text-gray-900 placeholder-gray-400"}`}
                />
                {!inputText && (
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={loadSampleText} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500/10" : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"}`}>
                      <Sparkles className="w-4 h-4" />Try Sample Text
                    </button>
                    <button onClick={handlePaste} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
                      <ClipboardPaste className="w-4 h-4" />Paste Text
                    </button>
                  </div>
                )}
              </div>
              <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                <div className="flex items-center gap-3">
                  <input ref={fileInputRef} type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                    <Upload className="w-4 h-4" />Upload Doc
                  </button>
                </div>
                <button onClick={handleParaphrase} disabled={!inputText.trim() || isProcessing} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${inputText.trim() && !isProcessing ? "bg-emerald-500 hover:bg-emerald-600 text-white" : (isDark ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed")}`}>
                  {isProcessing ? "Processing..." : "Paraphrase"}
                </button>
              </div>
            </div>

            {/* Output Section */}
            <div className={`${isDark ? "bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-zinc-800" : "bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200"}`}>
              <div className="p-6">
                {!outputText && !isProcessing && (
                  <div className="h-72 flex items-center justify-center">
                    <p className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Your paraphrased text will appear here</p>
                  </div>
                )}
                {isProcessing && (
                  <div className="h-72 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Paraphrasing your text...</p>
                  </div>
                )}
                {outputText && !isProcessing && (
                  <div className={`h-72 overflow-y-auto text-sm leading-relaxed ${isDark ? "text-white" : "text-gray-900"}`}>
                    {outputText}
                  </div>
                )}
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
