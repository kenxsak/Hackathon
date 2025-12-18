import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LenisProvider } from "./components/contexts/lenis-provider";
import { ThemeProvider } from "./components/contexts/theme-provider";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Paraphraser from "./pages/Paraphraser";

export default function App() {
  return (
    <BrowserRouter>
      <LenisProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/paraphraser" element={<Paraphraser />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </ThemeProvider>
      </LenisProvider>
    </BrowserRouter>
  );
}
