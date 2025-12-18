import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, ClipboardPaste, FileText } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

export default function PlagiarismChecker() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [inputText, setInputText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<{ percentage: number; sources: { url: string; match: number }[] } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    await new Promise(resolve => setTimeout(resolve, 2500));
    // Mock plagiarism results
    const plagiarismPercent = Math.floor(Math.random() * 30);
    setResults({
      percentage: plagiarismPercent,
      sources: plagiarismPercent > 0 ? [
        { url: "example.com/article1", match: Math.floor(Math.random() * 15) },
        { url: "wikipedia.org/wiki/topic", match: Math.floor(Math.random() * 10) },
      ] : []
    });
    setIsScanning(false);
  };

  return (
    <DashboardLayout title="Plagiarism Checker">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
          {(isScanning || results) && (
            <div className={`border-t p-6 ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-gray-50"}`}>
              {isScanning && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>Scanning for plagiarism...</p>
                </div>
              )}
              {results && !isScanning && (
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
