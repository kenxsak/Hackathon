import React from "react";
import { useTheme } from "./contexts/theme-provider";

interface SuspiciousSegment {
  segment: string;
  reason: string;
  severity: "high" | "medium" | "low";
}

interface TextHighlighterProps {
  text: string;
  segments: SuspiciousSegment[];
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({ text, segments }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (!segments || segments.length === 0) {
    return (
      <div className={`whitespace-pre-wrap text-sm leading-relaxed ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
        {text}
      </div>
    );
  }

  const parts: {
    start: number;
    end: number;
    content: string;
    type: "normal" | "highlight";
    severity?: string;
    reason?: string;
  }[] = [];

  let lastIndex = 0;

  // Locate the segments in the text
  const sortedSegments = segments
    .map((s) => ({ ...s, index: text.indexOf(s.segment) }))
    .filter((s) => s.index !== -1)
    .sort((a, b) => a.index - b.index);

  // Filter overlapping segments
  const uniqueSegments: typeof sortedSegments = [];
  let maxEnd = -1;
  for (const s of sortedSegments) {
    if (s.index >= maxEnd) {
      uniqueSegments.push(s);
      maxEnd = s.index + s.segment.length;
    }
  }

  // Construct the view
  uniqueSegments.forEach((seg) => {
    if (seg.index > lastIndex) {
      parts.push({
        start: lastIndex,
        end: seg.index,
        content: text.substring(lastIndex, seg.index),
        type: "normal",
      });
    }
    parts.push({
      start: seg.index,
      end: seg.index + seg.segment.length,
      content: seg.segment,
      type: "highlight",
      severity: seg.severity,
      reason: seg.reason,
    });
    lastIndex = seg.index + seg.segment.length;
  });

  if (lastIndex < text.length) {
    parts.push({
      start: lastIndex,
      end: text.length,
      content: text.substring(lastIndex),
      type: "normal",
    });
  }

  return (
    <div
      className={`rounded-xl p-4 whitespace-pre-wrap text-sm leading-relaxed max-h-[400px] overflow-y-auto ${
        isDark ? "bg-zinc-900/50 border border-zinc-800" : "bg-gray-50 border border-gray-200"
      }`}
    >
      {parts.map((part, i) => {
        if (part.type === "normal") {
          return (
            <span key={i} className={isDark ? "text-zinc-400" : "text-gray-600"}>
              {part.content}
            </span>
          );
        }

        const bgColor =
          part.severity === "high"
            ? "bg-red-500/20"
            : part.severity === "medium"
            ? "bg-amber-500/20"
            : "bg-yellow-500/15";
        const borderColor =
          part.severity === "high"
            ? "border-red-500/50"
            : part.severity === "medium"
            ? "border-amber-500/50"
            : "border-yellow-500/40";
        const textColor =
          part.severity === "high"
            ? isDark ? "text-red-300" : "text-red-700"
            : part.severity === "medium"
            ? isDark ? "text-amber-300" : "text-amber-700"
            : isDark ? "text-yellow-300" : "text-yellow-700";

        return (
          <span
            key={i}
            className={`${bgColor} ${borderColor} ${textColor} border-b-2 px-0.5 relative group cursor-help transition-all duration-300 rounded-sm`}
          >
            {part.content}
            <span
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-lg shadow-xl text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none ${
                isDark ? "bg-zinc-800 border border-zinc-700 text-zinc-200" : "bg-white border border-gray-200 text-gray-700"
              }`}
            >
              <span className={`font-bold block mb-1 uppercase text-[10px] tracking-wider ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                AI Pattern Detected:
              </span>
              {part.reason}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export default TextHighlighter;
