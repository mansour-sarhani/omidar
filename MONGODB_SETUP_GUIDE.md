# MongoDB Local Setup Guide for Windows

## 🚀 Quick Setup (3 Methods)

### **Method 1: Using Chocolatey (Fastest)**

1. **Open PowerShell as Administrator** (Right-click → Run as Administrator)
2. Run:
    ```powershell
    choco install mongodb -y
    ```
3. The installer will:
    - Install MongoDB Community Server
    - Set up MongoDB as a Windows Service
    - Configure it to start automatically

### **Method 2: Manual Installation (Recommended for Control)**

1. **Download MongoDB:**

    - Visit: https://www.mongodb.com/try/download/community
    - Select: `Windows x64`
    - Version: Latest stable (currently 8.x)
    - Download the MSI installer

2. **Install:**

    - Run the MSI installer
    - Choose "Complete" installation type
    - ✅ Check: "Install MongoDB as a Service"
    - ✅ Check: "Install MongoDB Compass" (GUI tool)
    - Click Install

3. **Verify Installation:**

    ```powershell
    # Check if MongoDB service is running
    Get-Service -Name MongoDB

    # Or check with mongo shell
    mongosh --version
    ```

### **Method 3: MongoDB Compass Only (If Already Installed)**

If MongoDB is already installed but not as a service:

1. Download MongoDB Compass: https://www.mongodb.com/products/tools/compass
2. Start MongoDB manually or create a service

---

## 🔧 Configuration

### **1. Verify MongoDB is Running**

Open PowerShell and run:

```powershell
# Check service status
Get-Service -Name MongoDB

# Should show: Status = Running
```

If not running, start it:

```powershell
Start-Service -Name MongoDB
```

### **2. Test Connection**

```powershell
# Connect to MongoDB shell
mongosh

# You should see:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/
```

Type `exit` to quit mongosh.

---

## 📝 Update Your Project Configuration

### **Create/Update `.env.local` file**

In your project root (`D:\Work\Projects\Omidar\omidar`), create or update `.env.local`:

```env
# Local MongoDB Connection
MONGO_URI=mongodb://localhost:27017/omidar

# Optional: Add authentication if you set it up
# MONGO_URI=mongodb://username:password@localhost:27017/omidar
```

**Database name**: `omidar` (or choose your own name)

---

## 🔄 Migrating Data from MongoDB Atlas

If you have existing data on MongoDB Atlas that you want to migrate:

### **Method 1: Using MongoDB Compass (Visual)**

1. **Export from Atlas:**

    - Open MongoDB Compass
    - Connect to your Atlas cluster (use your current connection string)
    - Select your database
    - For each collection: Collection → Export Collection → JSON

2. **Import to Local:**
    - Connect to `localhost:27017` in Compass
    - Create new database `omidar`
    - For each collection: ADD DATA → Import File → Select your JSON files

### **Method 2: Using mongodump/mongorestore (Command Line)**

```powershell
# Export from Atlas
mongodump --uri="your-atlas-connection-string" --out=./backup

# Import to Local
mongorestore --uri="mongodb://localhost:27017/omidar" ./backup
```

### **Method 3: Start Fresh**

Just start with an empty local database. Your application will create collections automatically.

---

## ✅ Testing Your Local Setup

1. **Update environment variable:**

    - Create `.env.local` with local connection string

2. **Restart your development server:**

    ```powershell
    npm run dev
    ```

3. **Check console output:**

    - You should see: "Connected to MongoDB successfully"

4. **Use MongoDB Compass:**
    - Open Compass
    - Connect to `mongodb://localhost:27017`
    - You should see your `omidar` database appear when your app creates data

---

## 🛠️ Troubleshooting

### **MongoDB Service Won't Start**

```powershell
# Check service status
Get-Service -Name MongoDB

# Try manual start
Start-Service -Name MongoDB

# If fails, check logs at:
# C:\Program Files\MongoDB\Server\{version}\log\mongod.log
```

### **Connection Refused**

1. Verify MongoDB is running
2. Check firewall isn't blocking port 27017
3. Try the explicit IP: `mongodb://127.0.0.1:27017/omidar`

### **Can't Connect from Application**

1. Make sure `.env.local` exists in project root
2. Restart your Next.js dev server
3. Check the connection string format

### **Port 27017 Already in Use**

```powershell
# Find what's using port 27017
netstat -ano | findstr :27017

# Use different port in MongoDB config and connection string
```

---

## 📊 Useful MongoDB Commands

```javascript
// In mongosh shell

// Show all databases
show dbs

// Use your database
use omidar

// Show collections
show collections

// View documents in a collection
db.users.find().pretty()

// Count documents
db.users.countDocuments()

// Drop database (BE CAREFUL!)
db.dropDatabase()
```

---

## 🎯 Benefits of Local MongoDB

✅ **Faster Development** - No network latency
✅ **Work Offline** - No internet required
✅ **Free** - No Atlas tier limitations
✅ **Privacy** - Data stays on your machine
✅ **Learning** - Better understanding of MongoDB operations

---

## 📚 Additional Resources

-   MongoDB Documentation: https://docs.mongodb.com/
-   MongoDB Compass: https://www.mongodb.com/products/tools/compass
-   mongosh Documentation: https://www.mongodb.com/docs/mongodb-shell/

---

## ⚠️ Important Notes

1. **Backup:** Local data is only on your machine. Back up regularly!
2. **Production:** Keep using MongoDB Atlas or a managed service for production
3. **Git:** The `.env.local` file is already in `.gitignore` - keep it that way!
4. **Security:** Local MongoDB has no authentication by default (fine for dev)

---

## 🔄 Quick Switch Back to Atlas (if needed)

Simply update `.env.local`:

```env
MONGO_URI=your-atlas-connection-string
```

Restart your dev server, and you're back on Atlas!
