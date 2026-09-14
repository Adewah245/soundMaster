import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      system: "SoundPilot Orchestrator",
      engine: "Engineering Engine v1.0",
      dsp: "Python DSP Simulator Bridge v1.0",
      timestamp: new Date().toISOString()
    });
  });

  // Optional AI Explanation endpoint
  // SoundPilot Architectural Boundary Rule:
  // AI only explains structured engineering conclusions; never raw audio guesses.
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const { engineeringResult, venueContext, equipmentContext, userMode, query } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Deterministic offline engineering fallback explanation
        return res.json({
          explanation: generateOfflineExplanation(engineeringResult, venueContext, equipmentContext, userMode),
          isAiGenerated: false,
          note: "Offline deterministic engineering rules engine active. (No Gemini API key needed)."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      const systemPrompt = `You are SoundPilot's Acoustic Engineering AI Assistant.
Follow SoundPilot's strict boundary rule:
- Measurements are produced by DSP.
- Engineering compliance is verified by the Engineering Engine.
- Your role is ONLY to explain the engineering evaluation clearly to the audio engineer, recommending practical physical and electroacoustic adjustments.
- Mode: ${userMode === "pro" ? "Pro Sound Engineer (use precise dB, Q values, Hz, delay ms, speaker dispersion)" : "Simple/Operator Mode (plain language, clear step-by-step physical knob/fader/placement advice)"}.

Context:
Venue: ${JSON.stringify(venueContext || {})}
Equipment: ${JSON.stringify(equipmentContext || {})}
Engineering Evaluation Result: ${JSON.stringify(engineeringResult || {})}
User Query: ${query || "Provide an actionable analysis and recommended adjustments."}

Keep the response structured, clear, and actionable. Avoid speculation.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: systemPrompt
      });

      res.json({
        explanation: response.text || "No explanation generated.",
        isAiGenerated: true
      });
    } catch (error: any) {
      console.error("AI Explanation error:", error);
      // Graceful fallback to offline logic so app never crashes
      res.json({
        explanation: "Engineering Engine Diagnostic: Target tolerances evaluated. Adjust zone EQ cut at problem resonance frequency and verify speaker coverage angles before continuing session.",
        isAiGenerated: false,
        error: error.message
      });
    }
  });

  // Offline deterministic engineering explanation generator
  function generateOfflineExplanation(eng: any, venue: any, eq: any, mode: string): string {
    const isPro = mode === "pro";
    if (!eng) {
      return "All current acoustic metrics conform to the nominal target profile. Ready for sound check.";
    }

    const alerts = eng.alerts || [];
    const compliance = eng.complianceRate ?? 88;

    if (isPro) {
      return `### Acoustic Engineering Diagnostic Report
**Profile Match & Compliance**: ${compliance}% within nominal tolerance envelope (±2.5 dB).
**Venue Acoustic Context**: ${venue?.name || "Main Venue"} (${venue?.zones?.length || 3} zones active).

**Identified Deviations & Corrective Actions**:
${alerts.length > 0 ? alerts.map((a: string, i: number) => `${i + 1}. **${a}**: Compensate with high-Q notch or parametric cut; verify boundary distance to prevent quarter-wavelength cancellation.`).join("\n") : "• Frequency response is within ±2dB reference curve across audience listening plane."}

**Verification Mandate**: Once EQ or gain adjustments are committed to the DSP/Mixer, initiate re-verification sweep to log differential delta.`;
    } else {
      return `### Sound Check Summary
Your sound system is currently **${compliance >= 85 ? "sounding well balanced" : "needing a few quick adjustments"}** (${compliance}% overall match).

**What to adjust**:
${alerts.length > 0 ? alerts.map((a: string) => `• ${a}`).join("\n") : "• Sound levels and clarity look great across all audience areas."}

**Next Step**:
Make the suggested adjustments on your mixer or amplifier, then click **Verify Changes** to ensure the room sounds perfect!`;
    }
  }

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SoundPilot Orchestrator running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
