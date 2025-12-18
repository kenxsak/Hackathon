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
import GrammarChecker from "./pages/GrammarChecker";
import PlagiarismChecker from "./pages/PlagiarismChecker";
import AIHumanizer from "./pages/AIHumanizer";
import AIChat from "./pages/AIChat";
import AIImageGenerator from "./pages/AIImageGenerator";
import Translate from "./pages/Translate";
import Summarizer from "./pages/Summarizer";
import CitationGenerator from "./pages/CitationGenerator";

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
            <Route path="/ai-detector" element={<Dashboard />} />
            <Route path="/paraphraser" element={<Paraphraser />} />
            <Route path="/grammar-checker" element={<GrammarChecker />} />
            <Route path="/plagiarism-checker" element={<PlagiarismChecker />} />
            <Route path="/ai-humanizer" element={<AIHumanizer />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/ai-image-generator" element={<AIImageGenerator />} />
            <Route path="/translate" element={<Translate />} />
            <Route path="/summarizer" element={<Summarizer />} />
            <Route path="/citation-generator" element={<CitationGenerator />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </ThemeProvider>
      </LenisProvider>
    </BrowserRouter>
  );
}
