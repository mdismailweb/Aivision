# 🔧 Vision App - Command Reference & Cheat Sheet

## 🚀 Quick Commands

### Start Development Server
```bash
npm run dev
```
Starts the dev server at **http://localhost:9002**

### Build for Production
```bash
npm run build
```
Creates optimized production build in `.next/` folder

### Start Production Server
```bash
npm start
```
Runs the production build (requires `npm run build` first)

### Type Checking
```bash
npm run typecheck
```
Check for TypeScript errors

### Linting
```bash
npm run lint
```
Check code quality and style

---

## 📂 Important Files & Paths

### Core Application
```
http://localhost:9002           → Main app (browser)
src/app/page.tsx               → Main UI component
src/app/actions.ts             → Server-side actions
src/app/layout.tsx             → App layout
src/app/globals.css            → Global styles
```

### Inception V3 Utilities ⭐
```
src/lib/inception-v3.ts              → Model loading & preprocessing
src/lib/inaturalist-labels.ts        → Species labels (1000+)
src/lib/model-cache.ts               → Offline caching
src/lib/inception-v3-advanced.ts     → Advanced features
```

### Configuration
```
tsconfig.json                   → TypeScript config
next.config.ts                  → Next.js config
tailwind.config.ts              → Tailwind CSS config
postcss.config.mjs              → PostCSS config
components.json                 → UI components config
```

### Documentation 📚
```
QUICK_START.md                  → 5-minute intro ⭐ START HERE
INCEPTION_V3_README.md          → Complete reference
INCEPTION_V3_SETUP.md           → Setup guide
IMPLEMENTATION_SUMMARY.md       → What changed
INDEX.md                        → Documentation index
STATUS.md                       → Implementation status
```

---

## 💻 Common Development Tasks

### View Application
```bash
# App is at http://localhost:9002
# Open in browser and test
```

### Edit Main App
```bash
# Edit UI and features
src/app/page.tsx

# Reload browser (automatic hot reload)
# Changes appear instantly
```

### Add Species Labels
```bash
# Edit species classification
src/lib/inaturalist-labels.ts

# Add new species to the INATURALIST_LABELS object
```

### Modify Preprocessing
```bash
# Edit image preprocessing
src/lib/inception-v3.ts

# Change IMAGE_SIZE or normalization
```

### Check for Errors
```bash
# Compile and check
npm run typecheck

# Lint code
npm run lint
```

---

## 🧪 Testing & Debugging

### Browser Console (F12)
```
F12                             → Open developer tools
Console tab                     → View logs and errors
Network tab                     → Check requests
Application tab                 → View cache/storage
```

### Common Debug Commands
```javascript
// In browser console:
console.log('Debug message');   // Print to console
performance.now()               // Get timing info
```

### Check Model Loading
```javascript
// In browser console:
window.tensorflow                // Check if TensorFlow loaded
// Should show object if loaded correctly
```

---

## 📦 Dependency Management

### View Installed Packages
```bash
npm list
```

### Install New Package
```bash
npm install package-name
```

### Update All Packages
```bash
npm update
```

### Check for Vulnerabilities
```bash
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
```

---

## 🔧 Configuration Changes

### Change Model Input Size
**File:** `src/app/page.tsx`
```typescript
const IMAGE_SIZE = 299;  // Change this value
```

### Change Port Number
**File:** `package.json`
```json
"dev": "next dev --turbopack -p 9002"
         // Change 9002 to desired port
```

### Adjust Top Predictions Shown
**File:** `src/app/page.tsx`
```typescript
.slice(0, 5)  // Change 5 to desired number
```

### Change Confidence Threshold
**File:** `src/lib/inception-v3-advanced.ts`
```typescript
const minConfidence = 0.5;  // Change threshold
```

---

## 🌐 Browser Commands

### Clear Cache
```
Chrome/Edge:    Ctrl + Shift + Delete
Firefox:        Ctrl + Shift + Delete
Safari:         Cmd + Shift + Delete
```

