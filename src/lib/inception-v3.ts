import * as tf from '@tensorflow/tfjs';
import { IMAGENET_CLASSES } from './imagenet-classes';

// Path to locally downloaded model (relative to public folder)
const LOCAL_MODEL_PATHS = [
  '/models/inception-v3/model.json', // Correct local location
];

// TensorFlow.js compatible model URLs from TFHub
const REMOTE_MODEL_PATHS = [
  'https://www.kaggle.com/models/google/inception-v3/TfJs/classification/2',  // Kaggle TFJS model
  'https://tfhub.dev/google/tfjs-model/imagenet/inception_v3/classification/5/default/1',  // TFHub TFJS model
];

/**
 * Load Inception V3 model (ImageNet trained)
 * Tries local model first, then falls back to remote URLs
 */
export async function loadInceptionV3Model(): Promise<tf.GraphModel> {
  // Try local model first
  for (const path of LOCAL_MODEL_PATHS) {
    try {
      console.log(`Attempting to load local model from: ${path}`);
      const model = await tf.loadGraphModel(path);
      console.log(`✓ Local Inception V3 model loaded successfully from ${path}`);
      return model;
    } catch (localError) {
      console.warn(`Local model not found at ${path}`, localError);
    }
  }

  console.warn('No local models found, attempting remote URLs...');

  // Try remote URLs as fallback
  for (const url of REMOTE_MODEL_PATHS) {
    try {
      console.log(`Attempting to load from: ${url}`);
      // TFHub URLs need {fromTFHub: true} option
      const isTFHub = url.includes('tfhub.dev') || url.includes('kaggle.com/models');
      const model = await tf.loadGraphModel(url, { fromTFHub: isTFHub });
      console.log(`✓ Inception V3 model loaded successfully from ${url}`);
      return model;
    } catch (remoteError) {
      console.warn(`Failed to load from ${url}:`, remoteError);
    }
  }

  throw new Error(
    'Failed to load Inception V3 model. Please ensure the model is downloaded to public/models/inception-v3/.'
  );
}

/**
 * Preprocess image for Inception V3
 * Input size: 299x299 pixels
 * Normalization: [-1, 1] range
 */
export function preprocessImageInceptionV3(
  imageElement: HTMLImageElement,
  imageSize: number = 299
): tf.Tensor {
  return tf.tidy(() => {
    // Convert image to tensor
    let tensor = tf.browser.fromPixels(imageElement);

    // Resize to model input size (299x299 for Inception V3)
    tensor = tf.image.resizeBilinear(tensor, [imageSize, imageSize]);

    // Convert to float
    tensor = tensor.toFloat();

    // Normalize to [-1, 1] range (standard for Inception V3)
    const offset = tf.scalar(127.5);
    tensor = tensor.sub(offset).div(offset);

    // Add batch dimension
    tensor = tensor.expandDims(0);

    return tensor;
  });
}

/**
 * Get predictions with clean labels
 */
export async function getPredictions(
  modelOutput: tf.Tensor,
  topK: number = 5
): Promise<Array<{ className: string; probability: number }>> {
  return tf.tidy(() => {
    // Apply softmax to get probabilities
    const probabilities = tf.softmax(modelOutput).dataSync();

    // Get top K predictions
    const topIndices = Array.from(probabilities)
      .map((prob, index) => ({ prob: prob as number, index }))
      .sort((a, b) => b.prob - a.prob)
      .slice(0, topK);

    return topIndices.map(({ prob, index }) => ({
      className: IMAGENET_CLASSES[index] || `Unknown (${index})`,
      probability: prob,
    }));
  });
}
