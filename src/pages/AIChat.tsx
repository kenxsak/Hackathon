import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Paperclip, X, FileText } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

type Message = { role: "user" | "assistant"; content: string; file?: { name: string; content: string } };

// Website Logo Icon
const LogoIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10.5 12.75H3L6 9.75H9L15.75 3H20.25L10.5 12.75Z" fill="currentColor" />
    <path d="M11.25 15V13.5L21 3.75V5.25L11.25 15Z" fill="currentColor" />
    <path d="M11.25 18V16.5L21 6.75V8.25L11.25 18Z" fill="currentColor" />
    <path d="M11.25 21V19.5L15 15.75V17.25L11.25 21Z" fill="currentColor" />
  </svg>
);

const suggestions = [
  "Explain quantum computing in simple terms",
  "Write a poem about the ocean",
  "Help me brainstorm business ideas",
  "What's the difference between AI and ML?",
];

export default function AIChat() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; content: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + "px";
    }
  }, [inputText]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedFile({
          name: file.name,
          content: event.target?.result as string,
        });
      };
      reader.readAsText(file);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !attachedFile) || isLoading) return;

    const userMessage = inputText.trim();
    const fileData = attachedFile;
    setInputText("");
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    const messageContent = fileData 
      ? `${userMessage}\n\n[Attached file: ${fileData.name}]\n${fileData.content.substring(0, 2000)}${fileData.content.length > 2000 ? '...' : ''}`
      : userMessage;

    setMessages((prev) => [...prev, { role: "user", content: userMessage || `Uploaded: ${fileData?.name}`, file: fileData || undefined }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Chat failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "I couldn't generate a response. Please try again.",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout title="AI Chat">
      <div className="h-[calc(100vh-140px)] flex flex-col">
        {messages.length === 0 ? (
          /* Empty State - Centered */
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${isDark ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                  <LogoIcon className={`w-8 h-8 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`text-3xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                How can I help you today?
              </motion.h1>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`mb-8 ${isDark ? "text-zinc-400" : "text-gray-500"}`}
              >
                Ask me anything. I'm here to help with writing, analysis, coding, and more.
              </motion.p>

              {/* Input Box - Clean Design */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`rounded-2xl shadow-lg overflow-hidden ${isDark ? "bg-zinc-900" : "bg-white border border-gray-200"}`}
              >
                {/* Attached File Preview */}
                {attachedFile && (
                  <div className={`px-4 pt-3 ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-700"}`}>
                      <FileText className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{attachedFile.name}</span>
                      <button onClick={removeFile} className={`p-0.5 rounded hover:bg-zinc-700 ${isDark ? "text-zinc-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="p-4">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message ReText..."
                    rows={1}
                    className={`w-full resize-none bg-transparent focus:outline-none text-base ${isDark ? "text-white placeholder-zinc-500" : "text-gray-900 placeholder-gray-400"}`}
                    style={{ maxHeight: "200px" }}
                  />
                </div>
                <div className={`flex items-center justify-between px-4 py-3 ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md,.json,.js,.ts,.py,.csv,.html,.css"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-2 rounded-lg transition-colors ${isDark ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
                      title="Attach file"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim() && !attachedFile}
                    className={`p-2.5 rounded-xl transition-all ${
                      inputText.trim() || attachedFile
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : isDark
                        ? "bg-zinc-800 text-zinc-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex flex-wrap gap-2 justify-center"
              >
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(suggestion)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      isDark
                        ? "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 border border-zinc-700/50"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        ) : (
          /* Chat Messages - GPT Style Centered */
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {msg.role === "user" ? (
                      /* User Message */
                      <div className="flex justify-end">
                        <div className="max-w-[85%]">
                          {msg.file && (
                            <div className={`mb-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-700"}`}>
                              <FileText className="w-4 h-4" />
                              <span className="truncate max-w-[200px]">{msg.file.name}</span>
                            </div>
                          )}
                          <div className={`rounded-2xl px-4 py-3 ${isDark ? "bg-zinc-800 text-white" : "bg-gray-100 text-gray-900"}`}>
                            <p className="text-[15px] whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Assistant Message - With Logo */
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isDark ? "bg-emerald-500/20" : "bg-emerald-100"}`}>
                          <LogoIcon className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${isDark ? "text-zinc-200" : "text-gray-800"}`}>
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isDark ? "bg-emerald-500/20" : "bg-emerald-100"}`}>
                      <LogoIcon className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                    </div>
                    <div className="flex items-center gap-1 py-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Input - Centered, Clean */}
            <div className={`${isDark ? "bg-[#0a0a0a]" : "bg-gray-50"}`}>
              <div className="max-w-3xl mx-auto px-4 py-4">
                <div className={`rounded-2xl overflow-hidden shadow-lg ${isDark ? "bg-zinc-900" : "bg-white border border-gray-200"}`}>
                  {/* Attached File Preview */}
                  {attachedFile && (
                    <div className={`px-4 pt-3`}>
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-700"}`}>
                        <FileText className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{attachedFile.name}</span>
                        <button onClick={removeFile} className={`p-0.5 rounded ${isDark ? "text-zinc-400 hover:text-white hover:bg-zinc-700" : "text-gray-500 hover:text-gray-700"}`}>
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-end gap-3 p-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isDark ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
                      title="Attach file"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <textarea
                      ref={inputRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Message ReText..."
                      rows={1}
                      className={`flex-1 resize-none bg-transparent focus:outline-none text-[15px] py-2 ${isDark ? "text-white placeholder-zinc-500" : "text-gray-900 placeholder-gray-400"}`}
                      style={{ maxHeight: "200px" }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={(!inputText.trim() && !attachedFile) || isLoading}
                      className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                        (inputText.trim() || attachedFile) && !isLoading
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : isDark
                          ? "bg-zinc-800 text-zinc-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className={`text-xs text-center mt-2 ${isDark ? "text-zinc-600" : "text-gray-400"}`}>
                  ReText can make mistakes. Consider checking important information.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
