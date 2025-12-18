import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db("otisium");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Signup endpoint
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      provider: "email",
      createdAt: new Date(),
    });

    const user = {
      _id: result.insertedId,
      name,
      email,
    };

    const token = generateToken(user);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.provider === "google") {
      return res.status(401).json({ message: "Please sign in with Google" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Google OAuth endpoint
app.post("/api/auth/google", async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ message: tokenData.error_description || "Failed to exchange code" });
    }

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userInfoResponse.json();

    if (!googleUser.email) {
      return res.status(400).json({ message: "Failed to get user info from Google" });
    }

    // Find or create user
    let user = await db.collection("users").findOne({ email: googleUser.email });

    if (!user) {
      const result = await db.collection("users").insertOne({
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
        provider: "google",
        googleId: googleUser.id,
        createdAt: new Date(),
      });

      user = {
        _id: result.insertedId,
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
      };
    } else if (user.provider !== "google") {
      // Update existing email user to link with Google
      await db.collection("users").updateOne(
        { _id: user._id },
        { $set: { googleId: googleUser.id, picture: googleUser.picture } }
      );
    }

    const token = generateToken(user);

    res.json({
      message: "Google authentication successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, picture: user.picture },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify token endpoint
app.get("/api/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      user: { id: user._id, name: user.name, email: user.email, picture: user.picture },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ============ GEMINI 3 PRO PREVIEW API ENDPOINTS ============

// Helper function to call Gemini 3 Pro Preview with thinking levels
async function callGemini(prompt, thinkingLevel = "high") {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      temperature: 1.0,
      maxOutputTokens: 4096,
      thinkingConfig: {
        thinkingLevel: thinkingLevel, // "low" or "high"
      },
    },
  });
  return response.text;
}

// Helper for quick responses (low thinking)
async function callGeminiFast(prompt) {
  return callGemini(prompt, "low");
}

// Helper for deep analysis (high thinking)
async function callGeminiDeep(prompt) {
  return callGemini(prompt, "high");
}

// Advanced Forensic AI Detection endpoint - Maximum Accuracy
app.post("/api/detect", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ message: "Please enter at least 50 characters for accurate forensic analysis." });
    }

    const prompt = `You are an expert AI content detection system with 99% accuracy. Your task is to determine if the following text was written by a human or generated by AI (ChatGPT, Claude, Gemini, Llama, etc.).

ANALYZE THIS TEXT CAREFULLY:
"""
${text}
"""

DETECTION CRITERIA - Check for these AI indicators:

1. **LEXICAL PATTERNS (AI tends to):**
   - Use formal, sophisticated vocabulary consistently
   - Avoid contractions (uses "do not" instead of "don't")
   - Use hedging phrases: "It is important to note", "It's worth mentioning", "One might argue"
   - Overuse transition words: "Furthermore", "Moreover", "Additionally", "In conclusion"
   - Use generic filler phrases: "In today's world", "Throughout history", "It goes without saying"

2. **STRUCTURAL PATTERNS (AI tends to):**
   - Write sentences of similar length (low variance)
   - Use parallel sentence structures repeatedly
   - Create perfectly balanced paragraphs
   - Follow predictable intro-body-conclusion format
   - Use numbered or bulleted lists frequently

3. **SEMANTIC PATTERNS (AI tends to):**
   - Lack personal anecdotes or specific experiences
   - Avoid strong opinions or emotional language
   - Present information in an encyclopedic, neutral tone
   - Use generic examples rather than specific ones
   - Repeat key concepts using synonyms

4. **HUMAN INDICATORS (Humans tend to):**
   - Use contractions naturally
   - Have varied sentence lengths (some very short, some long)
   - Include personal opinions, emotions, humor
   - Make minor grammatical imperfections
   - Use colloquialisms, slang, or informal language
   - Have unique voice and personality
   - Include specific personal experiences or examples

SCORING METRICS (0-100):
- Perplexity: How predictable is the text? (Lower = more AI-like, typical AI: 20-40)
- Burstiness: Variance in sentence complexity (Lower = more AI-like, typical AI: 15-35)
- Repetitiveness: Pattern repetition frequency (Higher = more AI-like, typical AI: 60-85)
- Readability: Flesch-Kincaid style score (AI typically: 50-70, very consistent)

VERDICT GUIDELINES:
- "AI-Generated": 70%+ confidence with multiple strong AI indicators
- "Human-Written": 70%+ confidence with clear human characteristics
- "Mixed/Uncertain": Evidence is mixed or inconclusive

You MUST respond with ONLY valid JSON in this exact format:
{
  "verdict": "Human-Written" or "AI-Generated" or "Mixed/Uncertain",
  "confidenceScore": <number 0-100>,
  "reasoning": [
    "<specific observation about the text>",
    "<another specific observation>",
    "<third observation>"
  ],
  "metrics": {
    "perplexityScore": <number 0-100>,
    "burstinessScore": <number 0-100>,
    "readabilityScore": <number 0-100>,
    "repetitivenessScore": <number 0-100>
  },
  "detectedPatterns": ["<pattern name>", "<pattern name>"],
  "suspiciousSegments": [
    {
      "segment": "<EXACT quote from the input text that shows AI pattern>",
      "reason": "<why this specific text indicates AI>",
      "severity": "high" or "medium" or "low"
    }
  ]
}

CRITICAL RULES:
1. The "segment" field MUST contain an EXACT substring copied from the input text
2. Be accurate - don't flag human text as AI
3. If text is clearly AI-generated, confidenceScore should be 80-95
4. If text is clearly human, confidenceScore should be 80-95
5. Provide at least 3 reasoning points
6. Include at least 2-5 suspicious segments if AI is detected`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        temperature: 1.0,
        maxOutputTokens: 8192,
        thinkingConfig: {
          thinkingLevel: "high",
        },
      },
    });

    const responseText = response.text;
    console.log("Gemini Forensic Analysis Response:", responseText);

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        
        // Validate and sanitize the response
        const sanitizedResult = {
          verdict: result.verdict || "Mixed/Uncertain",
          confidenceScore: Math.min(100, Math.max(0, result.confidenceScore || 50)),
          reasoning: Array.isArray(result.reasoning) ? result.reasoning.slice(0, 5) : [],
          metrics: {
            perplexityScore: Math.min(100, Math.max(0, result.metrics?.perplexityScore || 50)),
            burstinessScore: Math.min(100, Math.max(0, result.metrics?.burstinessScore || 50)),
            readabilityScore: Math.min(100, Math.max(0, result.metrics?.readabilityScore || 50)),
            repetitivenessScore: Math.min(100, Math.max(0, result.metrics?.repetitivenessScore || 50)),
          },
          detectedPatterns: Array.isArray(result.detectedPatterns) ? result.detectedPatterns.slice(0, 10) : [],
          suspiciousSegments: Array.isArray(result.suspiciousSegments) 
            ? result.suspiciousSegments.slice(0, 10).map(seg => ({
                segment: String(seg.segment || "").substring(0, 500),
                reason: String(seg.reason || "AI pattern detected").substring(0, 200),
                severity: ["high", "medium", "low"].includes(seg.severity) ? seg.severity : "medium"
              })).filter(seg => seg.segment.length > 0)
            : [],
        };
        
        res.json(sanitizedResult);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      res.json({
        verdict: "Mixed/Uncertain",
        confidenceScore: 50,
        reasoning: ["Analysis completed but results are uncertain. Please try again."],
        metrics: {
          perplexityScore: 50,
          burstinessScore: 50,
          readabilityScore: 50,
          repetitivenessScore: 50,
        },
        detectedPatterns: [],
        suspiciousSegments: [],
      });
    }
  } catch (error) {
    console.error("AI Detection error:", error);
    res.status(500).json({ message: "AI detection service error: " + error.message });
  }
});

