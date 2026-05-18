# 🚀 Railway Deployment Guide

## Complete Step-by-Step Instructions

### STEP 1 — Create Railway Account
1. Go to https://railway.app
2. Click "Start Free" or "Sign Up"
3. Sign up with GitHub (recommended) or email
4. Verify your email

---

### STEP 2 — Create MongoDB Database on Railway

1. **Go to Railway Dashboard**
   - Click "New Project"
   - Select "Provision New"
   - Choose "MongoDB"

2. **Configure MongoDB**
   - Name: `ttm-mongodb` (or any name)
   - Click "Deploy"
   - Wait 2-3 minutes for deployment

3. **Get MongoDB Connection String**
   - Click on the MongoDB service
   - Go to "Connect" tab
   - Copy the connection string (looks like: `mongodb+srv://...`)
   - Save it for later

---

### STEP 3 — Deploy Backend Service

1. **Create Backend Service**
   - In Railway Dashboard, click "New Service"
   - Select "GitHub Repo"
   - Connect your GitHub account if not already connected
   - Select repository: `Team-Task-Manager`
   - Click "Deploy"

2. **Configure Backend Environment Variables**
   - Click on the Backend service
   - Go to "Variables" tab
   - Add these variables:

   ```
   MONGO_URI = <paste your MongoDB connection string from Step 2>
   JWT_SECRET = your_super_secret_jwt_key_change_this_2024
   PORT = 5000
   CLIENT_URL = https://your-frontend-url.railway.app
   NODE_ENV = production
   ```

   **Example MONGO_URI:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/teamtaskmanager?retryWrites=true&w=majority
   ```

3. **Set Build Command**
   - Go to "Settings" tab
   - Set "Build Command": `npm install`
   - Set "Start Command": `node server.js`
   - Click "Save"

4. **Wait for Deployment**
   - Railway will automatically build and deploy
   - Check "Deployments" tab for status
   - Once green, your backend is live!

5. **Get Backend URL**
   - Click on Backend service
   - Go to "Connect" tab
   - Copy the public URL (looks like: `https://ttm-backend-production.up.railway.app`)
   - Save it for frontend configuration

---

### STEP 4 — Deploy Frontend Service

1. **Create Frontend Service**
   - In Railway Dashboard, click "New Service"
   - Select "GitHub Repo"
   - Select repository: `Team-Task-Manager`
   - Click "Deploy"

2. **Configure Frontend Environment Variables**
   - Click on the Frontend service
   - Go to "Variables" tab
   - Add this variable:

   ```
   VITE_API_URL = https://your-backend-url.railway.app/api
   ```

   **Example:**
   ```
   VITE_API_URL = https://ttm-backend-production.up.railway.app/api
   ```

3. **Set Build Command**
   - Go to "Settings" tab
   - Set "Build Command": `cd frontend && npm install && npm run build`
   - Set "Start Command": Leave empty (Railway will serve static files)
   - Set "Root Directory": `frontend/dist`
   - Click "Save"

4. **Wait for Deployment**
   - Railway will build and deploy
   - Check "Deployments" tab for status
   - Once green, your frontend is live!

5. **Get Frontend URL**
   - Click on Frontend service
   - Go to "Connect" tab
   - Copy the public URL (looks like: `https://ttm-frontend-production.up.railway.app`)

---

### STEP 5 — Update Backend with Frontend URL

1. **Go back to Backend Service**
   - Click on Backend service
   - Go to "Variables" tab
   - Update `CLIENT_URL` with your frontend URL:
   ```
   CLIENT_URL = https://your-frontend-url.railway.app
   ```

2. **Redeploy Backend**
   - Go to "Deployments" tab
   - Click the three dots on latest deployment
   - Select "Redeploy"
   - Wait for redeployment to complete

---

### STEP 6 — Test Your Deployment

1. **Open Frontend URL**
   - Go to your frontend URL in browser
   - You should see the landing page

2. **Test Login**
   - Click "Admin Login"
   - Use demo credentials:
     - Email: `admin@demo.com`
     - Password: `admin123`
   - If you can login, everything works!

3. **Seed Demo Data (Optional)**
   - SSH into backend or use Railway CLI
   - Run: `node seed.js`
   - This adds 5 projects with 27 tasks

---

### STEP 7 — Setup Custom Domain (Optional)

1. **Add Custom Domain**
   - Click on Frontend service
   - Go to "Settings" tab
   - Scroll to "Domains"
   - Click "Add Domain"
   - Enter your domain (e.g., `taskmanager.com`)
   - Follow DNS setup instructions

2. **SSL Certificate**
   - Railway automatically provides free SSL
   - Your domain will be HTTPS

---

## 🔧 Environment Variables Reference

### Backend (.env)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/teamtaskmanager
JWT_SECRET=your_secret_key_here
PORT=5000
CLIENT_URL=https://your-frontend.railway.app
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 📊 Monitoring & Logs

1. **View Logs**
   - Click on service
   - Go to "Logs" tab
   - See real-time logs

2. **Monitor Performance**
   - Go to "Metrics" tab
   - View CPU, Memory, Network usage

3. **Check Deployments**
   - Go to "Deployments" tab
   - See deployment history
   - Rollback if needed

---

## 🐛 Troubleshooting

### Backend won't deploy
- Check "Logs" tab for errors
- Verify `MONGO_URI` is correct
- Ensure `package.json` has correct start script

### Frontend shows blank page
- Check browser console for errors
- Verify `VITE_API_URL` is correct
- Check frontend "Logs" tab

### Can't login
- Verify backend is running (check logs)
- Verify `MONGO_URI` is correct
- Check `JWT_SECRET` is set

### CORS errors
- Verify `CLIENT_URL` in backend matches frontend URL
- Verify `VITE_API_URL` in frontend matches backend URL

---

## 📱 Demo Credentials

```
Admin:
Email: admin@demo.com
Password: admin123

Member:
Email: member@demo.com
Password: member123
```

---

## ✅ Deployment Checklist

- [ ] MongoDB deployed on Railway
- [ ] Backend deployed with all env vars
- [ ] Frontend deployed with VITE_API_URL
- [ ] Backend CLIENT_URL updated
- [ ] Can access frontend URL
- [ ] Can login with demo credentials
- [ ] Can create projects (as admin)
- [ ] Can view tasks (as member)
- [ ] Custom domain configured (optional)

---

## 🎉 You're Live!

Your Team Task Manager is now deployed on Railway and accessible to the world!

**Frontend:** https://your-frontend.railway.app
**Backend:** https://your-backend.railway.app
**API:** https://your-backend.railway.app/api

---

**Owner:** TADIMARRI VARDHINI REDDY

**Support Email:** 2300033173@kluniversity.in
