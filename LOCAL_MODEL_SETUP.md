# 📥 Inception V3 - Local Model Setup Guide

## Overview

Your Vision App now supports **locally downloaded Inception V3 models** for completely offline operation without any CORS or internet issues.

---

## Step 1: Download Model Using Kaggle Hub

### Install kagglehub
```bash
pip install kagglehub
```

### Download the Model
```bash
python
```

```python
import kagglehub

# Download latest version
path = kagglehub.model_download("google/inception-v3/tensorFlow2/classification")

print("Path to model files:", path)
```

This will download the model to your local machine. Note the path where it's downloaded.

---

## Step 2: Prepare Model Files

### Extract Model Files

After download, you should have files like:
```
saved_model/
├── model.json              (or keras_metadata.pb)
├── model.pb
├── variables/
│   ├── variables.index
│   ├── variables.data-00000-of-00001
│   └── ...
└── assets/
    └── ...
```

### For TensorFlow SavedModel Format

If downloaded as SavedModel, convert to TensorFlow.js format:

```bash
# Install TensorFlow.js converter
pip install tensorflowjs

# Convert the model
tensorflowjs_converter \
  --input_format tf_saved_model \
  --output_format tfjs_graph_model \
  path/to/saved_model \
  public/models/inception-v3
```

---

## Step 3: Add Files to Project

### Create Directory Structure
```bash
# Create model directory in project
mkdir -p public/models/inception-v3
```

### Copy Model Files
```bash
# Copy converted model files
cp -r path/to/converted/model/* public/models/inception-v3/
```

### Expected Files
```
public/
└── models/
    └── inception-v3/
        ├── model.json              # Model definition
        ├── model.pb                # Model graph
        ├── group1-shard*.bin       # Model weights (multiple files)
        └── [other model files]
```

---

## Step 4: Verify Setup

### Check Files Exist
```bash
# List model files (from project root)
ls -la public/models/inception-v3/
```

Should see:
```
model.json
model.pb
group1-shard1of*.bin
group1-shard2of*.bin
... (multiple weight files)
```

### Test File Size
The model files should total ~95 MB:
```bash
du -sh public/models/inception-v3/
```

Should show approximately `95M` or similar.

---

## Step 5: Run the App

```bash
# Start development server
npm run dev
```

### Access the App
```
http://localhost:9002
```

### Expected Behavior

1. **Page loads** - No errors
2. **Upload image** - Button works
3. **Model loads** - Takes only a few seconds (local loading)
4. **Results appear** - Shows top 5 species predictions

---

## How It Works

### Loading Priority (in order)

1. **Local Model** (fastest)
   ```
   /models/inception-v3/model.json
   Located in: public/models/inception-v3/
   Speed: <1 second
   ```

2. **Google Cloud Storage** (backup)
   ```
   https://storage.googleapis.com/tfhub-modules/...
   Speed: 30-60 seconds
   Requires internet
   ```

3. **TensorFlow Hub** (fallback)
   ```
   https://tfhub.dev/google/imagenet/inception_v3/...
   Speed: 30-60 seconds
   Requires internet
   ```

---

## Folder Structure After Setup

```
visionapp/
├── public/
│   └── models/
│       └── inception-v3/
│           ├── model.json          ← Model definition
│           ├── model.pb            ← Graph definition
│           ├── group1-shard1of2.bin ← Weights part 1
│           ├── group1-shard2of2.bin ← Weights part 2
│           └── ... (other model files)
├── src/
│   ├── lib/
│   │   ├── inception-v3.ts         ← Updated to support local model
│   │   ├── inaturalist-labels.ts
│   │   └── ...
│   └── app/
│       └── page.tsx
├── package.json
├── next.config.ts
└── ... (other files)
```

---

## Model File Formats

### TensorFlow.js Format (Recommended)
```
model.json          - Model topology and metadata
group1-shard*.bin   - Model weights (one or multiple files)
```

### SavedModel Format (Original)
```
saved_model/
├── assets/
├── variables/
│   ├── variables.index
│   └── variables.data-*.pb
└── saved_model.pb
```

**Must convert SavedModel to TFJS format using the converter tool above.**

---

## Conversion Guide (If Needed)

### Prerequisites
```bash
pip install tensorflowjs
```

### Convert SavedModel to TFJS
```bash
tensorflowjs_converter \
  --input_format tf_saved_model \
  --output_format tfjs_graph_model \
  --weight_shard_size 67108864 \
  /path/to/saved_model \
  public/models/inception-v3
```

### Convert Keras Model to TFJS
```bash
tensorflowjs_converter \
  --input_format tf_keras \
  /path/to/model.h5 \
  public/models/inception-v3
```

