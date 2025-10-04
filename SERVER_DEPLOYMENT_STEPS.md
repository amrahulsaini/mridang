# 🚀 Server Deployment - Pull Latest Changes

## Commands to Run on Your Server

### **Step 1: Connect to Your Server**

SSH into your server:
```bash
ssh your_username@your_server_ip
```

---

### **Step 2: Navigate to Project Directory**

```bash
cd /path/to/your/mridang/project
```

---

### **Step 3: Pull Latest Changes**

```bash
# Fetch latest changes from GitHub
git fetch origin

# Pull the latest code from master branch
git pull origin master
```

**Expected Output:**
```
From https://github.com/amrahulsaini/mridang
 * branch            master     -> FETCH_HEAD
Updating 14bb7d6..ffe7c80
Fast-forward
 MOBILE_PAYMENT_FIX.md     | 347 ------------------------------
 app/checkout/page.tsx     | 140 +++++--------
 2 files changed, 70 insertions(+), 417 deletions(-)
 delete mode 100644 MOBILE_PAYMENT_FIX.md
```

---

### **Step 4: Install Dependencies (if needed)**

If package.json changed:
```bash
npm install
```

---

### **Step 5: Rebuild Application**

```bash
# Build for production
npm run build
```

---

### **Step 6: Restart Server**

**For PM2:**
```bash
pm2 restart mridang
# or
pm2 restart all
```

**For systemd service:**
```bash
sudo systemctl restart your-app-name
```

**For manual Node.js:**
```bash
# Stop current process (Ctrl+C)
# Then start again
npm start
```

**For Next.js standalone:**
```bash
pm2 restart ecosystem.config.js
# or
pm2 restart npm --name "mridang" -- start
```

---

### **Step 7: Verify Deployment**

```bash
# Check if process is running
pm2 status

# Check logs
pm2 logs mridang

# Or for systemd
sudo systemctl status your-app-name
```

---

## 🔍 Quick Verification Checklist

After deployment, verify:

- [ ] ✅ Server is running without errors
- [ ] ✅ Website loads correctly
- [ ] ✅ Checkout page works
- [ ] ✅ Payment integration functional
- [ ] ✅ No console errors in browser

---

## 🆘 Troubleshooting

### **Issue: Merge Conflicts**

If you have local changes on server:
```bash
# Stash your changes
git stash

# Pull latest code
git pull origin master

# Apply your stashed changes
git stash pop
```

### **Issue: Permission Denied**

```bash
# Make sure you have right permissions
sudo chown -R $USER:$USER .

# Or use sudo for git commands
sudo git pull origin master
```

### **Issue: Build Fails**

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### **Issue: PM2 Not Found**

```bash
# Install PM2 globally
npm install -g pm2
```

---

## 📋 Complete Deployment Script

Save this as `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying latest changes..."

# Navigate to project directory
cd /path/to/your/mridang/project

# Pull latest code
echo "📥 Pulling from GitHub..."
git pull origin master

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Restart PM2
echo "♻️  Restarting server..."
pm2 restart mridang

# Show status
echo "✅ Deployment complete!"
pm2 status

echo "📊 Recent logs:"
pm2 logs mridang --lines 20
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

---

## 🎯 Quick Commands Summary

```bash
# One-liner deployment
cd /path/to/mridang && git pull origin master && npm install && npm run build && pm2 restart mridang

# Check status
pm2 status

# View logs
pm2 logs mridang --lines 50

# Stop server
pm2 stop mridang

# Start server
pm2 start mridang
```

---

## ✅ Done!

Your server should now have the latest code with the reverted changes! 🎉
