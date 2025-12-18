import { useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
  Settings, Bell, X, LogOut, Monitor, Sun, Moon, Mail,
  RefreshCw, SpellCheck, ScanSearch, Shield, Bot, MessageSquare,
  ImageIcon, Languages, FileText, Loader2,
} from "lucide-react";
import { useTheme } from "./contexts/theme-provider";

const LogoIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10.5 12.75H3L6 9.75H9L15.75 3H20.25L10.5 12.75Z" fill="currentColor" />
    <path d="M11.25 15V13.5L21 3.75V5.25L11.25 15Z" fill="currentColor" />
    <path d="M11.25 18V16.5L21 6.75V8.25L11.25 18Z" fill="currentColor" />
    <path d="M11.25 21V19.5L15 15.75V17.25L11.25 21Z" fill="currentColor" />
  </svg>
);

const SidebarIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6.83496 3.99992C6.38353 4.00411 6.01421 4.0122 5.69824 4.03801C5.31232 4.06954 5.03904 4.12266 4.82227 4.20012L4.62207 4.28606C4.18264 4.50996 3.81498 4.85035 3.55859 5.26848L3.45605 5.45207C3.33013 5.69922 3.25006 6.01354 3.20801 6.52824C3.16533 7.05065 3.16504 7.71885 3.16504 8.66301V11.3271C3.16504 12.2712 3.16533 12.9394 3.20801 13.4618C3.25006 13.9766 3.33013 14.2909 3.45605 14.538L3.55859 14.7216C3.81498 15.1397 4.18266 15.4801 4.62207 15.704L4.82227 15.79C5.03904 15.8674 5.31234 15.9205 5.69824 15.9521C6.01398 15.9779 6.383 15.986 6.83398 15.9902L6.83496 3.99992ZM18.165 11.3271C18.165 12.2493 18.1653 12.9811 18.1172 13.5702C18.0745 14.0924 17.9916 14.5472 17.8125 14.9648L17.7295 15.1415C17.394 15.8 16.8834 16.3511 16.2568 16.7353L15.9814 16.8896C15.5157 17.1268 15.0069 17.2285 14.4102 17.2773C13.821 17.3254 13.0893 17.3251 12.167 17.3251H7.83301C6.91071 17.3251 6.17898 17.3254 5.58984 17.2773C5.06757 17.2346 4.61294 17.1508 4.19531 16.9716L4.01855 16.8896C3.36014 16.5541 2.80898 16.0434 2.4248 15.4169L2.27051 15.1415C2.03328 14.6758 1.93158 14.167 1.88281 13.5702C1.83468 12.9811 1.83496 12.2493 1.83496 11.3271V8.66301C1.83496 7.74072 1.83468 7.00898 1.88281 6.41985C1.93157 5.82309 2.03329 5.31432 2.27051 4.84856L2.4248 4.57317C2.80898 3.94666 3.36012 3.436 4.01855 3.10051L4.19531 3.0175C4.61285 2.83843 5.06771 2.75548 5.58984 2.71281C6.17898 2.66468 6.91071 2.66496 7.83301 2.66496H12.167C13.0893 2.66496 13.821 2.66468 14.4102 2.71281C15.0069 2.76157 15.5157 2.86329 15.9814 3.10051L16.2568 3.25481C16.8833 3.63898 17.394 4.19012 17.7295 4.84856L17.8125 5.02531C17.9916 5.44285 18.0745 5.89771 18.1172 6.41985C18.1653 7.00898 18.165 7.74072 18.165 8.66301V11.3271ZM8.16406 15.995H12.167C13.1112 15.995 13.7794 15.9947 14.3018 15.9521C14.8164 15.91 15.1308 15.8299 15.3779 15.704L15.5615 15.6015C15.9797 15.3451 16.32 14.9774 16.5439 14.538L16.6299 14.3378C16.7074 14.121 16.7605 13.8478 16.792 13.4618C16.8347 12.9394 16.835 12.2712 16.835 11.3271V8.66301C16.835 7.71885 16.8347 7.05065 16.792 6.52824C16.7605 6.14232 16.7073 5.86904 16.6299 5.65227L16.5439 5.45207C16.32 5.01264 15.9796 4.64498 15.5615 4.3886L15.3779 4.28606C15.1308 4.16013 14.8165 4.08006 14.3018 4.03801C13.7794 3.99533 13.1112 3.99504 12.167 3.99504H8.16406C8.16407 3.99667 8.16504 3.99829 8.16504 3.99992L8.16406 15.995Z" />
  </svg>
);

