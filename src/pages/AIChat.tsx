import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Upload, Globe, Lightbulb, FileText, HelpCircle, Search } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  { icon: Lightbulb, label: "Brainstorm ideas" },
  { icon: FileText, label: "Generate a product description" },
  { icon: HelpCircle, label: "Generate interview questions" },
  { icon: Search, label: "Review my resume" },
];

export default function AIChat() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [webSearch, setWebSearch] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = inputText.trim();
    setInputText("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = [
      "I'd be happy to help you with that! Let me think about this...",
      "That's a great question! Here's what I can tell you...",
      "Based on my analysis, here are some insights...",
    ];
    
    setMessages(prev => [...prev, { 
      role: "assistant", 
      content: responses[Math.floor(Math.random() * responses.length)] + "\n\nThis is a demo response. In production, this would connect to an AI backend to provide real assistance with brainstorming, writing, studying, and more."
    }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout title="AI Chat">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-180px)] flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className={`text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>How can I help?</h2>
            <p className={`text-center mb-8 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
              Need help with brainstorming, writing, or studying? Ask QuillBot's AI Chat anything!
            </p>
            
            {/* Input Box */}
            <div className={`w-full max-w-2xl rounded-2xl border p-4 ${isDark ? "bg-[#111] border-zinc-800" : "bg-white border-gray-200"}`}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything"
                className={`w-full text-lg bg-transparent focus:outline-none mb-4 ${isDark ? "text-white placeholder-zinc-500" : "text-gray-900 placeholder-gray-400"}`}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWebSearch(!webSearch)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${webSearch ? "bg-emerald-500/20 text-emerald-400" : (isDark ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-600")}`}
                  >
                    <Globe className="w-4 h-4" />Web search
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${isDark ? "bg-zinc-800 text-zinc-400 hover:text-white" : "bg-gray-100 text-gray-600 hover:text-gray-900"}`}>
                    <Upload className="w-4 h-4" />Upload files
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-full transition-colors ${inputText.trim() ? "bg-emerald-500 text-white hover:bg-emerald-600" : (isDark ? "bg-zinc-800 text-zinc-600" : "bg-gray-200 text-gray-400")}`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Suggestions */}
            <div className="mt-6">
              <p className={`text-sm mb-3 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Get started with a use case:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(item.label)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors ${isDark ? "border-zinc-800 text-zinc-300 hover:bg-zinc-800" : "border-gray-200 text-gray-700 hover:bg-gray-100"}`}
                  >
                    <item.icon className="w-4 h-4" />{item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-emerald-500 text-white" : (isDark ? "bg-zinc-800 text-white" : "bg-gray-100 text-gray-900")}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl px-4 py-3 ${isDark ? "bg-zinc-800" : "bg-gray-100"}`}>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`border-t pt-4 ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
              <div className={`flex items-center gap-3 rounded-xl border p-3 ${isDark ? "bg-[#111] border-zinc-800" : "bg-white border-gray-200"}`}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className={`flex-1 bg-transparent focus:outline-none ${isDark ? "text-white placeholder-zinc-500" : "text-gray-900 placeholder-gray-400"}`}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || isLoading}
                  className={`p-2 rounded-full transition-colors ${inputText.trim() && !isLoading ? "bg-emerald-500 text-white hover:bg-emerald-600" : (isDark ? "bg-zinc-800 text-zinc-600" : "bg-gray-200 text-gray-400")}`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
