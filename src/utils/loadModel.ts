import * as tf from '@tensorflow/tfjs';

let cachedModel: tf.GraphModel | null = null;

export async function loadInaturalistModel() {
  if (cachedModel) {
    return cachedModel;
  }

  console.log('Loading iNaturalist model...');
  
  try {
    const model = await tf.loadGraphModel('/models/inaturalist/model.json');
    cachedModel = model;
    console.log('✅ Model loaded successfully!');
    return model;
  } catch (error) {
    console.error('❌ Failed to load model:', error);
    throw error;
  }
}

export async function classifyImage(model: tf.GraphModel, imageElement: HTMLImageElement) {
  // Preprocess image
  const tensor = tf.browser.fromPixels(imageElement)
    .resizeNearestNeighbor([299, 299]) // iNaturalist Inception V3 uses 299x299
    .toFloat()
    .div(255.0)
    .expandDims(0);

  // Run inference
  const predictions = await model.predict(tensor) as tf.Tensor;
  const scores = await predictions.data();
  
  // Get top 5 predictions
  const top5 = Array.from(scores)
    .map((score, index) => ({ score, index }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  tensor.dispose();
  predictions.dispose();

  return top5;
}
