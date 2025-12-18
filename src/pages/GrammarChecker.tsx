import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Upload, ClipboardPaste, ChevronDown, Bold, Italic, Underline, Link, List, ListOrdered, Undo, Redo, CheckCircle2, Check, Search } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";
import { ALL_LANGUAGES } from "../constants/languages";
import { ScrollArea } from "../components/ui/scroll-area";

const writingTasks = ["Research Paper", "Business Email", "Business Memo", "Marketing Copy", "Essay", "Blog Post", "Cover Letter", "Resume", "Social Media", "Creative Writing", "Technical Documentation", "Academic Paper"];

export default function GrammarChecker() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [inputText, setInputText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [corrections, setCorrections] = useState<{ type: string; count: number }[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");
  const [selectedTask, setSelectedTask] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const languageBtnRef = useRef<HTMLButtonElement>(null);
  const taskBtnRef = useRef<HTMLButtonElement>(null);
  
  const filteredTasks = writingTasks.filter(task => task.toLowerCase().includes(taskSearch.toLowerCase()));

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowLanguageDropdown(false);
        setShowTaskDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

    try {
      const response = await fetch("http://localhost:3001/api/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Grammar check failed");
      }

      // Parse corrections from API response
      const grammarCount = data.corrections?.filter((c: { type: string }) => c.type === "grammar").length || 0;
      const spellingCount = data.corrections?.filter((c: { type: string }) => c.type === "spelling").length || 0;
      const punctuationCount = data.corrections?.filter((c: { type: string }) => c.type === "punctuation").length || 0;

      setCorrections([
        { type: "Grammar", count: grammarCount },
        { type: "Spelling", count: spellingCount },
        { type: "Punctuation", count: punctuationCount },
      ]);
      setRecommendations(
        data.corrections?.slice(0, 3).map((c: { explanation: string }) => c.explanation) || []
      );
    } catch (err) {
      console.error("Grammar check error:", err);
      setCorrections([]);
      setRecommendations(["Error checking grammar. Please try again."]);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <DashboardLayout title="Grammar Checker">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Top Bar */}
        <div className={`flex items-center justify-between mb-6 pb-4 border-b ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <div className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Untitled document</div>
          <div className="flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative dropdown-container">
              <button ref={languageBtnRef} onClick={() => { setShowLanguageDropdown(!showLanguageDropdown); setShowTaskDropdown(false); }} className={`flex items-center gap-2 text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
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
            {/* Writing Task Dropdown */}
            <div className="relative dropdown-container">
              <button ref={taskBtnRef} onClick={() => { setShowTaskDropdown(!showTaskDropdown); setShowLanguageDropdown(false); }} className={`flex items-center gap-2 text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                <span>{selectedTask || "Enter writing task"}</span><ChevronDown className={`w-4 h-4 transition-transform ${showTaskDropdown ? "rotate-180" : ""}`} />
              </button>
              {showTaskDropdown && (
                <div className={`absolute top-full right-0 mt-2 w-80 rounded-xl border shadow-xl z-50 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
                  <div className="p-4">
                    <h3 className={`text-base font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Set a task for tailored suggestions</h3>
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 ${isDark ? "border-emerald-500/50 bg-zinc-800" : "border-emerald-500 bg-gray-50"}`}>
                      <input type="text" value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} placeholder="What are you working on?" className={`flex-1 text-sm bg-transparent focus:outline-none ${isDark ? "text-white placeholder-zinc-500" : "text-gray-900 placeholder-gray-400"}`} />
                      <Search className={`w-4 h-4 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
                    </div>
                  </div>
                  <div className={`border-t ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                    <p className={`px-4 py-2 text-xs font-medium ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Suggested</p>
                    <ScrollArea className="h-56" data-lenis-prevent>
                      <div className="px-1 pb-2">
                        {filteredTasks.map((task) => (
                          <button key={task} onClick={() => { setSelectedTask(task); setShowTaskDropdown(false); setTaskSearch(""); }} className={`w-full text-left px-3 py-2.5 text-sm transition-colors rounded-lg ${selectedTask === task ? "text-emerald-400" : (isDark ? "text-zinc-300" : "text-gray-700")} ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}>
                            {task}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
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
