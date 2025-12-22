'use client';
import { useState, useEffect } from 'react';
import { loadInaturalistModel, classifyImage } from '@/utils/loadModel';

export default function VisionApp() {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    loadInaturalistModel()
      .then(setModel)
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !model) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = async () => {
      const results = await classifyImage(model, img);
      setPredictions(results);
    };
  };

  return (
    <div>
      {loading && <p>Loading AI model...</p>}
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      {predictions.map((pred, i) => (
        <div key={i}>
          Class {pred.index}: {(pred.score * 100).toFixed(2)}%
        </div>
      ))}
    </div>
  );
}
