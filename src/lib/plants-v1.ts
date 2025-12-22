import * as tflite from '@tensorflow/tfjs-tflite';
import * as tf from '@tensorflow/tfjs';
import { PLANTS_CLASSES } from './plants-classes';

// Configure TFLite wasm path for offline use
try {
    tflite.setWasmPath('/tflite/');
} catch (e) {
    console.warn("WASM path set error (might be already set):", e);
}

const MODEL_URL = '/models/plants-v1/model.tflite';

let plantsModel: tflite.TFLiteModel | null = null;

/**
 * Load iNaturalist Plants V1 TFLite model
 * MobileNet V2 trained on 2,102 plant species
 */
export async function loadPlantsModel(): Promise<tflite.TFLiteModel> {
    if (plantsModel) return plantsModel;

    console.log(`Loading iNaturalist Plants model from ${MODEL_URL}...`);
    try {
        plantsModel = await tflite.loadTFLiteModel(MODEL_URL);
        console.log('✓ iNaturalist Plants model loaded successfully (2,102 species)');
        return plantsModel;
    } catch (error) {
        console.error('Failed to load iNaturalist Plants model:', error);
        throw new Error('Failed to load iNaturalist Plants model. Check network connection and CORS.');
    }
}

/**
 * Preprocess image for iNaturalist Plants model
 * Input size: 224x224
 * Normalization: [0, 1] (quantized model expects normalized input)
 */
export function preprocessImagePlants(
    imageElement: HTMLImageElement
): tf.Tensor {
    return tf.tidy(() => {
        let tensor = tf.browser.fromPixels(imageElement);
        // Resize to 224x224 (MobileNet V2 standard)
        tensor = tf.image.resizeBilinear(tensor, [224, 224]);



        // DO NOT normalize - quantized model expects uint8 (0-255)
        // tensor = tensor.div(255.0);

        // Cast to int32 (TFLite will treat as uint8)
        tensor = tensor.toInt();

        // Add batch dimension [1, 224, 224, 3]
        tensor = tensor.expandDims(0);
        return tensor;
    });
}

/**
 * Get predictions from iNaturalist Plants model
 */
export async function getPlantsPredictions(
    model: tflite.TFLiteModel,
    inputTensor: tf.Tensor,
    topK: number = 5
): Promise<Array<{ className: string; probability: number }>> {

    // Run inference
    const outputTensor = model.predict(inputTensor) as tf.Tensor;
    const data = await outputTensor.data();

    console.log("Model output range:", Math.min(...data), "to", Math.max(...data));

    let values = Array.from(data);

    // Check if output is quantized (0-255) or already probabilities
    const maxVal = Math.max(...values);
    if (maxVal > 1.1) {
        // Dequantize: 0-255 -> 0-1
        values = values.map(v => v / 255.0);
    }

    // Get top K predictions
    const topIndices = values
        .map((prob, index) => ({ prob, index }))
        .sort((a, b) => b.prob - a.prob)
        .slice(0, topK);

    // Cleanup output tensor
    if (outputTensor) outputTensor.dispose();

    return topIndices.map(({ prob, index }) => ({
        className: PLANTS_CLASSES[index] || `Unknown (${index})`,
        probability: prob,
    }));
}
