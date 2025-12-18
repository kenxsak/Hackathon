import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, ClipboardPaste, ChevronDown, Bold, Italic, Underline, Link, List, ListOrdered, Undo, Redo, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

export default function GrammarChecker() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [inputText, setInputText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [corrections, setCorrections] = useState<{ type: string; count: number }[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

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

  const handleCheck = async () => {
    if (!inputText.trim()) return;
    setIsChecking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Mock grammar check results
    setCorrections([
      { type: "Grammar", count: Math.floor(Math.random() * 5) },
      { type: "Spelling", count: Math.floor(Math.random() * 3) },
      { type: "Punctuation", count: Math.floor(Math.random() * 4) },
    ]);
    setRecommendations([
      "Consider using active voice for clearer sentences",
      "Some sentences could be more concise",
    ]);
    setIsChecking(false);
  };

  return (
    <DashboardLayout title="Grammar Checker">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Top Bar */}
        <div className={`flex items-center justify-between mb-6 pb-4 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <div className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Untitled document</div>
          <div className="flex items-center gap-4">
            <button className={`flex items-center gap-2 text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
              <span>English (US)</span><ChevronDown className="w-4 h-4" />
            </button>
            <button className={`flex items-center gap-2 text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
              <span>Enter writing task</span><ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Section */}
          <div className={`lg:col-span-2 border rounded-2xl overflow-hidden ${isDark ? "border-zinc-800 bg-[#111]" : "border-gray-200 bg-white"}`}>
            {/* Action Buttons */}
            <div className={`px-6 py-4 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
              <div className="flex items-center gap-3">
                <button onClick={handlePaste} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500/10" : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"}`}><ClipboardPaste className="w-4 h-4" />Paste text</button>
                <input ref={fileInputRef} type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}><Upload className="w-4 h-4" />Upload document</button>
              </div>
            </div>

            {/* Text Editor */}
            <div className="p-6">
              <textarea ref={textareaRef} value={inputText} onChange={(e) => { setInputText(e.target.value); if (e.target.value) handleCheck(); }} placeholder="Add text or upload doc" className={`w-full h-80 resize-none text-sm focus:outline-none ${isDark ? "bg-transparent text-white placeholder-zinc-500" : "bg-transparent text-gray-900 placeholder-gray-400"}`} />
            </div>

            {/* Toolbar */}
            <div className={`px-6 py-3 border-t flex items-center justify-between ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
              <div className="flex items-center gap-1">
                <button className={`p-2 rounded ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}><Bold className="w-4 h-4" /></button>
                <button className={`p-2 rounded ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}><Italic className="w-4 h-4" /></button>
                <button className={`p-2 rounded ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}><Underline className="w-4 h-4" /></button>
                <button className={`p-2 rounded ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}><Link className="w-4 h-4" /></button>
                <div className={`w-px h-5 mx-2 ${isDark ? "bg-zinc-700" : "bg-gray-300"}`} />
                <button className={`p-2 rounded ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}><List className="w-4 h-4" /></button>
                <button className={`p-2 rounded ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}><ListOrdered className="w-4 h-4" /></button>
                <div className={`w-px h-5 mx-2 ${isDark ? "bg-zinc-700" : "bg-gray-300"}`} />
                <button className={`p-2 rounded ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}><Undo className="w-4 h-4" /></button>
                <button className={`p-2 rounded ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}><Redo className="w-4 h-4" /></button>
              </div>
              <div className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>{wordCount} words</div>
            </div>
          </div>

          {/* Results Panel */}
          <div className={`border rounded-2xl overflow-hidden ${isDark ? "border-zinc-800 bg-[#111]" : "border-gray-200 bg-white"}`}>
            {/* Tabs */}
            <div className={`flex border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
              <button className={`flex-1 px-4 py-3 text-sm font-medium ${isDark ? "text-white border-b-2 border-emerald-400" : "text-gray-900 border-b-2 border-emerald-600"}`}>All {corrections.reduce((a, b) => a + b.count, 0)}</button>
              <button className={`flex-1 px-4 py-3 text-sm font-medium ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Grammar {corrections.find(c => c.type === "Grammar")?.count || 0}</button>
              <button className={`flex-1 px-4 py-3 text-sm font-medium ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Recommendations {recommendations.length}</button>
            </div>

            <div className="p-6">
              {!inputText && !isChecking && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className={`w-16 h-16 mb-4 ${isDark ? "text-zinc-700" : "text-gray-300"}`} />
                  <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Nothing to check yet!</p>
                  <p className={`text-sm mt-1 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Get started by adding text to the editor</p>
                </div>
              )}
              {isChecking && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Checking grammar...</p>
                </div>
              )}
              {inputText && !isChecking && corrections.length > 0 && (
                <div className="space-y-4">
                  {corrections.map((c, i) => (
                    <div key={i} className={`p-3 rounded-lg ${isDark ? "bg-zinc-800" : "bg-gray-100"}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{c.type}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${c.count > 0 ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>{c.count} issues</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={`px-6 py-4 border-t ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
              <p className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Waiting for words...</p>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
