import { useState } from "react";
import { SummaryResult } from "../types";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export function useOpenAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeCalories = async (meal: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/calories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal }),
      });

      if (!response.ok) throw new Error("Failed to analyze calories");

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message || "Error analyzing calories");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const translateText = async (
    text: string,
    sourceLang: string,
    targetLang: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });

      if (!response.ok) throw new Error("Translation failed");

      const data = await response.json();
      return data.translation;
    } catch (err: any) {
      setError(err.message || "Error translating text");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const summarizePDF = async (text: string): Promise<SummaryResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Summarization failed");

      const data = await response.json();
      return data as SummaryResult;
    } catch (err: any) {
      setError(err.message || "Error summarizing PDF");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    analyzeCalories,
    translateText,
    summarizePDF,
  };
}
