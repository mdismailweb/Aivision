/**
 * Advanced Inception V3 Utilities
 * Batch processing, confidence filtering, and enhanced analysis
 */

import * as tf from '@tensorflow/tfjs';
import { preprocessImageInceptionV3 } from './inception-v3';
import { getInaturalistLabel, getCommonName } from './inaturalist-labels';

export interface PredictionResult {
  className: string;
  commonName: string;
  probability: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface BathProcessingResult {
  image: string;
  predictions: PredictionResult[];
  processingTime: number;
}

/**
 * Get confidence level based on probability
 */
export function getConfidenceLevel(probability: number): 'high' | 'medium' | 'low' {
  if (probability >= 0.7) return 'high';
  if (probability >= 0.5) return 'medium';
  return 'low';
}

/**
 * Filter predictions by minimum confidence threshold
 */
export function filterByConfidence(
  predictions: PredictionResult[],
  minProbability: number = 0.5
): PredictionResult[] {
  return predictions.filter(p => p.probability >= minProbability);
}

/**
 * Classify single image with enhanced results
 */
export async function classifyImageEnhanced(
  model: tf.GraphModel,
  imageElement: HTMLImageElement,
  topK: number = 5,
  minConfidence: number = 0
): Promise<PredictionResult[]> {
  const startTime = performance.now();
  
  try {
    const tensor = preprocessImageInceptionV3(imageElement, 299);
    const output = await model.predict(tensor) as tf.Tensor;
    const probabilities = await output.data();
    
    const predictions: PredictionResult[] = Array.from(probabilities)
      .map((p, i) => {
        const probability = p as number;
        const className = getInaturalistLabel(i);
        return {
          className,
          commonName: getCommonName(className),
          probability,
          confidence: getConfidenceLevel(probability)
        };
      })
      .sort((a, b) => b.probability - a.probability)
      .slice(0, topK);
    
    const filtered = filterByConfidence(predictions, minConfidence);
    const processingTime = performance.now() - startTime;
    
    // Log metrics
    console.log(`Classification completed in ${processingTime.toFixed(2)}ms`);
    console.log(`Top match: ${filtered[0]?.commonName} (${(filtered[0]?.probability || 0 * 100).toFixed(1)}%)`);
    
    tensor.dispose();
    output.dispose();
    
    return filtered;
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }
}

/**
 * Batch classify multiple images
 */
export async function batchClassifyImages(
  model: tf.GraphModel,
  imageElements: HTMLImageElement[],
  topK: number = 5
): Promise<BathProcessingResult[]> {
  const results: BathProcessingResult[] = [];
  const totalStartTime = performance.now();
  
  for (const img of imageElements) {
    const startTime = performance.now();
    
    try {
      const predictions = await classifyImageEnhanced(model, img, topK);
      const processingTime = performance.now() - startTime;
      
      results.push({
        image: img.src,
        predictions,
        processingTime
      });
    } catch (error) {
      console.error(`Failed to classify ${img.src}:`, error);
      results.push({
        image: img.src,
        predictions: [],
        processingTime: performance.now() - startTime
      });
    }
  }
  
  const totalTime = performance.now() - totalStartTime;
  console.log(`Batch processing completed: ${totalTime.toFixed(2)}ms total, ${imageElements.length} images`);
  
  return results;
}

/**
 * Get prediction statistics
 */
export interface PredictionStats {
  topProbability: number;
  averageProbability: number;
  confidenceDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  entropy: number;
}

export function calculatePredictionStats(predictions: PredictionResult[]): PredictionStats {
  if (predictions.length === 0) {
    return {
      topProbability: 0,
      averageProbability: 0,
      confidenceDistribution: { high: 0, medium: 0, low: 0 },
      entropy: 0
    };
  }
  
  const probs = predictions.map(p => p.probability);
  const topProbability = Math.max(...probs);
  const averageProbability = probs.reduce((a, b) => a + b, 0) / probs.length;
  
  // Calculate entropy (measure of uncertainty)
  const entropy = probs.reduce((sum, p) => {
    if (p <= 0) return sum;
    return sum - (p * Math.log2(p));
  }, 0);
  
  // Count confidence levels
  const confidenceDistribution = {
    high: predictions.filter(p => p.confidence === 'high').length,
    medium: predictions.filter(p => p.confidence === 'medium').length,
    low: predictions.filter(p => p.confidence === 'low').length
  };
  
  return {
    topProbability,
    averageProbability,
    confidenceDistribution,
    entropy
  };
}

/**
 * Compare two predictions
 */
export interface PredictionComparison {
  isDifferent: boolean;
  similarity: number;
  commonPredictions: PredictionResult[];
  uniqueInFirst: PredictionResult[];
  uniqueInSecond: PredictionResult[];
}

export function comparePredictions(
  predictions1: PredictionResult[],
  predictions2: PredictionResult[]
): PredictionComparison {
  const common = predictions1.filter(p1 =>
    predictions2.some(p2 => p1.className === p2.className)
  );
  
  const unique1 = predictions1.filter(p1 =>
    !predictions2.some(p2 => p1.className === p2.className)
  );
  
  const unique2 = predictions2.filter(p2 =>
    !predictions1.some(p1 => p1.className === p2.className)
  );
  
  const similarity = common.length / Math.max(predictions1.length, predictions2.length);
  
  return {
    isDifferent: !predictions1[0]?.className.includes(predictions2[0]?.className || ''),
    similarity,
    commonPredictions: common,
    uniqueInFirst: unique1,
    uniqueInSecond: unique2
  };
}

/**
 * Performance profiling
 */
export interface PerformanceProfile {
  modelLoadTime: number;
  preprocessingTime: number;
  inferenceTime: number;
  postprocessingTime: number;
  totalTime: number;
}

export async function profileClassification(
  model: tf.GraphModel,
  imageElement: HTMLImageElement
): Promise<PerformanceProfile> {
  const times = {
    preprocessing: 0,
    inference: 0,
    postprocessing: 0
  };
  
  // Preprocessing
  let preprocessStart = performance.now();
  const tensor = preprocessImageInceptionV3(imageElement, 299);
  times.preprocessing = performance.now() - preprocessStart;
  
  // Inference
  let inferenceStart = performance.now();
  const output = await model.predict(tensor) as tf.Tensor;
  times.inference = performance.now() - inferenceStart;
  
  // Postprocessing
  let postStart = performance.now();
  const data = await output.data();
  times.postprocessing = performance.now() - postStart;
  
  tensor.dispose();
  output.dispose();
  
  return {
    modelLoadTime: 0, // Would need to track separately
    preprocessingTime: times.preprocessing,
    inferenceTime: times.inference,
    postprocessingTime: times.postprocessing,
    totalTime: times.preprocessing + times.inference + times.postprocessing
  };
}

/**
 * Geographic filtering (if coordinates available)
 */
export interface GeographicFilter {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export function filterByGeography(
  predictions: PredictionResult[],
  filter: GeographicFilter
): PredictionResult[] {
  // This would require a species-location database
  // Placeholder for future implementation
  return predictions;
}

/**
 * Temporal filtering (by season)
 */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export function getSeasonFromDate(date: Date = new Date()): Season {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

export function filterBySeason(
  predictions: PredictionResult[],
  season: Season
): PredictionResult[] {
  // This would require a species-season database
  // Placeholder for future implementation
  return predictions;
}

/**
 * Export results in different formats
 */
export interface ExportFormat {
  csv: string;
  json: string;
  xml: string;
}

export function exportPredictions(
  predictions: PredictionResult[],
  imageSource: string = 'unknown'
): ExportFormat {
  // CSV format
  const csvHeader = 'Species,Common Name,Probability,Confidence\n';
  const csvRows = predictions.map(p =>
    `"${p.className}","${p.commonName}",${p.probability.toFixed(4)},${p.confidence}`
  ).join('\n');
  const csv = csvHeader + csvRows;
  
  // JSON format
  const json = JSON.stringify({
    imageSource,
    timestamp: new Date().toISOString(),
    predictions,
    stats: calculatePredictionStats(predictions)
  }, null, 2);
  
  // XML format
  const xmlRows = predictions.map(p => `
    <prediction>
      <species>${p.className}</species>
      <commonName>${p.commonName}</commonName>
      <probability>${p.probability.toFixed(4)}</probability>
      <confidence>${p.confidence}</confidence>
    </prediction>
  `).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<classifications>
  <metadata>
    <imageSource>${imageSource}</imageSource>
    <timestamp>${new Date().toISOString()}</timestamp>
  </metadata>
  <predictions>${xmlRows}
  </predictions>
</classifications>`;
  
  return { csv, json, xml };
}

/**
 * Model quality metrics
 */
export interface ModelMetrics {
  modelName: string;
  accuracy: string;
  latency: string;
  modelSize: string;
  parameters: string;
  trainingDataset: string;
}

export function getInceptionV3Metrics(): ModelMetrics {
  return {
    modelName: 'Inception V3 (iNaturalist)',
    accuracy: '70-85% (top-1), 85-95% (top-5)',
    latency: '0.5-4.0 seconds',
    modelSize: '~95 MB',
    parameters: '23.9 million',
    trainingDataset: 'iNaturalist research-grade observations'
  };
}