### Full Page Reload
```
Chrome/Edge:    Ctrl + F5
Firefox:        Ctrl + Shift + R
Safari:         Cmd + Shift + R
```

### Hard Refresh (Clear Cache)
```
Chrome/Edge:    Ctrl + Shift + Delete then F5
Firefox:        Ctrl + Shift + Delete then F5
```

### Open DevTools
```
Chrome/Edge:    F12 or Ctrl + Shift + I
Firefox:        F12 or Ctrl + Shift + K
Safari:         Cmd + Option + I
```

---

## 📊 Performance Monitoring

### Measure Inference Time
```javascript
// In browser console:
const startTime = performance.now();
// Run classification
const endTime = performance.now();
console.log(`Time: ${endTime - startTime}ms`);
```

### Check Memory Usage
```javascript
// In browser console:
console.log(performance.memory);
// Shows:
// - usedJSHeapSize
// - jsHeapSizeLimit
// - totalJSHeapSize
```

### Monitor Model Loading
```javascript
// Check if model is loaded
if (window.tf && window.tf.getVersion) {
  console.log('TensorFlow.js loaded');
}
```

---

## 🚀 Deployment Commands

### Build for Production
```bash
npm run build
```

### Test Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Custom Server
```bash
# Build
npm run build

# Copy .next folder to server
# Run: npm start
```

---

## 🔐 Environment Setup

### Create .env.local
```bash
# No secrets needed for this app
# All processing is local/offline
```

### Environment Variables (Optional)
```
NEXT_PUBLIC_DISABLE_TELEMETRY=1
NODE_ENV=production
```

---

## 📝 Code Examples

### Load and Use Model
```typescript
import { loadInceptionV3Model } from '@/lib/inception-v3';

const model = await loadInceptionV3Model();
const predictions = await model.predict(tensor);
```

### Get Species Name
```typescript
import { getInaturalistLabel, getCommonName } from '@/lib/inaturalist-labels';

const name = getInaturalistLabel(0);      // Scientific name
const common = getCommonName(name);        // Common name
```

### Classify with Enhanced Results
```typescript
import { classifyImageEnhanced } from '@/lib/inception-v3-advanced';

const predictions = await classifyImageEnhanced(
  model, 
  imageElement, 
  5,      // Top 5 results
  0.5     // Min confidence
);
```

### Export Results
```typescript
import { exportPredictions } from '@/lib/inception-v3-advanced';

const { csv, json, xml } = exportPredictions(predictions);
console.log(csv);   // CSV format
console.log(json);  // JSON format
console.log(xml);   // XML format
```

---

## 🐛 Troubleshooting Commands

### Check TypeScript Errors
```bash
npm run typecheck
```

### Check Code Quality
```bash
npm run lint
```

### View Build Output
```bash
npm run build
```

### Clean Build Cache
```bash
rm -rf .next
npm run build
```

---

## 📱 Mobile Testing

### Test on Mobile (Android)
```bash
# 1. Get your local IP
ipconfig getifaddr en0  # Mac
hostname -I            # Linux

# 2. Access from mobile
http://<YOUR_IP>:9002
```

### Test Responsive Design
```
F12 → Toggle Device Toolbar (Ctrl + Shift + M)
Select device and screen size
Test on simulated mobile
```

---

## 🔍 File Search Commands

### Find Files
```bash
# Find all TypeScript files
find src -name "*.ts"

# Find all containing "model"
find src -name "*model*"

# Search in file contents
grep -r "inception" src/
```

### List Directory Contents
```bash
# List src/lib
ls -la src/lib

# Show tree structure
tree src
```

---

## 📊 Database & Storage

### Check IndexedDB (Model Cache)
```javascript
// In browser console:
// Open DevTools → Application → IndexedDB
// Check "inception-v3" database
```

### Clear IndexedDB
```javascript
// In browser console:
indexedDB.deleteDatabase('inception-v3');
console.log('Cache cleared');
```

### Check Cache Size
```javascript
// In browser console:
navigator.storage.estimate().then(estimate => {
  console.log(`Used: ${estimate.usage} bytes`);
  console.log(`Quota: ${estimate.quota} bytes`);
});
```

