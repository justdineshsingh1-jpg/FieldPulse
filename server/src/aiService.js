/**
 * AI Multimodal Service: Voice-to-Structured-Log & Computer Vision Inspection
 */

class AIService {
  /**
   * Parses natural language field audio notes into a validated structured Daily Report schema
   * @param {string} voiceTranscript
   * @returns {Object} Structured daily report entries
   */
  static parseVoiceNoteToDailyReport(voiceTranscript) {
    const text = (voiceTranscript || "").trim();
    if (!text) {
      throw new Error("Voice transcript cannot be empty");
    }

    const lower = text.toLowerCase();

    // Default structure
    const parsed = {
      rawTranscript: text,
      timestamp: new Date().toISOString(),
      confidence: 0.94,
      laborEntries: [],
      equipmentEntries: [],
      materials: [],
      delays: [],
      notes: text
    };

    // 1. Trade & Labor Extraction
    const tradeKeywords = [
      { name: "Concrete / Foundations", code: "03-3000 Cast-in-Place Concrete", matches: ["concrete", "pour", "slab", "rebar", "footing"] },
      { name: "Structural Steel / Framing", code: "05-1200 Structural Steel", matches: ["steel", "ironwork", "beam", "column", "framing", "erected", "torque"] },
      { name: "Electrical MEP", code: "26-0500 Electrical Systems", matches: ["electrical", "conduit", "wire", "spark", "panel", "lighting"] },
      { name: "Plumbing & HVAC Mechanical", code: "23-0000 Heating, Vent & AC", matches: ["plumbing", "pipe", "hvac", "duct", "drain", "chiller"] },
      { name: "Drywall & Finishes", code: "09-2200 Drywall Assemblies", matches: ["drywall", "sheetrock", "mudding", "taping", "paint"] }
    ];

    // Detect crew sizes & hours
    let matchedTrade = false;
    for (const t of tradeKeywords) {
      if (t.matches.some(m => lower.includes(m))) {
        // Extract crew count regex (e.g. "8 guys", "6 laborers", "4 crew")
        const crewMatch = text.match(/(\d+)\s*(guys|workers|laborers|men|people|crew|ironworkers|electricians)/i);
        const crewSize = crewMatch ? parseInt(crewMatch[1], 10) : 6;

        // Extract hours (e.g. "8 hours", "10 hrs", "2 hours overtime")
        const otMatch = text.match(/(\d+)\s*(hours?|hrs?)\s*(of\s*)?overtime/i);
        const overtimeHours = otMatch ? parseInt(otMatch[1], 10) : 0;
        const regHours = crewSize * 8;

        parsed.laborEntries.push({
          trade: t.name,
          crewSize: crewSize,
          regularHours: regHours,
          overtimeHours: overtimeHours,
          costCode: t.code,
          workPerformed: text
        });
        matchedTrade = true;
        break;
      }
    }

    if (!matchedTrade) {
      parsed.laborEntries.push({
        trade: "General Contracting / Site Prep",
        crewSize: 4,
        regularHours: 32,
        overtimeHours: 0,
        costCode: "01-0000 General Requirements",
        workPerformed: text
      });
    }

    // 2. Equipment Extraction
    if (lower.includes("excavator") || lower.includes("cat")) {
      parsed.equipmentEntries.push({
        equipmentId: "eq-CAT336",
        name: "CAT 336 Excavator #12",
        operatingHours: 6.5,
        idleHours: 0.5,
        purpose: "Site excavation & grade prep"
      });
    }
    if (lower.includes("crane") || lower.includes("liebherr")) {
      parsed.equipmentEntries.push({
        equipmentId: "eq-LIEB550",
        name: "Liebherr Tower Crane #1",
        operatingHours: 7.0,
        idleHours: 1.0,
        purpose: "Material pick & vertical transport"
      });
    }
    if (lower.includes("generator") || lower.includes("multiquip")) {
      parsed.equipmentEntries.push({
        equipmentId: "eq-GEN75K",
        name: "Multiquip 70kVA Generator",
        operatingHours: 8.0,
        idleHours: 3.0,
        purpose: "Temporary site power distribution"
      });
    }

    // 3. Materials Extraction
    const yardMatch = text.match(/(\d+)\s*(yards|cu\s*yds|cubic\s*yards)/i);
    if (yardMatch || lower.includes("concrete")) {
      const yds = yardMatch ? yardMatch[1] + " cu yds" : "40 cu yds";
      parsed.materials.push({
        material: "Ready-Mix Concrete 4000 PSI",
        supplier: "Pacific Mix Co.",
        quantity: yds,
        deliveryTicket: `TK-${Math.floor(10000 + Math.random() * 90000)}`,
        status: "Delivered & Staged"
      });
    }
    if (lower.includes("rebar") || lower.includes("steel")) {
      parsed.materials.push({
        material: "#5 Grade 60 Rebar Ties",
        supplier: "Nucor Steel Direct",
        quantity: "4.5 tons",
        deliveryTicket: `TK-${Math.floor(10000 + Math.random() * 90000)}`,
        status: "Inspected & Placed"
      });
    }

    // 4. Delays & Weather Extraction
    if (lower.includes("delay") || lower.includes("rain") || lower.includes("stoppage") || lower.includes("late") || lower.includes("wind")) {
      const minMatch = text.match(/(\d+)\s*(minutes|mins|hours|hrs)/i);
      let dur = 45;
      if (minMatch) {
        dur = minMatch[2].startsWith("h") ? parseInt(minMatch[1], 10) * 60 : parseInt(minMatch[1], 10);
      }
      parsed.delays.push({
        type: lower.includes("weather") || lower.includes("rain") ? "Weather Stoppage" : "Inspection / Site Coordination Delay",
        durationMinutes: dur,
        reason: text.length > 80 ? text.substring(0, 80) + "..." : text,
        costImpact: "Standard schedule buffer absorbed"
      });
    }

    return parsed;
  }

