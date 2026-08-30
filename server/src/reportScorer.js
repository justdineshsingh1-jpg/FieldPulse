/**
 * Report Health & Completeness Scoring Engine
 */

class ReportScorer {
  /**
   * Evaluates a daily log object and returns a score (0 - 100), letter grade, and actionable cleanup recommendations
   * @param {Object} log
   * @returns {Object} Health score summary
   */
  static calculateHealthScore(log) {
    let score = 0;
    const maxScore = 100;
    const breakdown = {
      laborLogged: 0,
      equipmentTelematicsSync: 0,
      photoEvidence: 0,
      safetyChecks: 0,
      delayDocumentation: 0
    };
    const recommendations = [];

    // 1. Labor Evaluation (25 pts max)
    if (log.laborEntries && log.laborEntries.length > 0) {
      let validCostCodes = log.laborEntries.filter(e => e.costCode && e.costCode.length > 3).length;
      let totalEntries = log.laborEntries.length;
      let ratio = validCostCodes / totalEntries;
      breakdown.laborLogged = Math.round(25 * ratio);
      score += breakdown.laborLogged;

      if (ratio < 1) {
        recommendations.push(`Assign standard CSI / WBS cost codes to ${totalEntries - validCostCodes} labor trade entries.`);
      }
    } else {
      recommendations.push("Critical: No crew labor entries recorded for today's shift.");
    }

    // 2. Equipment Telematics (20 pts max)
    if (log.equipmentEntries && log.equipmentEntries.length > 0) {
      breakdown.equipmentTelematicsSync = 20;
      score += 20;
    } else {
      breakdown.equipmentTelematicsSync = 10;
      score += 10;
      recommendations.push("Recommendation: Sync active heavy machinery operating hours or confirm no equipment was mobilized.");
    }

    // 3. Photo Evidence (25 pts max)
    if (log.photos && log.photos.length >= 2) {
      breakdown.photoEvidence = 25;
      score += 25;
    } else if (log.photos && log.photos.length === 1) {
      breakdown.photoEvidence = 15;
      score += 15;
      recommendations.push("Upload at least 2 timestamped visual progress photos for audit compliance.");
    } else {
      breakdown.photoEvidence = 0;
      recommendations.push("Critical: Missing photographic evidence of site progress.");
    }

    // 4. Safety & Toolbox Talk (15 pts max)
    if (log.weather && log.weather.summary) {
      breakdown.safetyChecks += 15;
      score += 15;
    } else {
      recommendations.push("Add weather conditions and jobsite safety observations.");
    }

    // 5. Delays & Notes (15 pts max)
    if (log.delays && log.delays.length > 0) {
      const hasReason = log.delays.every(d => d.reason && d.reason.length > 10);
      breakdown.delayDocumentation = hasReason ? 15 : 10;
      score += breakdown.delayDocumentation;
    } else {
      // If no delays, award full credit as clean shift
      breakdown.delayDocumentation = 15;
      score += 15;
    }

    // Determine Letter Grade
    let grade = "A";
    let status = "Ready for Executive Approval";

    if (score < 60) {
      grade = "F";
      status = "Rejected - Requires Major Field Corrections";
    } else if (score < 75) {
      grade = "C";
      status = "Incomplete - Missing Required Compliance Elements";
    } else if (score < 88) {
      grade = "B";
      status = "Minor Discrepancies - Review Recommended";
    }

    return {
      score: Math.min(score, maxScore),
      grade,
      status,
      breakdown,
      recommendations
    };
  }
}

module.exports = ReportScorer;