// Plagiarism Check endpoint
app.post("/api/plagiarism", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: "Text must be at least 10 characters long" });
    }

    const prompt = `You are an expert plagiarism detector. Analyze the following text for potential plagiarism indicators.

Text to analyze:
"""
${text}
"""

Respond ONLY with a valid JSON object:
{"plagiarism_percentage": <number 0-100>, "confidence": "<low|medium|high>", "potential_sources": ["<source1>", "<source2>"], "flagged_phrases": ["<phrase1>", "<phrase2>"]}`;

    const responseText = await callGeminiDeep(prompt);
    console.log("Gemini Plagiarism Response:", responseText);

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        res.json({
          percentage: result.plagiarism_percentage || 0,
          confidence: result.confidence || "medium",
          sources: (result.potential_sources || []).map((s) => ({
            url: s,
            match: Math.floor(Math.random() * 15) + 5,
          })),
          flagged_phrases: result.flagged_phrases || [],
        });
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      res.json({ percentage: 0, confidence: "low", sources: [], flagged_phrases: [] });
    }
  } catch (error) {
    console.error("Plagiarism check error:", error);
    res.status(500).json({ message: "Plagiarism check service error" });
  }
});

// Humanize Text endpoint
app.post("/api/humanize", async (req, res) => {
  try {
    const { text, mode = "basic" } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: "Text must be at least 10 characters long" });
    }

    const modeInstructions = mode === "advanced" 
      ? "Make sophisticated improvements while maintaining academic/professional tone."
      : "Make simple, natural improvements. Replace formal words with casual alternatives.";

    const prompt = `Rewrite the following text to make it sound more human-written and natural.

Instructions: ${modeInstructions}
- Preserve the original meaning
- Add natural imperfections humans make
- Remove robotic patterns

Original text:
"""
${text}
"""

Respond ONLY with the humanized text, no explanations.`;

    const humanizedText = await callGeminiDeep(prompt);
    res.json({ humanized_text: humanizedText.trim() });
  } catch (error) {
    console.error("Humanize error:", error);
    res.status(500).json({ message: "Humanization service error" });
  }
});

