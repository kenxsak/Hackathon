import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Paperclip, ChevronDown, Image as ImageIcon } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

const styles = ["All images", "3D Scene", "Anime", "Artistic", "Cinematic", "Digital Art", "Fantasy World", "Prototyping & Mockup", "Realism"];
const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

export default function AIImageGenerator() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("All images");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showRatioDropdown, setShowRatioDropdown] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock generated images (placeholder URLs)
    setGeneratedImages([
      `https://picsum.photos/seed/${Date.now()}/400/400`,
      `https://picsum.photos/seed/${Date.now() + 1}/400/400`,
    ]);
    setIsGenerating(false);
  };

  return (
    <DashboardLayout title="AI Image Generator">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 mb-4">
            Beta
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Free AI Image Generator</h1>
          <p className={`${isDark ? "text-zinc-400" : "text-gray-600"}`}>Your AI-powered image generator for personal or professional use.</p>
        </div>

        {/* Input Card */}
        <div className={`max-w-3xl mx-auto rounded-2xl border p-6 mb-8 ${isDark ? "bg-[#111] border-zinc-800" : "bg-white border-gray-200"}`}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like to create?"
            className={`w-full text-lg bg-transparent focus:outline-none mb-6 ${isDark ? "text-white placeholder-zinc-500" : "text-gray-900 placeholder-gray-400"}`}
          />
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button className={`p-2 rounded-lg ${isDark ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-gray-100 text-gray-600"}`}>
                <Paperclip className="w-5 h-5" />
              </button>
              
              {/* Style Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowStyleDropdown(!showStyleDropdown); setShowRatioDropdown(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                >
                  Style <ChevronDown className="w-4 h-4" />
                </button>
                {showStyleDropdown && (
                  <div className={`absolute top-full left-0 mt-2 w-48 rounded-lg border shadow-lg z-10 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
                    {styles.map((style) => (
                      <button
                        key={style}
                        onClick={() => { setSelectedStyle(style); setShowStyleDropdown(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedStyle === style ? "text-emerald-400" : ""} ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Aspect Ratio Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowRatioDropdown(!showRatioDropdown); setShowStyleDropdown(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                >
                  Aspect Ratio <ChevronDown className="w-4 h-4" />
                </button>
                {showRatioDropdown && (
                  <div className={`absolute top-full left-0 mt-2 w-32 rounded-lg border shadow-lg z-10 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => { setAspectRatio(ratio); setShowRatioDropdown(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${aspectRatio === ratio ? "text-emerald-400" : ""} ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${prompt.trim() && !isGenerating ? "bg-emerald-500 hover:bg-emerald-600 text-white" : (isDark ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed")}`}
            >
              Generate <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className={`text-xs mt-4 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
            Please ensure you comply with our Copyright Policy and Community Guidelines.
          </p>
        </div>

        {/* Generated Images / Gallery */}
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className={`${isDark ? "text-zinc-400" : "text-gray-600"}`}>Generating your images...</p>
          </div>
        ) : generatedImages.length > 0 ? (
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Generated Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generatedImages.map((img, i) => (
                <div key={i} className={`aspect-square rounded-xl overflow-hidden border ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                  <img src={img} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className={`text-xl font-semibold mb-4 text-center ${isDark ? "text-white" : "text-gray-900"}`}>QuillBot AI Generated Images</h2>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${selectedStyle === style ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : (isDark ? "border-zinc-700 text-zinc-400 hover:border-zinc-600" : "border-gray-300 text-gray-600 hover:border-gray-400")}`}
                >
                  {style}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className={`aspect-square rounded-xl overflow-hidden border flex items-center justify-center ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-gray-100 border-gray-200"}`}>
                  <ImageIcon className={`w-12 h-12 ${isDark ? "text-zinc-700" : "text-gray-300"}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
