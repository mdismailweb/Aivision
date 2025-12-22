/**
 * Model Caching and Offline Support Utilities
 * Handles automatic caching of Inception V3 model for offline use
 */

import * as tf from '@tensorflow/tfjs';

const MODEL_CACHE_NAME = 'inception-v3-model-v1';
const MODEL_CACHE_KEY = 'inception-v3-cached';

/**
 * Check if model is already cached in browser
 */
export async function isModelCached(): Promise<boolean> {
  try {
    const cache = await caches.open(MODEL_CACHE_NAME);
    const response = await cache.match('model.json');
    return !!response;
  } catch {
    return false;
  }
}

/**
 * Get cached model if available
 */
export async function loadCachedModel(): Promise<tf.GraphModel | null> {
  try {
    const cached = await isModelCached();
    if (cached) {
      const model = await tf.loadGraphModel(`indexeddb://inception-v3`);
      return model;
    }
  } catch (error) {
    console.warn('Failed to load cached model:', error);
  }
  return null;
}

/**
 * Cache model after downloading for offline use
 */
export async function cacheModelLocally(model: tf.GraphModel): Promise<void> {
  try {
    // Save to IndexedDB for persistence
    await model.save(`indexeddb://inception-v3`);
    console.log('Model cached successfully for offline use');
  } catch (error) {
    console.warn('Failed to cache model:', error);
    // Non-critical, model will still work but won't be cached
  }
}

/**
 * Clear cached model if needed
 */
export async function clearModelCache(): Promise<void> {
  try {
    // Clear IndexedDB cache
    const idbDbs = await (window.indexedDB as any).databases?.();
    if (idbDbs) {
      idbDbs.forEach((db: any) => {
        if (db.name.includes('inception')) {
          window.indexedDB.deleteDatabase(db.name);
        }
      });
    }
    
    // Clear service worker cache
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(name => {
        if (name.includes('inception')) {
          return caches.delete(name);
        }
      })
    );
    
    console.log('Model cache cleared');
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}

/**
 * Get cache size info
 */
export async function getModelCacheSize(): Promise<number> {
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
  } catch (error) {
    console.warn('Could not determine cache size:', error);
  }
  return 0;
}

/**
 * Monitor model loading progress
 */
export function createProgressMonitor(onProgress: (progress: number) => void) {
  return {
    onProgress: (progress: ProgressEvent) => {
      if (progress.lengthComputable) {
        const percentComplete = (progress.loaded / progress.total) * 100;
        onProgress(percentComplete);
      }
    }
  };
}

/**
 * Get model info
 */
export function getModelInfo() {
  return {
    name: 'Inception V3',
    dataset: 'iNaturalist',
    size: '~95 MB',
    classes: '1000+ species',
    inputSize: '299x299 pixels',
    architecture: 'Google Inception V3',
    url: 'https://tfhub.dev/google/imagenet/inception_v3/classification/5',
  };
}

/**
 * Verify model integrity (optional)
 */
export async function verifyModelIntegrity(): Promise<boolean> {
  try {
    const model = await loadCachedModel();
    if (!model) {
      return false;
    }
    
    // Check if model has expected properties
    const inputShape = model.inputs[0].shape;
    return Array.isArray(inputShape) && inputShape[1] === 299;
  } catch (error) {
    console.error('Model integrity check failed:', error);
    return false;
  }
}

/**
 * Estimate download time based on connection speed
 */
export function estimateDownloadTime(fileSize: number = 95 * 1024 * 1024): number {
  // Estimate based on typical connection speeds
  const speeds = {
    '5G': 100, // Mbps
    '4G LTE': 20,
    '3G': 2,
    'WiFi': 50,
    'Fiber': 300
  };
  
  // Average to 50 Mbps for estimate
  const avgSpeed = 50;
  const timeSeconds = (fileSize * 8) / (avgSpeed * 1000000);
  return timeSeconds;
}

/**
 * Storage quota info
 */
export async function getStorageQuotaInfo() {
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota,
        usage: estimate.usage,
        available: (estimate.quota || 0) - (estimate.usage || 0),
        percentUsed: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
      };
    }
  } catch (error) {
    console.warn('Could not get storage quota:', error);
  }
  return null;
}

/**
 * Cleanup old model caches
 */
export async function cleanupOldCaches(): Promise<void> {
  try {
    const cacheNames = await caches.keys();
    const cachePromises = cacheNames
      .filter(name => name.includes('inception') && !name.includes(MODEL_CACHE_NAME))
      .map(name => caches.delete(name));
    
    await Promise.all(cachePromises);
    console.log('Cleaned up old model caches');
  } catch (error) {
    console.warn('Failed to cleanup caches:', error);
  }
}
