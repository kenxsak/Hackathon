// Analysis Types for AI Detection

export enum AnalysisVerdict {
  HUMAN = "Human-Written",
  AI = "AI-Generated",
  UNCERTAIN = "Mixed/Uncertain",
}

export interface LinguisticMetrics {
  perplexityScore: number; // 0-100, Lower = AI
  burstinessScore: number; // 0-100, Lower = AI
  readabilityScore: number; // 0-100
  repetitivenessScore: number; // 0-100, Higher = AI
}

export interface SuspiciousSegment {
  segment: string;
  reason: string;
  severity: "high" | "medium" | "low";
}

export interface AnalysisResult {
  verdict: AnalysisVerdict;
  confidenceScore: number;
  reasoning: string[];
  metrics: LinguisticMetrics;
  detectedPatterns: string[];
  suspiciousSegments: SuspiciousSegment[];
}
