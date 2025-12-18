import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown, Sparkles, Volume2, Copy, Check } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";
import { TRANSLATE_SOURCE_LANGUAGES, TRANSLATE_TARGET_LANGUAGES } from "../constants/languages";
import { ScrollArea } from "../components/ui/scroll-area";

const formalities = ["Default", "Formal", "Informal"];

export default function Translate() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLang, setSourceLang] = useState("Auto Detect");
  const [targetLang, setTargetLang] = useState("English (US)");
  const [formality, setFormality] = useState("Default");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [showFormalityDropdown, setShowFormalityDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowSourceDropdown(false);
        setShowTargetDropdown(false);
        setShowFormalityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim() || isTranslating) return;
    setIsTranslating(true);
    setOutputText("");

    try {
      const response = await fetch("http://localhost:3001/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: inputText, 
          sourceLang, 
          targetLang 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Translation failed");
      }

      setOutputText(data.translated_text || inputText);
    } catch (err) {
      console.error("Translation error:", err);
      setOutputText("Error: " + (err instanceof Error ? err.message : "Translation failed"));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapLanguages = () => {
    if (sourceLang !== "Auto Detect") {
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
    }
  };

  return (
    <DashboardLayout title="Translate">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Language Selectors */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* Source Language */}
          <div className="relative dropdown-container">
            <button onClick={() => { setShowSourceDropdown(!showSourceDropdown); setShowTargetDropdown(false); setShowFormalityDropdown(false); }} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              <Sparkles className="w-4 h-4 text-emerald-400" />{sourceLang} <ChevronDown className="w-4 h-4" />
            </button>
            {showSourceDropdown && (
              <div className={`absolute top-full left-0 mt-2 w-56 rounded-xl border shadow-xl z-50 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
                <ScrollArea className="h-72" data-lenis-prevent>
                  <div className="p-1">
                    {TRANSLATE_SOURCE_LANGUAGES.map((lang) => (
                      <button key={lang} onClick={() => { setSourceLang(lang); setShowSourceDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between rounded-lg ${sourceLang === lang ? "text-emerald-400" : ""} ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}>
                        {lang}
                        {sourceLang === lang && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          <button onClick={swapLanguages} className={`p-2 rounded-full ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Target Language */}
          <div className="relative dropdown-container">
            <button onClick={() => { setShowTargetDropdown(!showTargetDropdown); setShowSourceDropdown(false); setShowFormalityDropdown(false); }} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              <Sparkles className="w-4 h-4 text-emerald-400" />{targetLang} <ChevronDown className="w-4 h-4" />
            </button>
            {showTargetDropdown && (
              <div className={`absolute top-full left-0 mt-2 w-56 rounded-xl border shadow-xl z-50 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
                <ScrollArea className="h-72" data-lenis-prevent>
                  <div className="p-1">
                    {TRANSLATE_TARGET_LANGUAGES.map((lang) => (
                      <button key={lang} onClick={() => { setTargetLang(lang); setShowTargetDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between rounded-lg ${targetLang === lang ? "text-emerald-400" : ""} ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}>
                        {lang}
                        {targetLang === lang && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Formality */}
          <div className="relative dropdown-container">
            <button onClick={() => { setShowFormalityDropdown(!showFormalityDropdown); setShowSourceDropdown(false); setShowTargetDropdown(false); }} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              <Sparkles className="w-4 h-4" />Formality <ChevronDown className="w-4 h-4" />
            </button>
            {showFormalityDropdown && (
              <div className={`absolute top-full right-0 mt-2 w-32 rounded-lg border shadow-lg z-50 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
                {formalities.map((f) => (
                  <button key={f} onClick={() => { setFormality(f); setShowFormalityDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm ${formality === f ? "text-emerald-400" : ""} ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}>{f}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Translation Box */}
        <div className={`border rounded-2xl overflow-hidden ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Input */}
            <div className={`p-6 ${isDark ? "bg-[#111]" : "bg-white"}`}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text"
                className={`w-full h-64 resize-none bg-transparent focus:outline-none text-lg ${isDark ? "text-white placeholder-zinc-500" : "text-gray-900 placeholder-gray-400"}`}
              />
              <div className="flex items-center justify-between mt-4">
                <button className={`p-2 rounded-lg ${isDark ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-gray-100 text-gray-600"}`}>
                  <Volume2 className="w-5 h-5" />
                </button>
                <span className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>{inputText.length} characters</span>
              </div>
            </div>

            {/* Output */}
            <div className={`p-6 ${isDark ? "bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-zinc-800" : "bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200"}`}>
              {isTranslating ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : outputText ? (
                <div className={`h-64 text-lg ${isDark ? "text-white" : "text-gray-900"}`}>{outputText}</div>
              ) : (
                <div className={`h-64 flex items-center justify-center text-lg ${isDark ? "text-zinc-500" : "text-gray-400"}`}>Translation will appear here</div>
              )}
              {outputText && (
                <div className="flex items-center justify-between mt-4">
                  <button className={`p-2 rounded-lg ${isDark ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-gray-100 text-gray-600"}`}>
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button onClick={handleCopy} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${isDark ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-gray-100 text-gray-600"}`}>
                    {copied ? <><Check className="w-4 h-4 text-emerald-500" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Translate Button */}
        <div className="flex justify-center mt-6">
          <button onClick={handleTranslate} disabled={!inputText.trim() || isTranslating} className={`flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold transition-all ${inputText.trim() && !isTranslating ? "bg-emerald-500 hover:bg-emerald-600 text-white" : (isDark ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed")}`}>
            <ArrowRight className="w-4 h-4" />Translate
          </button>
        </div>

        {/* Sign up banner */}
        <div className={`mt-8 p-4 rounded-xl text-center ${isDark ? "bg-zinc-900 border border-zinc-800" : "bg-gray-100 border border-gray-200"}`}>
          <p className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
            Get cultural tips with every translation. Sign in to make sure your words resonate, not just translate.
            <button className="ml-2 text-emerald-400 hover:underline">Sign up</button>
          </p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