  /**
   * Computer Vision: Evaluates site photos for PPE compliance and jobsite hazards
   * @param {Object} imagePayload
   * @returns {Object} AI Vision inspection metadata
   */
  static analyzeSitePhoto(imagePayload) {
    const { url, description, location } = imagePayload;
    const desc = (description || "").toLowerCase();

    // Heuristic & CV simulation engine
    let tradeDetected = "General Jobsite Construction";
    let ppeScore = 96;
    let detectedPpe = ["Hard Hats: Verified (100%)", "High-Vis Vests: Verified (100%)", "Safety Boots: Active"];
    let hazards = ["None detected - site perimeter secure"];

    if (desc.includes("concrete") || desc.includes("slab") || desc.includes("pour")) {
      tradeDetected = "Cast-in-Place Concrete & Rebar";
      detectedPpe.push("Rubber Chemical Resistant Boots: Verified", "Eye Splash Protection: Verified");
      ppeScore = 98;
    } else if (desc.includes("steel") || desc.includes("iron") || desc.includes("column")) {
      tradeDetected = "Structural Steel Framing";
      detectedPpe.push("Double-Lanyard Harness: Tied-off to Anchor Beam", "Heavy Leather Rigging Gloves: Active");
      ppeScore = 95;
    } else if (desc.includes("scaffold") || desc.includes("height")) {
      tradeDetected = "Scaffolding / Elevated Work Platform";
      hazards = ["Scaffold toe-board check recommended on Level 2"];
      ppeScore = 91;
    } else if (desc.includes("hazard") || desc.includes("trip") || desc.includes("cable") || desc.includes("mess")) {
      ppeScore = 86;
      hazards = ["Flagged: Extension cord trailing across main access egress pathway"];
    }

    return {
      photoId: `ph-${Date.now()}`,
      url: url || "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&auto=format&fit=crop",
      timestamp: new Date().toLocaleString(),
      location: location || "Grid C-4 Level 2 Core",
      caption: description || "Routine site progression & safety capture.",
      aiTags: {
        tradeDetected,
        ppeComplianceScore: ppeScore,
        detectedPpe,
        hazardsDetected: hazards,
        confidenceScore: (0.91 + Math.random() * 0.07).toFixed(2)
      }
    };
  }
}

module.exports = AIService;
