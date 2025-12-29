
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[], balance: number): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze this user's bank account data and provide a short, professional financial tip (max 2 sentences).
    Current Balance: $${balance}
    Recent Transactions: ${JSON.stringify(transactions.slice(0, 5))}
    Be encouraging and provide actionable advice. Do not mention technical jargon.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 200,
        temperature: 0.7,
      }
    });

    return response.text || "Keep up the good work saving! Tracking your daily expenses is the first step to financial freedom.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ensure you're setting aside at least 20% of your deposits for long-term savings.";
  }
};

export const auditSecurity = async (allAccounts: any[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Audit these banking accounts for security risks like low balances with high withdrawal activity or suspicious patterns. Return a brief summary for the admin. Accounts: ${JSON.stringify(allAccounts.slice(0, 10))}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No critical anomalies detected in the current audit period.";
  } catch (error) {
    return "Security audit system temporarily offline. Manual review recommended.";
  }
}
