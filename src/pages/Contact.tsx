import { useState } from "react";
import { motion } from "motion/react";
import { Send, Mail, MessageSquare, User, CheckCircle, AlertCircle, Loader2, Sparkles, Zap, Shield } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export default function Contact() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          subject: formData.subject || "ReText Contact Form",
          message: formData.message,
          from_name: "ReText Contact Form",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactReasons = [
    { icon: Sparkles, title: "AI Detection Help", desc: "Questions about our  AI detection" },
    { icon: Zap, title: "Feature Requests", desc: "Suggest new tools or improvements" },
    { icon: Shield, title: "Technical Support", desc: "Get help with any issues" },
  ];

  return (
    <DashboardLayout title="Contact Us">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4"
          >
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${isDark ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
              <Mail className={`w-8 h-8 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
            </div>
          </motion.div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            We're Here to Help
          </h2>
          <p className={`text-sm md:text-base max-w-xl mx-auto ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
            Have questions about AI detection, need help with our writing tools, or want to share feedback? Our team is ready to assist you.
          </p>
        </div>

        {/* Quick Contact Reasons */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactReasons.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl text-center ${isDark ? "bg-zinc-900/50 border border-zinc-800" : "bg-gray-50 border border-gray-200"}`}
              >
                <item.icon className={`w-6 h-6 mx-auto mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                <h3 className={`text-sm font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>{item.title}</h3>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-gray-500"}`}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${isDark ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-200"}`}
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <p className={`font-medium ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>Message sent successfully!</p>
                <p className={`text-sm ${isDark ? "text-emerald-400/70" : "text-emerald-600"}`}>We'll get back to you within 24-48 hours.</p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"}`}
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className={`${isDark ? "text-red-400" : "text-red-700"}`}>{errorMessage}</p>
            </motion.div>
          )}

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className={`rounded-2xl border p-6 md:p-8 ${isDark ? "bg-[#111] border-zinc-800" : "bg-white border-gray-200"}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {/* Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
                  Your Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:ring-emerald-500/50 focus:border-emerald-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-emerald-500/50 focus:border-emerald-500"}`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:ring-emerald-500/50 focus:border-emerald-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-emerald-500/50 focus:border-emerald-500"}`}
                  />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-5">
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                data-lenis-prevent
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-zinc-900 border-zinc-800 text-white focus:ring-emerald-500/50 focus:border-emerald-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-emerald-500/50 focus:border-emerald-500"}`}
              >
                <option value="">Select a topic</option>
                <option value="AI Detection Help">AI Detection Help</option>
                <option value="Paraphraser & Humanizer">Paraphraser & Humanizer</option>
                <option value="Grammar & Writing Tools">Grammar & Writing Tools</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Partnership Inquiry">Partnership Inquiry</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
                Message
              </label>
              <div className="relative">
                <MessageSquare className={`absolute left-3 top-3 w-5 h-5 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all resize-none ${isDark ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:ring-emerald-500/50 focus:border-emerald-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-emerald-500/50 focus:border-emerald-500"}`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all ${isSubmitting ? (isDark ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed") : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className={`mt-8 p-6 rounded-xl text-center ${isDark ? "bg-zinc-900/30 border border-zinc-800" : "bg-gray-50 border border-gray-200"}`}>
            <p className={`text-sm mb-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
              You can also reach us directly at{" "}
              <a href="mailto:support@retext.com" className="text-emerald-500 hover:underline font-medium">
                support@retext.com
              </a>
            </p>
            <p className={`text-xs ${isDark ? "text-zinc-600" : "text-gray-400"}`}>
              We typically respond within 24-48 hours
            </p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
