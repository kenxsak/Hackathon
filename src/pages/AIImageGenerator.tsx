import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Download, RefreshCw, Wand2, Image as ImageIcon, Loader2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

const styles = [
  { id: "default", label: "Default", prompt: "" },
  { id: "realistic", label: "Realistic", prompt: ", ultra realistic, 8k, high detail photography" },
  { id: "anime", label: "Anime", prompt: ", anime style, studio ghibli, vibrant colors" },
  { id: "3d", label: "3D Render", prompt: ", 3d render, octane render, cinema 4d, blender" },
  { id: "digital", label: "Digital Art", prompt: ", digital art, artstation, concept art" },
  { id: "oil", label: "Oil Painting", prompt: ", oil painting, classical art, renaissance style" },
  { id: "watercolor", label: "Watercolor", prompt: ", watercolor painting, soft colors, artistic" },
  { id: "pixel", label: "Pixel Art", prompt: ", pixel art, 16-bit, retro game style" },
];

const aspectRatios = [
  { id: "1:1", label: "Square", width: 1024, height: 1024 },
  { id: "16:9", label: "Landscape", width: 1024, height: 576 },
  { id: "9:16", label: "Portrait", width: 576, height: 1024 },
  { id: "4:3", label: "Standard", width: 1024, height: 768 },
];

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export default function AIImageGenerator() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("default");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = () => {
      // Close any open state if needed
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const style = styles.find((s) => s.id === selectedStyle);
      const ratio = aspectRatios.find((r) => r.id === selectedRatio);
      const fullPrompt = encodeURIComponent(prompt.trim() + (style?.prompt || ""));
      
      // Pollinations.ai free API - generates image directly via URL
      const imageUrl = `https://image.pollinations.ai/prompt/${fullPrompt}?width=${ratio?.width || 1024}&height=${ratio?.height || 1024}&seed=${Date.now()}&nologo=true`;

      // Pre-load the image to ensure it's generated
      const img = new Image();
      img.onload = () => {
        setGeneratedImages((prev) => [
          { url: imageUrl, prompt: prompt.trim(), timestamp: Date.now() },
          ...prev,
        ]);
        setIsGenerating(false);
      };
      img.onerror = () => {
        setError("Failed to generate image. Please try again.");
        setIsGenerating(false);
      };
      img.src = imageUrl;
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to generate image. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <DashboardLayout title="AI Image Generator">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4"
          >
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${isDark ? "bg-purple-500/10" : "bg-purple-50"}`}>
              <Wand2 className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
            </div>
          </motion.div>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            AI Image Generator
          </h1>
          <p className={`max-w-lg mx-auto ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
            Transform your ideas into stunning images. Just describe what you want to create.
          </p>
        </div>

        {/* Main Input Card */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className={`rounded-2xl overflow-hidden shadow-xl ${isDark ? "bg-zinc-900" : "bg-white border border-gray-200"}`}>
            {/* Prompt Input */}
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isDark ? "bg-purple-500/10" : "bg-purple-50"}`}>
                  <Sparkles className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the image you want to create..."
                  rows={2}
                  className={`flex-1 resize-none bg-transparent focus:outline-none text-base leading-relaxed ${isDark ? "text-white placeholder-zinc-500" : "text-gray-900 placeholder-gray-400"}`}
                />
              </div>
            </div>

            {/* Options */}
            <div className={`px-5 py-4 ${isDark ? "bg-zinc-800/50" : "bg-gray-50"}`}>
              {/* Style Selection */}
              <div className="mb-4">
                <p className={`text-xs font-medium mb-2 ${isDark ? "text-zinc-400" : "text-gray-500"}`}>STYLE</p>
                <div className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedStyle === style.id
                          ? "bg-purple-500 text-white"
                          : isDark
                          ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="mb-4">
                <p className={`text-xs font-medium mb-2 ${isDark ? "text-zinc-400" : "text-gray-500"}`}>ASPECT RATIO</p>
                <div className="flex flex-wrap gap-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setSelectedRatio(ratio.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedRatio === ratio.id
                          ? "bg-purple-500 text-white"
                          : isDark
                          ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {ratio.label} ({ratio.id})
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                  prompt.trim() && !isGenerating
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                    : isDark
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Image
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-xl text-center ${isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"}`}
            >
              {error}
            </motion.div>
          )}
        </div>

        {/* Generated Images Gallery */}
        <AnimatePresence>
          {generatedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Generated Images
                </h2>
                <button
                  onClick={() => setGeneratedImages([])}
                  className={`text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map((image, index) => (
                  <motion.div
                    key={image.timestamp}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group relative rounded-2xl overflow-hidden ${isDark ? "bg-zinc-900" : "bg-white border border-gray-200"}`}
                  >
                    <div className="aspect-square">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm mb-3 line-clamp-2">{image.prompt}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(image.url, `retext-${image.timestamp}.png`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm backdrop-blur-sm transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button
                            onClick={() => setPrompt(image.prompt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm backdrop-blur-sm transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Remix
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {generatedImages.length === 0 && !isGenerating && (
          <div className="max-w-3xl mx-auto">
            <div className={`rounded-2xl p-12 text-center ${isDark ? "bg-zinc-900/50" : "bg-gray-50"}`}>
              <ImageIcon className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-zinc-700" : "text-gray-300"}`} />
              <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                No images generated yet
              </h3>
              <p className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                Enter a prompt above and click Generate to create your first image
              </p>
              
              {/* Example Prompts */}
              <div className="mt-6">
                <p className={`text-xs font-medium mb-3 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                  TRY THESE PROMPTS
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "A magical forest with glowing mushrooms",
                    "Futuristic city at sunset",
                    "Cute robot playing guitar",
                    "Mountain landscape with northern lights",
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(example)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        isDark
                          ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="max-w-3xl mx-auto">
            <div className={`rounded-2xl p-12 text-center ${isDark ? "bg-zinc-900/50" : "bg-gray-50"}`}>
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                <Wand2 className={`absolute inset-0 m-auto w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                Creating your masterpiece...
              </h3>
              <p className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                This usually takes 10-20 seconds
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
