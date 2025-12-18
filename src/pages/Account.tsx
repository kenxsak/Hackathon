import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../components/contexts/theme-provider";

type UserType = { name: string; email: string; picture?: string };

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
];

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const generateAccountId = (email: string) => {
    let hash = 0;
    for (let i = 0; i < email.length; i++) { hash = ((hash << 5) - hash) + email.charCodeAt(i); hash = hash & hash; }
    return `ACC-${Math.abs(hash).toString(16).toUpperCase().slice(0, 8).padStart(8, '0')}`;
  };

  const generateParentId = (email: string) => {
    let hash = 0;
    for (let i = 0; i < email.length; i++) { hash = ((hash << 3) + hash) + email.charCodeAt(i); hash = hash & hash; }
    return `PID-${Math.abs(hash).toString(16).toUpperCase().slice(0, 8).padStart(8, '0')}`;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { navigate("/login"); return; }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    const nameParts = userData.name?.split(" ") || [];
    setFirstName(nameParts[0] || "");
    setLastName(nameParts.slice(1).join(" ") || "");
  }, [navigate]);

  if (!user) return null;

  return (
    <DashboardLayout title="Account Settings">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Page Header */}
        <div className="mb-6">
          <h1 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Account Settings</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Manage your personal information and account preferences</p>
        </div>

        {/* Tabs */}
        <div className={`flex items-center border-b w-full mb-6 ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
          <ul className="flex items-center text-sm gap-6 overflow-x-auto">
            <li><button className={`pb-3 border-b-2 font-semibold text-sm transition-all ${isDark ? "border-white text-white" : "border-gray-900 text-gray-900"}`}>General</button></li>
            <li><button className={`pb-3 border-b-2 border-transparent font-medium text-sm transition-all ${isDark ? "text-zinc-400 hover:text-zinc-300" : "text-gray-500 hover:text-gray-700"}`}>Security</button></li>
            <li><button className={`pb-3 border-b-2 border-transparent font-medium text-sm transition-all ${isDark ? "text-zinc-400 hover:text-zinc-300" : "text-gray-500 hover:text-gray-700"}`}>Notifications</button></li>
          </ul>
        </div>

        <div className="space-y-6">
          {/* Personal Info Card */}
          <div className={`border rounded-xl overflow-hidden ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
            <div className={`px-6 py-4 border-b ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-gray-50 border-gray-200"}`}>
              <h2 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Personal Info</h2>
              <p className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Update your personal details</p>
            </div>
            <div className={`p-6 ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-400" : "text-gray-700"}`}>First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors ${isDark ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-600" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400"}`} placeholder="Enter first name" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-400" : "text-gray-700"}`}>Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors ${isDark ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-600" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400"}`} placeholder="Enter last name" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-400" : "text-gray-700"}`}>Email</label>
                  <input type="email" value={user.email} disabled className={`w-full px-4 py-2.5 border rounded-lg cursor-not-allowed ${isDark ? "bg-zinc-800/50 border-zinc-800 text-zinc-500" : "bg-gray-100 border-gray-200 text-gray-500"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-400" : "text-gray-700"}`}>Mobile Number</label>
                  <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors ${isDark ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-600" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400"}`} placeholder="Enter mobile number" />
                </div>
              </div>
            </div>
          </div>

          {/* Account Info Card */}
          <div className={`border rounded-xl overflow-hidden ${isDark ? "border-zinc-800" : "border-gray-200"}`}>
            <div className={`px-6 py-4 border-b ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-gray-50 border-gray-200"}`}>
              <h2 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Account Info</h2>
              <p className={`text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}>Your account identifiers and preferences</p>
            </div>
            <div className={`p-6 ${isDark ? "bg-[#0a0a0a]" : "bg-white"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-400" : "text-gray-700"}`}>Parent ID</label>
                  <input type="text" value={generateParentId(user.email)} disabled className={`w-full px-4 py-2.5 border rounded-lg cursor-not-allowed ${isDark ? "bg-zinc-800/50 border-zinc-800 text-zinc-500" : "bg-gray-100 border-gray-200 text-gray-500"}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-400" : "text-gray-700"}`}>Account ID</label>
                  <input type="text" value={generateAccountId(user.email)} disabled className={`w-full px-4 py-2.5 border rounded-lg cursor-not-allowed ${isDark ? "bg-zinc-800/50 border-zinc-800 text-zinc-500" : "bg-gray-100 border-gray-200 text-gray-500"}`} />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-400" : "text-gray-700"}`}>Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors appearance-none cursor-pointer ${isDark ? "bg-zinc-900 border-zinc-800 text-white focus:border-zinc-600" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400"}`} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${isDark ? '%2371717a' : '%236b7280'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                    {timezones.map((tz) => (<option key={tz.value} value={tz.value} className={isDark ? "bg-zinc-900 text-white" : "bg-white text-gray-900"}>{tz.label}</option>))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className={`px-6 py-2.5 font-medium rounded-lg transition-colors ${isDark ? "bg-white text-zinc-900 hover:bg-zinc-100" : "bg-gray-900 text-white hover:bg-gray-800"}`}>Save Changes</button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