type User = { name: string; email: string; picture?: string };

const sidebarTools = [
  { icon: ScanSearch, label: "AI Detector", path: "/ai-detector" },
  { icon: RefreshCw, label: "Paraphraser", path: "/paraphraser" },
  { icon: SpellCheck, label: "Grammar Checker", path: "/grammar-checker" },
  { icon: Shield, label: "Plagiarism Checker", path: "/plagiarism-checker" },
  { icon: Bot, label: "AI Humanizer", path: "/ai-humanizer" },
  { icon: MessageSquare, label: "AI Chat", path: "/ai-chat" },
  { icon: ImageIcon, label: "AI Image Generator", path: "/ai-image-generator" },
  { icon: Languages, label: "Translate", path: "/translate" },
  { icon: FileText, label: "Summarizer", path: "/summarizer" },
];
const sidebarBottom = [
  { icon: Mail, label: "Contact us", path: "/contact" },
];

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (!storedUser || !token) {
        navigate("/login", { replace: true });
        return;
      }
      
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  if (isLoading || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-[#0a0a0a]" : "bg-gray-50"}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900"}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: sidebarOpen ? 256 : 64, opacity: 0 }}
        animate={{ width: sidebarOpen ? 256 : 64, opacity: 1 }}
        transition={{ width: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 0.3 } }}
        className={`hidden md:flex flex-col fixed left-0 top-0 h-full z-40 ${isDark ? "bg-[#111] border-r border-gray-800" : "bg-white border-r border-gray-200"}`}
      >
        <div className={`flex items-center justify-between ${sidebarOpen ? "p-4" : "p-2 justify-center"}`}>
          {sidebarOpen && <LogoIcon className={`w-7 h-7 ${isDark ? "text-white" : "text-gray-900"}`} />}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
            <SidebarIcon className="w-5 h-5" />
          </button>
        </div>
        <nav className={`flex-1 overflow-y-auto ${sidebarOpen ? "p-4" : "p-2"}`}>
          <div className="space-y-1">
            {sidebarTools.map((item, index) => (
              <button key={index} onClick={() => navigate(item.path)} className={`w-full flex items-center rounded-lg transition-colors ${sidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-2"} ${isActive(item.path) ? (isDark ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400 -ml-[2px] pl-[14px]" : "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600 -ml-[2px] pl-[14px]") : (isDark ? "text-gray-400 hover:bg-zinc-800/50 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            ))}
          </div>

          <div className={`mt-4 pt-4 border-t space-y-1 ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
            {sidebarBottom.map((item, index) => (
              <button key={index} onClick={() => navigate(item.path)} className={`w-full flex items-center rounded-lg transition-colors ${sidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-2"} ${isDark ? "text-gray-400 hover:bg-zinc-800/50 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className={`sticky bottom-0 z-30 py-1.5 border-t ${isDark ? "bg-[#111] border-gray-800/30" : "bg-white border-gray-200"} ${!sidebarOpen && "px-1"}`}>
          <div className={sidebarOpen ? "px-2" : "px-1"}>
            <div className="relative">
              <div className="group relative">
                <button type="button" onClick={() => setUserMenuOpen(!userMenuOpen)} className={`flex items-center w-full rounded-xl border transition-all duration-200 focus:outline-none ${sidebarOpen ? "gap-3 px-3 py-2" : "justify-center p-1.5"} ${isDark ? "bg-zinc-900 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-800/40" : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100"}`}>
                  {sidebarOpen && (
                    <div className="text-left flex-1 min-w-0">
                      <div className={`text-sm font-medium tracking-tight leading-tight truncate ${isDark ? "text-zinc-100" : "text-gray-900"}`}>{user.name}</div>
                      <div className={`text-xs tracking-tight leading-tight truncate ${isDark ? "text-zinc-400" : "text-gray-500"}`}>{user.email}</div>
                    </div>
                  )}
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                      <div className={`w-full h-full rounded-full overflow-hidden ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                        {user.picture ? <img src={user.picture} alt={user.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" /> : <div className={`w-full h-full flex items-center justify-center text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{user.name?.charAt(0).toUpperCase() || "U"}</div>}
                      </div>
                    </div>
                  </div>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }} className={`absolute bottom-full left-0 right-0 mb-2 z-50 rounded-xl shadow-lg overflow-hidden ${isDark ? "bg-[#0a0a0a] border border-zinc-800" : "bg-white border border-gray-200"}`}>
                      <div className="p-1">
                        <button onClick={() => { setUserMenuOpen(false); navigate("/account"); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isDark ? "text-zinc-300 hover:bg-zinc-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}><Settings className="w-4 h-4" />Account</button>
                        <button onClick={() => { setUserMenuOpen(false); handleLogout(); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isDark ? "text-zinc-300 hover:bg-zinc-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}><LogOut className="w-4 h-4" />Logout</button>
                      </div>
                      <div className={`border-t ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
                        <div className="flex items-center justify-between px-3 py-2.5">
                          <span className={`text-sm font-medium tracking-tight ${isDark ? "text-zinc-100" : "text-gray-900"}`}>Theme</span>
                          <div className={`flex items-center gap-0.5 p-0.5 rounded-full ring-1 ${isDark ? "bg-[#0a0a0a] ring-zinc-800" : "bg-gray-100 ring-gray-200"}`}>
                            <button onClick={() => setTheme("system")} className={`p-1.5 rounded-full transition-all ${theme === "system" ? (isDark ? "bg-zinc-700 shadow-sm" : "bg-white shadow-sm") : (isDark ? "hover:bg-zinc-700" : "hover:bg-gray-200")}`} title="System"><Monitor className={`w-3.5 h-3.5 ${isDark ? "text-zinc-400" : "text-gray-500"}`} /></button>
                            <button onClick={() => setTheme("light")} className={`p-1.5 rounded-full transition-all ${theme === "light" ? (isDark ? "bg-zinc-700 shadow-sm" : "bg-white shadow-sm") : (isDark ? "hover:bg-zinc-700" : "hover:bg-gray-200")}`} title="Light"><Sun className={`w-3.5 h-3.5 ${isDark ? "text-zinc-400" : "text-gray-500"}`} /></button>
                            <button onClick={() => setTheme("dark")} className={`p-1.5 rounded-full transition-all ${theme === "dark" ? (isDark ? "bg-zinc-700 shadow-sm" : "bg-white shadow-sm") : (isDark ? "hover:bg-zinc-700" : "hover:bg-gray-200")}`} title="Dark"><Moon className={`w-3.5 h-3.5 ${isDark ? "text-zinc-400" : "text-gray-500"}`} /></button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && <div className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileMenuOpen(false)} />}

      {/* Mobile Sidebar */}
      <motion.aside initial={{ x: "-100%" }} animate={{ x: mobileMenuOpen ? 0 : "-100%" }} transition={{ duration: 0.3, ease: "easeOut" }} className={`md:hidden fixed left-0 top-0 h-full w-64 z-50 flex flex-col ${isDark ? "bg-[#111] border-r border-gray-800" : "bg-white border-r border-gray-200"}`}>
        <div className="p-4 flex items-center justify-between">
          <LogoIcon className={`w-7 h-7 ${isDark ? "text-white" : "text-gray-900"}`} />
          <button onClick={() => setMobileMenuOpen(false)} className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {sidebarTools.map((item, index) => (
              <button key={index} onClick={() => { navigate(item.path); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path) ? (isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700") : (isDark ? "text-gray-400 hover:bg-zinc-800/50 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")}`}>
                <item.icon className="w-5 h-5" /><span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className={`mt-4 pt-4 border-t space-y-1 ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
            {sidebarBottom.map((item, index) => (
              <button key={index} onClick={() => { navigate(item.path); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isDark ? "text-gray-400 hover:bg-zinc-800/50 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                <item.icon className="w-5 h-5" /><span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-[margin] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarOpen ? "md:ml-64" : "md:ml-16"}`}>
        <header className={`sticky top-0 z-30 backdrop-blur-lg ${isDark ? "bg-[#0a0a0a]/80" : "bg-gray-50/80"}`}>
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className={`md:hidden p-2 rounded-lg ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}><SidebarIcon className="w-5 h-5" /></button>
              <h1 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className={`p-2 rounded-lg relative ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}><Bell className="w-5 h-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" /></button>
              <button onClick={handleLogout} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isDark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"}`}><LogOut className="w-4 h-4" /><span className="hidden sm:inline">Logout</span></button>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
