# Inception V3 - TensorFlow2 Classification Model

## Model Information

This directory contains the official Google Inception V3 model trained on ImageNet.

**Model Details:**
- **Architecture:** Inception V3
- **Framework:** TensorFlow 2
- **Input Size:** 299×299 pixels
- **Classes:** 1000 (ImageNet classes)
- **Size:** ~95 MB
- **Parameters:** 23.9 million

---

## Expected Files

This folder should contain the model files from KagleHub:

```
inception-v3-tensorflow2-classification-v2/
├── model.json                  (Model definition, ~1-2 MB)
├── group1-shard1of2.bin        (Model weights part 1, ~50 MB)
├── group1-shard2of2.bin        (Model weights part 2, ~45 MB)
├── saved_model.pb              (SavedModel format, optional)
└── ... (other metadata files)
```

---

## How to Get the Model

### Option 1: Automatic Download (Recommended)
```bash
python setup_offline_model.py
```

### Option 2: Manual Download via KagleHub
```bash
pip install kagglehub

python << 'EOF'
import kagglehub
import shutil
from pathlib import Path

# Download
path = kagglehub.model_download("google/inception-v3/tensorFlow2/classification")
print(f"Downloaded to: {path}")

# Copy to this directory
dest = Path("public/models/inception-v3-tensorflow2-classification-v2")
dest.mkdir(parents=True, exist_ok=True)

for f in Path(path).iterdir():
    if f.is_file():
        shutil.copy2(f, dest / f.name)
        print(f"✓ Copied: {f.name}")

print("✓ Complete!")
EOF
```

### Option 3: Manual Placement
If you already have the model files:
1. Copy them to this directory
2. Ensure `model.json` is here
3. Verify weight files (*.bin) are included

---

## Verification

Check that the model is complete:

```bash
# Verify model.json exists
ls model.json

# Check weight files
ls group1-shard*.bin

# Check total size (should be ~95 MB)
du -sh .
```

---

## Loading the Model

The app will automatically:
1. Check this directory for `model.json`
2. Load the model if found
3. Fall back to cloud URLs if not found

**Console output when model loads:**
```
✓ Local Inception V3 model loaded successfully from /models/inception-v3-tensorflow2-classification-v2/model.json
```

---

## Model Usage

The model is used for:
- **Plant identification** - Recognizing flowers and plants
- **Object detection** - Identifying objects in images
- **Species classification** - Classifying 1000+ different species

---

## Performance

With model loaded locally:
- **Load time:** <2 seconds
- **Inference time:** 0.5-4 seconds per image
- **Internet needed:** NO ✓
- **Accuracy:** 70-85% (top-1), 85-95% (top-5)

---

## Offline Operation

Once the model is in this directory:
- ✅ Works completely offline
- ✅ No internet required
- ✅ Fast local loading
- ✅ No CORS issues
- ✅ No API dependencies

---

## Troubleshooting

### "Model not loading"
1. Verify files exist in this directory:
   ```bash
   ls -la public/models/inception-v3-tensorflow2-classification-v2/
   ```

2. Check file sizes are reasonable:
   - model.json: 1-2 MB
   - group1-shard1of2.bin: ~50 MB
   - group1-shard2of2.bin: ~45 MB

3. Clear browser cache and reload:
   - Ctrl+Shift+Delete (clear cache)
   - F5 (reload)

### "File not found" errors
Ensure all required files are copied to this directory.

### "Still loading from cloud"
1. Verify model files are here
2. Hard refresh browser (Ctrl+Shift+R)
3. Check browser console (F12) for loading path

---

## Next Steps

1. Ensure all model files are in this directory
2. Run the app: `npm run dev`
3. Check browser console for loading message
4. Upload an image to test

---

## References

- [KagleHub Model](https://kaggle.com/models/google/inception-v3)
- [Inception V3 Paper](https://arxiv.org/abs/1512.00567)
- [TensorFlow.js](https://js.tensorflow.org/)

---

**Status:** Ready for offline use ✓
**Model Size:** ~95 MB
**Location:** `public/models/inception-v3-tensorflow2-classification-v2/`
