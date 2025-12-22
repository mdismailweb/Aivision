'use client';

import * as tf from '@tensorflow/tfjs';
import * as tflite from '@tensorflow/tfjs-tflite';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Flower2,
  Upload,
  Loader,
  BrainCircuit,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { getAccuracyTips, getFlowerSummary } from './actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Import Plants V1 logic (TFLite)
import {
  loadPlantsModel,
  preprocessImagePlants,
  getPlantsPredictions
} from '@/lib/plants-v1';
import { getCommonName } from '@/lib/inaturalist-labels';

type Prediction = {
  className: string;
  probability: number;
};

export default function Home() {
  const [model, setModel] = useState<tflite.TFLiteModel | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<{
    model: boolean;
    classifying: boolean;
    summary: boolean;
  }>({ model: true, classifying: false, summary: false });
  const [error, setError] = useState<string | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading({ model: true, classifying: false, summary: false });
        setError(null);
        await tf.ready();

        // Load Plants V1 Model (TFLite)
        const loadedModel = await loadPlantsModel();
        setModel(loadedModel);

        console.log('Plants V1 model loaded successfully for offline use');
      } catch (err) {
        console.error(err);
        setError(
          'Failed to load the Plants V1 model. Please check your internet connection. We are loading a specialized flower model.'
        );
      } finally {
        setLoading((prevState) => ({ ...prevState, model: false }));
      }
    };
    loadModel();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const file = files[0];
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setPredictions([]);
      setTips([]);
      setSummary('');
      setError(null);
    }
  };

  const classifyImage = async () => {
    if (model && imageRef.current) {
      setLoading((prev) => ({ ...prev, classifying: true, summary: true }));
      setError(null);
      try {
        const imageElement = imageRef.current;

        // Preprocess image for Plants V1 (224x224, 0-1 range)
        const tensor = preprocessImagePlants(imageElement);

        // Get predictions
        const top5 = await getPlantsPredictions(model, tensor);

        // Clean up input tensor
        tensor.dispose();

        setPredictions(top5);

        if (top5.length > 0) {
          const topPrediction = top5[0].className.split(',')[0];
          fetchAccuracyTips(topPrediction);
          fetchFlowerSummary(topPrediction);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to classify the image. Please try a different image.');
        setPredictions([]);
      } finally {
        setLoading((prev) => ({ ...prev, classifying: false }));
      }
    }
  };

  const fetchAccuracyTips = async (flowerType: string) => {
    try {
      const { tips } = await getAccuracyTips(flowerType);
      setTips(tips);
    } catch (err) {
      console.error('Failed to fetch accuracy tips:', err);
    }
  };

  const fetchFlowerSummary = async (flowerName: string) => {
    setLoading((prev) => ({ ...prev, summary: true }));
    try {
      const { summary } = await getFlowerSummary(flowerName);
      setSummary(summary);
    } catch (err) {
      console.error('Failed to fetch flower summary:', err);
    } finally {
      setLoading((prev) => ({ ...prev, summary: false }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <Flower2 className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          FloraFind
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Upload a picture of a flower, and our offline AI will identify it for you.
        </p>
        <p className="text-sm font-medium text-primary mt-2">
          Supports 2,100+ plant species (iNaturalist)
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full max-w-2xl mx-auto mb-8"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>How accurate is FloraFind?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            FloraFind uses the Google Plants V1 model, trained specifically on over 2,100 plant species from iNaturalist. It works best with clear, close-up photos.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Your Flower
            </CardTitle>
            <CardDescription>
              Select an image file from your device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-full h-80 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-card relative overflow-hidden">
                {imageUrl ? (
                  <Image
                    ref={imageRef}
                    src={imageUrl}
                    alt="Uploaded flower"
                    fill
                    className="object-contain"
                    onLoad={classifyImage}
                    unoptimized
                    crossOrigin="anonymous"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    Image preview will appear here
                  </p>
                )}
              </div>
              <Button
                onClick={triggerFileInput}
                className="w-full"
                disabled={loading.model || loading.classifying}
              >
                {(loading.model || loading.classifying) && (
                  <Loader className="mr-2 animate-spin" />
                )}
                {loading.model
                  ? 'Loading Plants Model...'
                  : loading.classifying
                    ? 'Identifying Species...'
                    : 'Upload Image'}
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="w-6 h-6" />
                AI Predictions
              </CardTitle>
              <CardDescription>
                Top matches for your uploaded image.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading.model ? (
                <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                  <Loader className="mb-2 animate-spin" />
                  <span>Loading specialized plants model...</span>
                </div>
              ) : loading.classifying ? (
                <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                  <Loader className="mb-2 animate-spin" />
                  <span>Identifying species...</span>
                </div>
              ) : predictions.length > 0 ? (
                <div className="space-y-4">
                  {predictions.slice(0, 5).map((pred, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <p className="font-medium text-card-foreground">
                            {getCommonName(pred.className) || pred.className}
                          </p>
                          <p className="text-xs text-muted-foreground italic">
                            {pred.className}
                          </p>
                        </div>
                        <p className="text-sm font-mono text-muted-foreground">
                          {(pred.probability * 100).toFixed(1)}%
                        </p>
                      </div>
                      <Progress
                        value={pred.probability * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <p className="text-center text-muted-foreground p-8">
                  Upload an image to see predictions.
                </p>
              )}
            </CardContent>
            {summary && !loading.summary && (
              <CardFooter className="bg-muted/50 p-4 border-t">
                <p className="text-sm text-muted-foreground">{summary}</p>
              </CardFooter>
            )}
            {loading.summary && (
              <CardFooter className="bg-muted/50 p-4 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader className="mr-2 animate-spin" />
                  <span>Generating summary...</span>
                </div>
              </CardFooter>
            )}

          </Card>

          {tips.length > 0 && (
            <Card className="shadow-lg animate-in fade-in duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  Accuracy Tips
                </CardTitle>
                <CardDescription>
                  For even better results, try these tips:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  {tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
