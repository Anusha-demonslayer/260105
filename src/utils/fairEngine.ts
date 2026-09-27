import { FairModelInputs, MonteCarloResult, SecurityControl } from '../types/cyberrisk';

/**
 * Samples a value from a Beta-PERT distribution given min, mode, and max.
 * Beta-PERT is the industry standard for FAIR (Factor Analysis of Information Risk).
 */
export function sampleBetaPert(min: number, mode: number, max: number, lambda = 4): number {
  if (min === max) return min;
  const alpha = 1 + lambda * ((mode - min) / (max - min));
  const beta = 1 + lambda * ((max - mode) / (max - min));
  
  // Quick approx for Beta distribution using inverse transform or rejection method
  // Johnk's generator for Beta distribution
  let u1 = 0;
  let u2 = 0;
  let x = 0;
  let y = 0;
  let sum = 0;
  
  // Rejection sampling for Beta(alpha, beta)
  for (let i = 0; i < 50; i++) {
    u1 = Math.random();
    u2 = Math.random();
    x = Math.pow(u1, 1 / alpha);
    y = Math.pow(u2, 1 / beta);
    sum = x + y;
    if (sum <= 1) {
      const betaRandom = x / sum;
      return min + betaRandom * (max - min);
    }
  }
  
  // Fallback to triangular distribution if sampling times out
  const u = Math.random();
  const c = (mode - min) / (max - min);
  if (u < c) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

/**
 * Calculates effective vulnerability (probability that threat event becomes a loss event)
 * based on Threat Capability (TCap) and Control Strength (CS).
 */
export function calculateVulnerability(tcap: number, cs: number): number {
  // Logistic function comparing TCap and CS
  const diff = (tcap - cs) / 20;
  const prob = 1 / (1 + Math.exp(-diff));
  return Math.min(Math.max(prob, 0.02), 0.98);
}

/**
 * Executes a full FAIR Monte Carlo simulation.
 */
export function runFairMonteCarloSimulation(
  baseInputs: FairModelInputs,
  activeControls: SecurityControl[],
  iterations = 5000
): MonteCarloResult {
  // Aggregate control mitigation
  let effectiveControlStrength = baseInputs.controlStrengthMode;
  let totalCost = 0;
  
  // Calculate compounding risk reduction factor
  let remainingRiskMultiplier = 1.0;
  for (const control of activeControls) {
    if (control.isActive) {
      remainingRiskMultiplier *= (1 - control.riskReductionFactor * 0.45);
      effectiveControlStrength = Math.min(98, effectiveControlStrength + control.riskReductionFactor * 18);
      totalCost += control.annualCost;
    }
  }
  
  const annualLosses: number[] = new Array(iterations);
  let totalLossSum = 0;
  let totalEventsSum = 0;

  for (let i = 0; i < iterations; i++) {
    // 1. Sample Threat Event Frequency (TEF)
    const tef = Math.max(0, sampleBetaPert(
      baseInputs.threatEventFrequencyMin,
      baseInputs.threatEventFrequencyMode,
      baseInputs.threatEventFrequencyMax
    ));

    // 2. Sample Vulnerability (TCap vs CS)
    const tcap = sampleBetaPert(
      Math.max(10, baseInputs.threatCapabilityMode - 15),
      baseInputs.threatCapabilityMode,
      Math.min(99, baseInputs.threatCapabilityMode + 15)
    );
    
    const cs = sampleBetaPert(
      Math.max(5, effectiveControlStrength - 15),
      effectiveControlStrength,
      Math.min(99, effectiveControlStrength + 10)
    );

    const vulnProb = calculateVulnerability(tcap, cs);

    // 3. Loss Event Frequency (LEF) = TEF * Vuln
    // Using Poisson approximation for event counts
    const expectedEvents = tef * vulnProb;
    const actualEvents = Math.floor(expectedEvents + (Math.random() < (expectedEvents % 1) ? 1 : 0));
    totalEventsSum += actualEvents;

    let iterationLoss = 0;
    if (actualEvents > 0) {
      for (let e = 0; e < actualEvents; e++) {
        // Primary Loss Magnitude
        const primary = sampleBetaPert(
          baseInputs.primaryLossMin,
          baseInputs.primaryLossMode,
          baseInputs.primaryLossMax
        );

        // Secondary Loss Magnitude (occurs with secondaryLossProbability)
        let secondary = 0;
        if (Math.random() < baseInputs.secondaryLossProbability) {
          secondary = sampleBetaPert(
            baseInputs.secondaryLossMin,
            baseInputs.secondaryLossMode,
            baseInputs.secondaryLossMax
          );
        }

        iterationLoss += (primary + secondary) * remainingRiskMultiplier;
      }
    }

    annualLosses[i] = iterationLoss;
    totalLossSum += iterationLoss;
  }

  // Sort losses for percentile calculations
  annualLosses.sort((a, b) => a - b);

  const annualizedLossExpectancy = totalLossSum / iterations;
  const p50Index = Math.floor(iterations * 0.5);
  const p95Index = Math.floor(iterations * 0.95);
  const p99Index = Math.floor(iterations * 0.99);

  const medianLoss = annualLosses[p50Index] || 0;
  const var95 = annualLosses[p95Index] || 0;
  const var99 = annualLosses[p99Index] || 0;
  const minLoss = annualLosses[0] || 0;
  const maxLoss = annualLosses[iterations - 1] || 0;
  const lossEventFrequencyMean = totalEventsSum / iterations;

  // Build histogram buckets
  const bucketCount = 12;
  const maxValForBuckets = Math.max(var99 * 1.15, 100000);
  const bucketSize = maxValForBuckets / bucketCount;
  const buckets: { bucket: string; count: number; lossRangeMax: number }[] = [];

  for (let b = 0; b < bucketCount; b++) {
    const low = b * bucketSize;
    const high = (b + 1) * bucketSize;
    const count = annualLosses.filter(l => l >= low && (b === bucketCount - 1 ? l <= high * 2 : l < high)).length;
    buckets.push({
      bucket: `$${formatAbbreviatedMoney(low)} - $${formatAbbreviatedMoney(high)}`,
      count,
      lossRangeMax: high,
    });
  }

  // Build Loss Exceedance Curve (LEC)
  const lecThresholds = [50000, 100000, 250000, 500000, 1000000, 2000000, 3500000, 5000000, 7500000, 10000000];
  const lossExceedanceCurve = lecThresholds.map(thresh => {
    const exceedCount = annualLosses.filter(l => l >= thresh).length;
    return {
      threshold: thresh,
      probability: (exceedCount / iterations) * 100,
    };
  });

  return {
    iterations,
    annualizedLossExpectancy,
    medianLoss,
    var95,
    var99,
    minLoss,
    maxLoss,
    lossEventFrequencyMean,
    distributionHistogram: buckets,
    lossExceedanceCurve,
  };
}

/**
 * Calculates Return on Security Investment (ROSI).
 * Formula: ROSI (%) = ((Risk Reduction - Annual Cost of Control) / Annual Cost of Control) * 100
 */
export function calculateROSI(
  baselineALE: number,
  mitigatedALE: number,
  annualCost: number
): { rosiPercentage: number; netBenefit: number; riskMitigated: number } {
  const riskMitigated = Math.max(0, baselineALE - mitigatedALE);
  const netBenefit = riskMitigated - annualCost;
  const rosiPercentage = annualCost > 0 ? (netBenefit / annualCost) * 100 : 0;

  return {
    rosiPercentage,
    netBenefit,
    riskMitigated,
  };
}

/**
 * Helper to format money with K / M suffix.
 */
export function formatAbbreviatedMoney(val: number): string {
  if (val >= 1000000) {
    return (val / 1000000).toFixed(1) + 'M';
  }
  if (val >= 1000) {
    return (val / 1000).toFixed(0) + 'K';
  }
  return val.toFixed(0);
}

/**
 * Currency Formatter: Supports USD ($) and Indian Rupee (₹ INR) for Smart India Hackathon.
 */
export function formatCurrency(val: number, currency: 'USD' | 'INR' = 'USD'): string {
  if (currency === 'INR') {
    // 1 USD approx 86 INR
    const inrVal = val * 86;
    if (inrVal >= 10000000) {
      return `₹${(inrVal / 10000000).toFixed(2)} Cr`;
    }
    if (inrVal >= 100000) {
      return `₹${(inrVal / 100000).toFixed(2)} Lakh`;
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(inrVal);
  }

  if (val >= 1000000) {
    return `$${(val / 1000000).toFixed(2)}M`;
  }
  if (val >= 1000) {
    return `$${(val / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}
