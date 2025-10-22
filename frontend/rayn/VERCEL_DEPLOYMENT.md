# Deploying Rayn Frontend to Vercel

## 🚀 Quick Fix for 404 Error

The **404 NOT_FOUND** error occurs because Vercel doesn't know how to handle React Router's client-side routing. The `vercel.json` file we just created fixes this by rewriting all routes to `index.html`.

---

## 📋 Step-by-Step Deployment Guide

### Option 1: Redeploy from Vercel Dashboard (Easiest)

1. **Commit the vercel.json file**:
   ```bash
   cd /home/adetayo/Rayn
   git add frontend/rayn/vercel.json
   git commit -m "fix: add vercel.json for client-side routing"
   git push origin feature/smart-contracts
   ```

2. **Trigger Redeploy on Vercel**:
   - Go to https://vercel.com/dashboard
   - Find your Rayn project
   - Click "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Or push the changes and it will auto-deploy

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Navigate to frontend directory
cd /home/adetayo/Rayn/frontend/rayn

# Deploy
vercel --prod
```

### Option 3: Fresh Deployment

```bash
cd /home/adetayo/Rayn/frontend/rayn

# Login to Vercel
vercel login

# Deploy
vercel

# Or deploy to production directly
vercel --prod
```

---

## 🔧 Configuration Files

### 1. vercel.json (Already Created ✅)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**What it does:**
- Rewrites all routes to `index.html` (enables React Router)
- Tells Vercel to use `npm run build` 
- Output directory is `dist` (Vite default)
- Framework is Vite

---

## ⚙️ Vercel Project Settings

If you need to configure manually on Vercel dashboard:

### Build & Development Settings
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Development Command: npm run dev
```

### Root Directory
```
Root Directory: frontend/rayn
```

### Environment Variables (Optional - Add Later)
```
VITE_PAYMENT_ROUTER_ADDRESS=0x...
VITE_USERNAME_REGISTRY_ADDRESS=0x...
VITE_RAYN_STABLE_ADDRESS=0x...
VITE_GIVEAWAY_DISTRIBUTOR_ADDRESS=0x...
```

---

## 🐛 Common Issues & Solutions

### Issue 1: 404 on Refresh/Direct URL Access
**Solution:** ✅ Already fixed with `vercel.json`

### Issue 2: Build Fails
**Check:**
```bash
# Test build locally first
cd /home/adetayo/Rayn/frontend/rayn
npm run build

# If successful, you'll see dist/ folder created
ls -la dist/
```

### Issue 3: Routes Still Not Working
**Solution:** Ensure vercel.json is in the same directory as package.json

```bash
cd /home/adetayo/Rayn/frontend/rayn
ls -la vercel.json  # Should exist
```

### Issue 4: Assets Not Loading
**Check vite.config.js has correct base:**
```javascript
export default defineConfig({
  base: '/',  // Add this if missing
  plugins: [react(), tailwindcss()],
})
```

---

## 📱 Testing After Deployment

### 1. Test Main Routes
- ✅ https://rayn-rf4z.vercel.app/
- ✅ https://rayn-rf4z.vercel.app/dashboard
- ✅ https://rayn-rf4z.vercel.app/send
- ✅ https://rayn-rf4z.vercel.app/receive
- ✅ https://rayn-rf4z.vercel.app/giveaways
- ✅ https://rayn-rf4z.vercel.app/profile

### 2. Test Browser Refresh
- Navigate to any route
- Press F5 (refresh)
- Should load the same page (not 404)

### 3. Test Direct URL Access
- Copy any route URL
- Paste in new browser tab
- Should load correctly (not 404)

---

## 🔗 Connecting to Smart Contracts

After contracts are deployed, add environment variables:

### In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add these variables:

```
VITE_PAYMENT_ROUTER_ADDRESS=0x... (from contract deployment)
VITE_USERNAME_REGISTRY_ADDRESS=0x...
VITE_RAYN_STABLE_ADDRESS=0x...
VITE_GIVEAWAY_DISTRIBUTOR_ADDRESS=0x...
VITE_RPC_URL=https://rpc.sepolia-api.lisk.com (or your network)
VITE_CHAIN_ID=4202 (Lisk Sepolia testnet)
```

### Or create .env file locally:
```bash
cd /home/adetayo/Rayn/frontend/rayn
cat > .env << EOF
VITE_PAYMENT_ROUTER_ADDRESS=
VITE_USERNAME_REGISTRY_ADDRESS=
VITE_RAYN_STABLE_ADDRESS=
VITE_GIVEAWAY_DISTRIBUTOR_ADDRESS=
VITE_RPC_URL=https://rpc.sepolia-api.lisk.com
VITE_CHAIN_ID=4202
EOF
```

---

## 🎯 Deployment Checklist

Before deploying:
- [ ] `vercel.json` exists in frontend/rayn directory ✅
- [ ] `npm run build` works locally
- [ ] All routes defined in App.jsx
- [ ] Environment variables configured (if using contracts)
- [ ] No console errors in browser

After deploying:
- [ ] Homepage loads
- [ ] All routes accessible
- [ ] Refresh works on any page
- [ ] Direct URL access works
- [ ] Mobile responsive
- [ ] Wallet connection works (if implemented)

---

## 🚀 Deploy Now!

### Quick Deploy Commands:
```bash
# Commit the fix
cd /home/adetayo/Rayn
git add frontend/rayn/vercel.json
git commit -m "fix: add vercel.json for React Router support"
git push

# Vercel will auto-deploy if connected to GitHub
# Or manually trigger redeploy in Vercel dashboard
```

---

## 📊 Vercel Dashboard

After successful deployment, you'll see:
- ✅ Build succeeded
- ✅ Deployment URL (e.g., rayn-rf4z.vercel.app)
- ✅ All routes working
- ✅ No 404 errors

---

## 🆘 Still Having Issues?

### Check Vercel Build Logs:
1. Go to Vercel Dashboard
2. Click on your project
3. Click on the failed deployment
4. Check "Build Logs" tab
5. Look for errors

### Common Build Errors:
```bash
# If you see module not found errors
npm install

# If you see TypeScript errors
npm run build  # Fix locally first

# If you see out of memory errors
# Add to vercel.json:
{
  "build": {
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=4096"
    }
  }
}
```

---

## 🎉 Success!

Once deployed, your Rayn app will be live at:
- **Production URL:** https://rayn-rf4z.vercel.app (or your custom domain)
- **All routes working** ✅
- **React Router enabled** ✅
- **No more 404 errors** ✅

---

**Need help with smart contract integration after deployment? Let me know!** 🚀