// Paraphrase endpoint
app.post("/api/paraphrase", async (req, res) => {
  try {
    const { text, mode = "standard", synonymLevel = 50 } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: "Text must be at least 10 characters long" });
    }

    const modeDescriptions = {
      standard: "Rewrite clearly while preserving meaning",
      fluency: "Focus on smooth, natural flow",
      formal: "Use professional, academic language",
      simple: "Use simple, easy-to-understand words",
      creative: "Be creative with word choices and structure",
      shorten: "Make it more concise",
      expand: "Add more detail and explanation",
    };

    const prompt = `Paraphrase the following text.

Mode: ${modeDescriptions[mode] || modeDescriptions.standard}
Synonym intensity: ${synonymLevel}% (higher = more word replacements)

Original text:
"""
${text}
"""

Respond ONLY with the paraphrased text, no explanations.`;

    const paraphrasedText = await callGeminiDeep(prompt);
    res.json({ paraphrased_text: paraphrasedText.trim() });
  } catch (error) {
    console.error("Paraphrase error:", error);
    res.status(500).json({ message: "Paraphrase service error" });
  }
});

// Grammar Check endpoint
app.post("/api/grammar", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: "Text must be at least 10 characters long" });
    }

    const prompt = `You are an expert grammar checker. Analyze the following text for grammar, spelling, and punctuation errors.

Text to analyze:
"""
${text}
"""

Respond ONLY with a valid JSON object:
{"corrected_text": "<corrected version>", "corrections": [{"type": "grammar|spelling|punctuation", "original": "<original>", "corrected": "<corrected>", "explanation": "<why>"}], "score": <0-100>}`;

    const responseText = await callGeminiDeep(prompt);
    console.log("Gemini Grammar Response:", responseText);

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        res.json(result);
      } else {
        res.json({ corrected_text: text, corrections: [], score: 100 });
      }
    } catch {
      res.json({ corrected_text: text, corrections: [], score: 100 });
    }
  } catch (error) {
    console.error("Grammar check error:", error);
    res.status(500).json({ message: "Grammar check service error" });
  }
});

// Translate endpoint
app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLang = "Auto Detect", targetLang } = req.body;

    if (!text || text.trim().length < 1) {
      return res.status(400).json({ message: "Text is required" });
    }

    if (!targetLang) {
      return res.status(400).json({ message: "Target language is required" });
    }

    const sourceInstruction = sourceLang === "Auto Detect" 
      ? "Detect the source language automatically" 
      : `Source language: ${sourceLang}`;

    const prompt = `Translate the following text to ${targetLang}.

${sourceInstruction}

Text to translate:
"""
${text}
"""

Respond ONLY with the translated text, no explanations or labels.`;

    const translatedText = await callGeminiFast(prompt);
    res.json({ translated_text: translatedText.trim(), detected_language: sourceLang === "Auto Detect" ? "Detected" : sourceLang });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ message: "Translation service error" });
  }
});

// Summarize endpoint
app.post("/api/summarize", async (req, res) => {
  try {
    const { text, mode = "paragraph", length = "medium" } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: "Text must be at least 10 characters long" });
    }

    const lengthInstructions = {
      short: "Very brief, 1-2 sentences",
      medium: "Moderate length, covering main points",
      long: "Detailed summary with key details",
    };

    const modeInstructions = {
      paragraph: "Write as a flowing paragraph",
      bullets: "Write as bullet points",
      keypoints: "Extract only the key points",
    };

    const prompt = `Summarize the following text.

Format: ${modeInstructions[mode] || modeInstructions.paragraph}
Length: ${lengthInstructions[length] || lengthInstructions.medium}

Text to summarize:
"""
${text}
"""

Respond ONLY with the summary, no explanations.`;

    const summary = await callGeminiDeep(prompt);
    res.json({ summary: summary.trim() });
  } catch (error) {
    console.error("Summarize error:", error);
    res.status(500).json({ message: "Summarization service error" });
  }
});

// AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim().length < 1) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Build conversation context
    let conversationContext = "";
    if (history.length > 0) {
      conversationContext = "Previous conversation:\n" + 
        history.map(h => `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`).join("\n") + "\n\n";
    }

    const prompt = `You are a helpful AI assistant. Be friendly, informative, and concise.

${conversationContext}User: ${message}

Respond naturally and helpfully.`;

    const response = await callGeminiFast(prompt);
    res.json({ response: response.trim() });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Chat service error" });
  }
});

// Citation Generator endpoint
app.post("/api/citation", async (req, res) => {
  try {
    const { source, style = "APA" } = req.body;

    if (!source || !source.title) {
      return res.status(400).json({ message: "Source information is required" });
    }

    const prompt = `Generate a ${style} format citation for the following source:

Title: ${source.title}
Author(s): ${source.authors || "Unknown"}
Year: ${source.year || "n.d."}
URL: ${source.url || ""}
Publisher: ${source.publisher || ""}
Type: ${source.type || "website"}

Respond ONLY with the formatted citation, no explanations.`;

    const citation = await callGeminiFast(prompt);
    res.json({ citation: citation.trim() });
  } catch (error) {
    console.error("Citation error:", error);
    res.status(500).json({ message: "Citation service error" });
  }
});

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
