import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../components/contexts/theme-provider";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Signup() {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = "openid email profile";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
    window.location.href = googleAuthUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/ai-detector");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 overflow-hidden ${isDark ? "bg-[#0a0a0a]" : "bg-gray-100"}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.9, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full relative max-w-6xl min-h-[600px] overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl ${isDark ? "bg-[#1a1a1a]" : "bg-white"}`}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="hidden md:block md:w-1/2 relative overflow-hidden rounded-l-3xl bg-cover bg-center"
          style={{ backgroundImage: `url("https://media.istockphoto.com/id/1949882446/vector/teal-orange-grainy-background-banner-noise-texture-glowing-color-gradient-vibrant-dark.jpg?s=612x612&w=0&k=20&c=jsSZREbmeJc2h5IHF2xZi4lx7syOI7jSow0E_wr7fcY=")` }}
        />
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className={`p-6 md:p-10 w-full md:w-1/2 flex flex-col rounded-3xl md:rounded-r-3xl md:rounded-l-none ${isDark ? "bg-[#1a1a1a]" : "bg-white"}`}
        >
          <Link
            to="/"
            className={`mb-4 flex items-center gap-2 transition-colors self-start text-sm ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex flex-col mb-4">
            <h2 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>Create Account</h2>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Enter your details below to create your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 flex items-center justify-center gap-3 rounded-lg font-medium transition-all bg-white text-black hover:bg-gray-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className={`w-full border-t ${isDark ? "border-gray-700" : "border-gray-200"}`} />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 ${isDark ? "bg-[#1a1a1a] text-gray-500" : "bg-white text-gray-400"}`}>Or continue with email</span>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full py-2.5 pl-9 pr-4 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/20 ${isDark ? "bg-[#0d0d0d] border-gray-700 text-white focus:border-brand" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400"}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full py-2.5 pl-9 pr-4 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/20 ${isDark ? "bg-[#0d0d0d] border-gray-700 text-white focus:border-brand" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400"}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full py-2.5 pl-9 pr-10 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/20 ${isDark ? "bg-[#0d0d0d] border-gray-700 text-white focus:border-brand" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400"}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full py-2.5 pl-9 pr-4 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/20 ${isDark ? "bg-[#0d0d0d] border-gray-700 text-white focus:border-brand" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400"}`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className={`text-center text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Already have an account?{" "}
              <Link to="/login" className="text-brand font-medium hover:text-brand-foreground transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