### Verify Conversion
```bash
# Check if model.json exists and is valid
cat public/models/inception-v3/model.json | head -20
```

Should show JSON with model structure.

---

## Troubleshooting

### Model Still Not Loading?

1. **Check file path**
   ```bash
   ls public/models/inception-v3/model.json
   # Should show the file exists
   ```

2. **Check model.json validity**
   ```bash
   # Should be valid JSON
   python -m json.tool public/models/inception-v3/model.json
   ```

3. **Check browser console** (F12)
   - Look for file path errors
   - Check network tab for 404 errors
   - Verify files are being served

4. **Rebuild app**
   ```bash
   npm run build
   npm start
   ```

### Model Files Missing?

1. **Verify download**
   ```bash
   # Check downloaded model exists
   ls path/to/kagglehub/download
   ```

2. **Re-download if needed**
   ```python
   import kagglehub
   kagglehub.model_download("google/inception-v3/tensorFlow2/classification")
   ```

3. **Copy files again**
   ```bash
   cp -r path/to/model/* public/models/inception-v3/
   ```

### Large File Issues?

If model files are >200MB total:
1. Use weight sharding (done automatically in conversion)
2. Check that conversion completed successfully
3. Verify all shard files (.bin files) are present

---

## Performance Comparison

### Local Model (Recommended)
- **First Load**: <1 second (no download)
- **Subsequent Loads**: <1 second (cached)
- **Per Image**: 0.5-4 seconds
- **Total Time**: ~5 seconds (first image)
- **Requires**: ~95 MB disk space
- **Offline**: ✓ Yes

### Remote Model (Fallback)
- **First Load**: 30-60 seconds (download + cache)
- **Subsequent Loads**: <5 seconds (cached)
- **Per Image**: 0.5-4 seconds
- **Total Time**: ~90 seconds (first image)
- **Requires**: ~95 MB disk space + internet
- **Offline**: ✗ No (first time)

---

## Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Include Model Files
Make sure `public/models/inception-v3/` is included:
```bash
# Check build
ls -la .next/static/
# Model files should be in public folder, accessible from server
```

### Serve Static Files
```bash
# Model files are served as static assets
# Next.js automatically serves files from public/ folder
# No additional configuration needed
```

### File Size Considerations
- Total model: ~95 MB
- Initial page load: Normal (model loads on demand)
- Per request: Cached by browser
- Bandwidth: Only first load requires ~95 MB transfer

---

## Verification Checklist

- [ ] Model downloaded using kagglehub
- [ ] Model files converted to TFJS format (if needed)
- [ ] Files copied to `public/models/inception-v3/`
- [ ] `model.json` exists and is valid JSON
- [ ] All weight files (.bin files) are present
- [ ] No 404 errors in browser console
- [ ] App loads without errors
- [ ] Image upload works
- [ ] Model loads in <1 second
- [ ] Predictions display correctly

---

## Next Steps

1. ✓ Download model using kagglehub
2. ✓ Convert to TFJS format if needed
3. ✓ Copy files to public/models/inception-v3/
4. ✓ Run app with `npm run dev`
5. ✓ Test with image upload
6. ✓ Verify fast model loading
7. ✓ Deploy to production

---

## Quick Commands Summary

```bash
# Install kagglehub
pip install kagglehub

# Download model
python << 'EOF'
import kagglehub
path = kagglehub.model_download("google/inception-v3/tensorFlow2/classification")
print("Downloaded to:", path)
EOF

# Install converter (if needed)
pip install tensorflowjs

# Convert model (if needed)
tensorflowjs_converter \
  --input_format tf_saved_model \
  --output_format tfjs_graph_model \
  /path/to/saved_model \
  public/models/inception-v3

# Copy files to project
cp -r /path/to/converted/* public/models/inception-v3/

# Run app
npm run dev

# Open browser
open http://localhost:9002
```

---

## References

- **Kaggle Hub**: https://github.com/Kaggle/kagglehub
- **TensorFlow.js Converter**: https://github.com/tensorflow/tfjs/tree/master/tfjs-converter
- **TensorFlow.js Guide**: https://js.tensorflow.org/guide/conversion/python.html
- **Google Inception V3**: https://github.com/tensorflow/models/tree/master/research/inception

---

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review [MODEL_LOADING_FIX.md](MODEL_LOADING_FIX.md)
3. Check browser console (F12) for errors
4. Verify model files exist: `ls public/models/inception-v3/`
5. Try rebuilding: `npm run build && npm start`

---

**Status**: ✅ Local Model Support Enabled  
**Date**: December 9, 2025  
**Speed**: <1 second model load (local)  
**Offline**: ✓ Fully offline capable
