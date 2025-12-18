import { useState } from "react";
import { motion } from "motion/react";
import { Search, Upload, Edit3, ChevronDown, Copy, Check, Plus, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

const citationStyles = ["APA 7th edition", "MLA 9th edition", "Chicago 17th edition", "Harvard", "IEEE", "Vancouver", "AMA 11th edition"];

type Citation = { id: string; title: string; authors: string; year: string; source: string; formatted: string };

export default function CitationGenerator() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [citationStyle, setCitationStyle] = useState("APA 7th edition");
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualCitation, setManualCitation] = useState({ title: "", authors: "", year: "", source: "", url: "" });

  const handleSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCitation: Citation = {
      id: Date.now().toString(),
      title: searchQuery,
      authors: "Smith, J., & Johnson, M.",
      year: "2024",
      source: "Journal of Example Studies",
      formatted: `Smith, J., & Johnson, M. (2024). ${searchQuery}. Journal of Example Studies, 15(3), 123-145.`
    };
    setCitations(prev => [...prev, newCitation]);
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setCitations(prev => prev.filter(c => c.id !== id));
  };

  const handleManualAdd = () => {
    if (!manualCitation.title.trim()) return;
    const newCitation: Citation = {
      id: Date.now().toString(),
      ...manualCitation,
      formatted: `${manualCitation.authors} (${manualCitation.year}). ${manualCitation.title}. ${manualCitation.source}.`
    };
    setCitations(prev => [...prev, newCitation]);
    setManualCitation({ title: "", authors: "", year: "", source: "", url: "" });
    setShowManualForm(false);
  };

  return (
    <DashboardLayout title="Citation Generator">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Free Citation Generator</h1>
          <p className={`${isDark ? "text-zinc-400" : "text-gray-600"}`}>
            Instantly create, edit, and save citations in over 1,000 different styles, for free and without limits.
          </p>
        </div>

        {/* Citation Style Selector */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <button onClick={() => setShowStyleDropdown(!showStyleDropdown)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              {citationStyle} <ChevronDown className="w-4 h-4" />
            </button>
            {showStyleDropdown && (
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-lg border shadow-lg z-10 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
                {citationStyles.map((style) => (
                  <button key={style} onClick={() => { setCitationStyle(style); setShowStyleDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm ${citationStyle === style ? "text-emerald-400" : ""} ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}>{style}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Box */}
        <div className={`max-w-2xl mx-auto rounded-2xl border p-4 mb-6 ${isDark ? "bg-[#111] border-zinc-800" : "bg-white border-gray-200"}`}>
          <p className={`text-xs mb-2 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Cite webpages, books, articles, and more</p>
          <div className="flex items-center gap-3">
            <Search className={`w-5 h-5 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by title, URL, DOI, ISBN, or keywords"
              className={`flex-1 bg-transparent focus:outline-none ${isDark ? "text-white placeholder-zinc-500" : "text-gray-900 placeholder-gray-400"}`}
            />
            <button onClick={handleSearch} disabled={!searchQuery.trim() || isSearching} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${searchQuery.trim() && !isSearching ? "bg-emerald-500 hover:bg-emerald-600 text-white" : (isDark ? "bg-zinc-800 text-zinc-500" : "bg-gray-200 text-gray-400")}`}>
              {isSearching ? "..." : "Cite"}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button className={`flex items-center gap-2 text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
            <Upload className="w-4 h-4" />Upload PDF
          </button>
          <button onClick={() => setShowManualForm(!showManualForm)} className={`flex items-center gap-2 text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
            <Edit3 className="w-4 h-4" />Cite manually
          </button>
        </div>

        {/* Manual Citation Form */}
        {showManualForm && (
          <div className={`max-w-2xl mx-auto rounded-2xl border p-6 mb-8 ${isDark ? "bg-[#111] border-zinc-800" : "bg-white border-gray-200"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Add Citation Manually</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Title *" value={manualCitation.title} onChange={(e) => setManualCitation(prev => ({ ...prev, title: e.target.value }))} className={`col-span-2 px-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:border-emerald-500 ${isDark ? "border-zinc-700 text-white placeholder-zinc-500" : "border-gray-300 text-gray-900 placeholder-gray-400"}`} />
              <input type="text" placeholder="Authors" value={manualCitation.authors} onChange={(e) => setManualCitation(prev => ({ ...prev, authors: e.target.value }))} className={`px-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:border-emerald-500 ${isDark ? "border-zinc-700 text-white placeholder-zinc-500" : "border-gray-300 text-gray-900 placeholder-gray-400"}`} />
              <input type="text" placeholder="Year" value={manualCitation.year} onChange={(e) => setManualCitation(prev => ({ ...prev, year: e.target.value }))} className={`px-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:border-emerald-500 ${isDark ? "border-zinc-700 text-white placeholder-zinc-500" : "border-gray-300 text-gray-900 placeholder-gray-400"}`} />
              <input type="text" placeholder="Source/Journal" value={manualCitation.source} onChange={(e) => setManualCitation(prev => ({ ...prev, source: e.target.value }))} className={`px-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:border-emerald-500 ${isDark ? "border-zinc-700 text-white placeholder-zinc-500" : "border-gray-300 text-gray-900 placeholder-gray-400"}`} />
              <input type="text" placeholder="URL (optional)" value={manualCitation.url} onChange={(e) => setManualCitation(prev => ({ ...prev, url: e.target.value }))} className={`px-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:border-emerald-500 ${isDark ? "border-zinc-700 text-white placeholder-zinc-500" : "border-gray-300 text-gray-900 placeholder-gray-400"}`} />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowManualForm(false)} className={`px-4 py-2 rounded-lg text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>Cancel</button>
              <button onClick={handleManualAdd} className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2"><Plus className="w-4 h-4" />Add Citation</button>
            </div>
          </div>
        )}

        {/* Citations List */}
        {citations.length > 0 && (
          <div className={`max-w-2xl mx-auto rounded-2xl border overflow-hidden ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
            <div className={`px-6 py-4 border-b ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-gray-50 border-gray-200"}`}>
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Your Citations ({citations.length})</h3>
            </div>
            <div className={`divide-y ${isDark ? "divide-zinc-800" : "divide-gray-200"}`}>
              {citations.map((citation) => (
                <div key={citation.id} className={`p-4 ${isDark ? "bg-[#111]" : "bg-white"}`}>
                  <p className={`text-sm mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{citation.formatted}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopy(citation.id, citation.formatted)} className={`flex items-center gap-1 px-3 py-1 rounded text-xs ${isDark ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                      {copiedId === citation.id ? <><Check className="w-3 h-3 text-emerald-500" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
                    </button>
                    <button onClick={() => handleDelete(citation.id)} className={`flex items-center gap-1 px-3 py-1 rounded text-xs ${isDark ? "bg-zinc-800 text-red-400 hover:bg-zinc-700" : "bg-gray-100 text-red-600 hover:bg-gray-200"}`}>
                      <Trash2 className="w-3 h-3" />Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
