# 🚀 Quick Start: Switch to Local MongoDB

## ⚡ Fast Track (5 Minutes)

### Step 1: Install MongoDB (Choose One)

**Option A: Using Chocolatey** _(Run PowerShell as Administrator)_

```powershell
choco install mongodb -y
```

**Option B: Direct Download**

-   Download: https://www.mongodb.com/try/download/community
-   Run installer, select "Complete" and "Install as Service"

### Step 2: Run Setup Script

```powershell
.\setup-local-mongodb.ps1
```

This will:

-   ✅ Check MongoDB installation
-   ✅ Test connection
-   ✅ Create `.env.local` with local configuration

### Step 3: Start Your App

```bash
npm run dev
```

✅ Done! Your app now uses local MongoDB at `localhost:27017`

---

## 📊 Verify Everything Works

### Check MongoDB Service

```powershell
Get-Service -Name MongoDB
# Should show: Status = Running
```

### Connect with MongoDB Shell

```powershell
mongosh
# Type: show dbs
# Type: exit
```

### Use MongoDB Compass (GUI)

-   Open MongoDB Compass (installed with MongoDB)
-   Connect to: `mongodb://localhost:27017`
-   You'll see your `omidar` database after app creates data

---

## 🔄 Your Current Setup vs New Setup

### Before (MongoDB Atlas - Online)

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/omidar
```

❌ Requires internet
❌ Network latency
❌ Potential costs

### After (Local MongoDB)

```env
MONGO_URI=mongodb://localhost:27017/omidar
```

✅ Works offline
✅ Faster (no network delay)
✅ Free
✅ Full control

---

## 🔧 Common Commands

### MongoDB Service Management

```powershell
# Check status
Get-Service -Name MongoDB

# Start MongoDB
Start-Service -Name MongoDB

# Stop MongoDB
Stop-Service -Name MongoDB

# Restart MongoDB
Restart-Service -Name MongoDB
```

### MongoDB Shell Operations

```bash
# Connect to MongoDB
mongosh

# Show all databases
show dbs

# Use your database
use omidar

# Show collections
show collections

# View data in a collection
db.users.find().pretty()

# Count documents
db.users.countDocuments()

# Exit shell
exit
```

---

## 📁 Project Files Created

1. **MONGODB_SETUP_GUIDE.md** - Complete detailed guide
2. **setup-local-mongodb.ps1** - Automated setup script
3. **QUICK_START.md** - This file (quick reference)
4. **.env.local** - Your local environment config (auto-created by script)

---

## ❓ Troubleshooting

### MongoDB won't start

```powershell
# Check what's running on port 27017
netstat -ano | findstr :27017

# View MongoDB logs
Get-Content "C:\Program Files\MongoDB\Server\*\log\mongod.log" -Tail 20
```

### App can't connect

1. Check `.env.local` exists in project root
2. Verify MongoDB service is running: `Get-Service -Name MongoDB`
3. Restart your dev server: `npm run dev`

### Need to switch back to Atlas?

Edit `.env.local` and change `MONGO_URI` to your Atlas connection string, then restart dev server.

---

## 📚 Need More Help?

-   **Detailed Guide**: See `MONGODB_SETUP_GUIDE.md`
-   **MongoDB Docs**: https://docs.mongodb.com/
-   **Community**: https://www.mongodb.com/community/forums/

---

## ✨ Benefits You'll Notice

🚀 **Faster** - No network latency
🔒 **Private** - Data stays on your machine  
💰 **Free** - No cloud costs or limits
🏠 **Offline** - Work without internet
🎓 **Learning** - Direct access to MongoDB operations
