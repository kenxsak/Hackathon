import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, ClipboardPaste, Copy, Check, ChevronDown, Sparkles } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";
import { ALL_LANGUAGES } from "../constants/languages";
import { Slider } from "../components/ui/slider";
import { ScrollArea } from "../components/ui/scroll-area";

const modes = ["Standard", "Fluency", "Humanize", "Formal", "Academic", "Simple", "Creative", "Expand", "Shorten", "Custom"];

// Mode information data
const modeInfo: Record<string, { uses: string[]; inputText: string; outputText: string; highlightWords: string[] }> = {
  Standard: {
    uses: ["General rewriting", "Basic paraphrasing", "Quick edits", "Content refresh"],
    inputText: "The quick brown fox jumps over the lazy dog.",
    outputText: "The swift brown fox leaps over the idle dog.",
    highlightWords: ["swift", "leaps", "idle"],
  },
  Fluency: {
    uses: ["Grammar improvement", "Sentence flow", "Readability", "Natural language"],
    inputText: "Me and him went to store yesterday.",
    outputText: "He and I went to the store yesterday.",
    highlightWords: ["He", "I", "the"],
  },
  Humanize: {
    uses: ["Personal Blogs & Diaries", "Social Media Posts", "Speeches & Talks", "Customer Service Correspondence", "Cover Letters & Resumes", "Personal Letters & Correspondence"],
    inputText: "Agriculture's chronicle is a testament to human ingenuity's evolution.",
    outputText: "The history of agriculture shows how human creativity has developed.",
    highlightWords: ["history", "shows how", "creativity has developed"],
  },
  Formal: {
    uses: ["Research papers/reports", "Essays", "Professional presentations", "Work/professional emails", "Cover Letters", "Technical and white papers"],
    inputText: "Shoot me an email when you get the order.",
    outputText: "Send me an email to confirm receipt of the products.",
    highlightWords: ["Send me", "confirm receipt of the", "products"],
  },
  Academic: {
    uses: ["Essays & research papers", "Thesis and Dissertations", "Research proposals"],
    inputText: "The shift to agriculture took thousands of years.",
    outputText: "The transition to an agrarian society spanned several millennia.",
    highlightWords: ["transition", "agrarian society spanned", "several millennia"],
  },
  Simple: {
    uses: ["Professional presentations", "Marketing material", "Website copy", "Breaking down complicated texts", "SEO titles and meta descriptions", "Project briefs/directions"],
    inputText: "There is no need for concern.",
    outputText: "There's nothing to worry about.",
    highlightWords: ["nothing to worry", "about"],
  },
  Creative: {
    uses: ["Children's books", "Fiction books", "Non fiction books", "Emails to friends", "Social media captions", "Screenwriting", "Blog posts", "Idea generation"],
    inputText: "It is a simple yet powerful idea.",
    outputText: "The idea is uncomplicated but still impactful.",
    highlightWords: ["uncomplicated", "but still impactful"],
  },
  Expand: {
    uses: ["Essays", "Research reports", "Descriptive writing", "Item descriptions", "Idea generation"],
    inputText: "Business is all about profit.",
    outputText: "When it comes to business, profit is everything.",
    highlightWords: ["When it comes to", "profit is", "everything"],
  },
  Shorten: {
    uses: ["Summaries", "Headlines", "Social media", "Quick notes", "Abstracts"],
    inputText: "In my personal opinion, I believe that we should go.",
    outputText: "I think we should go.",
    highlightWords: ["I think", "we should go"],
  },
  Custom: {
    uses: ["Personalized style", "Specific tone", "Brand voice", "Custom rules"],
    inputText: "Configure your own paraphrasing style.",
    outputText: "Set up your unique rewriting preferences.",
    highlightWords: ["Set up", "unique", "preferences"],
  },
};

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

  const handleParaphrase = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setOutputText("");

    try {
      const response = await fetch("http://localhost:3001/api/paraphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: inputText, 
          mode: selectedMode.toLowerCase(), 
          synonymLevel: synonymsLevel 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Paraphrasing failed");
      }

      setOutputText(data.paraphrased_text || inputText);
    } catch (err) {
      console.error("Paraphrase error:", err);
      setOutputText("Error: " + (err instanceof Error ? err.message : "Paraphrasing failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTrySample = () => {
    const currentModeInfo = modeInfo[selectedMode];
    setInputText(currentModeInfo.inputText);
  };

  // Highlight words in output text
  const renderHighlightedText = (text: string, highlights: string[]) => {
    let result = text;
    highlights.forEach(word => {
      result = result.replace(new RegExp(`(${word})`, 'gi'), '|||$1|||');
    });
    return result.split('|||').map((part, i) => {
      const isHighlight = highlights.some(h => part.toLowerCase() === h.toLowerCase());
      return isHighlight ? (
        <span key={i} className="text-emerald-400">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      );
    });
  };

  const currentModeInfo = modeInfo[selectedMode];

  return (
    <DashboardLayout title="Paraphrasing Tool">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Top Bar */}
        <div className={`flex items-center justify-between mb-6 pb-4 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <div className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Untitled document</div>
          <div className="flex items-center gap-4">
            {/* Language Dropdown */}
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
        <div className={`flex items-center gap-2 mb-6 overflow-x-auto pb-2`}>
          <span className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Modes:</span>
          {modes.map((mode) => (
            <button key={mode} onClick={() => setSelectedMode(mode)} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${selectedMode === mode ? (isDark ? "bg-zinc-800 text-white" : "bg-gray-200 text-gray-900") : (isDark ? "text-zinc-500 hover:text-white hover:bg-zinc-800/50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100")}`}>{mode}</button>
          ))}
          <div className={`flex items-center gap-3 ml-4 pl-4 border-l ${isDark ? "border-zinc-700" : "border-gray-300"}`}>
            <span className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Synonyms:</span>
            <Slider
              value={[synonymsLevel]}
              onValueChange={(value) => setSynonymsLevel(value[0])}
              max={100}
              step={1}
              className="w-28"
            />
          </div>
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
                <textarea ref={textareaRef} value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="To rewrite text, enter or paste it here and press 'Paraphrase.'" className={`w-full h-72 resize-none text-sm focus:outline-none ${isDark ? "bg-transparent text-white placeholder-zinc-500" : "bg-transparent text-gray-900 placeholder-gray-400"}`} />
              </div>
              <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-2 text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                  <Upload className="w-4 h-4" />Upload Doc
                </button>
                <button onClick={handleParaphrase} disabled={!inputText.trim() || isProcessing} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${inputText.trim() && !isProcessing ? "bg-emerald-500 hover:bg-emerald-600 text-white" : (isDark ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed")}`}>
                  {isProcessing ? "Processing..." : "Paraphrase"}
                </button>
              </div>
            </div>

            {/* Output Section */}
            <div className={`${isDark ? "bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-zinc-800" : "bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200"}`}>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {!outputText && !isProcessing && (
                    <motion.div
                      key="mode-info"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-72"
                    >
                      {/* Mode Info Panel */}
                      <div className={`rounded-xl p-5 h-full ${isDark ? "bg-zinc-800/50" : "bg-white border border-gray-200"}`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>{selectedMode} mode</h3>
                        
                        {/* Uses Tags */}
                        <div className="mb-5">
                          <p className={`text-xs font-medium uppercase tracking-wide mb-2 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>USES</p>
                          <div className="flex flex-wrap gap-2">
                            {currentModeInfo.uses.map((use, i) => (
                              <span key={i} className={`px-3 py-1 rounded-full text-xs ${isDark ? "bg-zinc-700 text-zinc-300" : "bg-gray-100 text-gray-700"}`}>{use}</span>
                            ))}
                          </div>
                        </div>

                        {/* Example */}
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className={`text-xs font-medium mb-1 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Input Text</p>
                            <p className={`text-sm ${isDark ? "text-zinc-300" : "text-gray-700"}`}>{currentModeInfo.inputText}</p>
                          </div>
                          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${isDark ? "text-zinc-600" : "text-gray-400"}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs font-medium mb-1 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Paraphrased Text</p>
                            <p className={`text-sm ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
                              {renderHighlightedText(currentModeInfo.outputText, currentModeInfo.highlightWords)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {isProcessing && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-72 flex flex-col items-center justify-center gap-3"
                    >
                      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <p className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Paraphrasing your text...</p>
                    </motion.div>
                  )}
                  {outputText && !isProcessing && (
                    <motion.div
                      key="output"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`h-72 overflow-y-auto text-sm leading-relaxed ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {outputText}
                    </motion.div>
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