---

## 🎯 Git Commands (Optional)

### Initialize Git (if needed)
```bash
git init
git add .
git commit -m "Initial commit with Inception V3"
```

### View Changes
```bash
git status
git diff
```

### Add All Changes
```bash
git add .
git commit -m "Your message"
```

---

## 📚 Documentation Commands

### View Documentation
```bash
# Open in editor or browser
cat QUICK_START.md
cat INCEPTION_V3_README.md
cat INDEX.md
```

### Search Documentation
```bash
# Find topic in docs
grep -r "offline" *.md
grep -r "accuracy" *.md
```

---

## 🔄 Hot Reload & Auto-Refresh

### Development Features
- ✅ Hot module replacement (HMR)
- ✅ Fast refresh (code changes instantly)
- ✅ No manual reload needed
- ✅ State preservation when possible

### Force Refresh
```
Browser:  Ctrl + Shift + R (clear cache & refresh)
          F5 (regular refresh)
```

---

## 💾 Backup & Version Control

### Backup Current Work
```bash
# Copy project folder
cp -r visionapp visionapp_backup_$(date +%Y%m%d)
```

### View File History (Git)
```bash
git log --oneline
git log -p src/app/page.tsx  # Show changes
```

---

## 🎓 Learning Commands

### View TypeScript Errors
```bash
npm run typecheck
# Shows all type issues
```

### View Linting Issues
```bash
npm run lint
# Shows code quality issues
```

### Run in Debug Mode
```bash
node --inspect-brk node_modules/.bin/next dev
# Opens debugger
```

---

## 🌐 Network Commands

### Check Model Download
```
DevTools → Network tab
Filter by "XHR" or "fetch"
Look for tfhub.dev requests
```

### Simulate Slow Network
```
DevTools → Network tab
Throttling dropdown → Select "Slow 3G"
Test loading with simulated slow connection
```

### Check API Calls
```
DevTools → Network tab
Monitor all requests
Check for any external API calls
(Should be none - app is offline)
```

---

## ⚡ Performance Optimization Commands

### Analyze Bundle
```bash
npm install --save-dev webpack-bundle-analyzer
npm run build
```

### Check Build Size
```bash
npm run build
# Check .next folder size
du -sh .next
```

### Monitor Memory
```javascript
// In browser console:
setInterval(() => {
  console.log(performance.memory);
}, 1000);
```

---

## 🆘 Getting Help

### Check Logs
```bash
npm run dev
# Check terminal output for errors
```

### View Error Details
```
F12 → Console tab
Look for red error messages
Check stack trace for details
```

### Find Documentation
```
INDEX.md                → Start here for navigation
QUICK_START.md          → For quick answers
INCEPTION_V3_README.md  → For detailed help
```

---

## 📋 Pre-Deployment Checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] App runs on `npm start`
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Check documentation complete
- [ ] Verify offline functionality

---

## 🎯 Common Workflows

### Daily Development
```bash
# 1. Start dev server
npm run dev

# 2. Edit files (auto-reload)
# 3. Test in browser (localhost:9002)
# 4. Check console (F12)
# 5. Commit changes (optional)
git add .
git commit -m "description"
```

### Before Deployment
```bash
# 1. Check types
npm run typecheck

# 2. Check quality
npm run lint

# 3. Build
npm run build

# 4. Test build
npm start

# 5. Deploy
vercel  # or your hosting
```

---

## 📞 Quick Reference Table

| Task | Command |
|------|---------|
| Start server | `npm run dev` |
| Build prod | `npm run build` |
| Type check | `npm run typecheck` |
| Lint code | `npm run lint` |
| Open console | `F12` |
| Clear cache | `Ctrl+Shift+Delete` |
| Hard refresh | `Ctrl+Shift+R` |
| DevTools | `F12` |
| Access app | `http://localhost:9002` |

---

**Last Updated:** December 9, 2025  
**Status:** ✅ Complete  
**Version:** 1.0
