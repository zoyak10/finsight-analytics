# FinSight — Full-Stack Deployment Guide

This guide details how to deploy the FinSight platform for free using modern cloud providers:
- **Frontend**: [Vercel](https://vercel.com) (Global edge CDN, instant SSL)
- **Backend API**: [Render](https://render.com) (or [Railway](https://railway.app))
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free M0 shared cluster)

---

## Architecture Overview

```
┌─────────────────────────────────┐
│     Frontend (React + Vite)     │
│        Hosted on Vercel         │
│    https://finsight.vercel.app  │
└────────────────┬────────────────┘
                 │
                 │ HTTPS API Calls (Bearer JWT)
                 ▼
┌─────────────────────────────────┐
│       Backend API (Express)     │
│        Hosted on Render         │
│  https://finsight.onrender.com  │
└────────────────┬────────────────┘
                 │
                 │ Mongoose Connection
                 ▼
┌─────────────────────────────────┐
│       MongoDB Atlas (M0)        │
│      Cloud-hosted Database      │
└─────────────────────────────────┘
```

---

## Step 1: Set Up MongoDB Atlas (Free Cloud Database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign in or create an account.
2. Click **Create a Deployment** and select the **M0 Free Cluster**.
3. Choose a cloud provider and region closest to your users (e.g. AWS / Mumbai, Frankfurt, or N. Virginia).
4. In **Security Quickstart**:
   - **Database User**: Create a user (e.g. `admin` and a strong password). Note down this password.
   - **Network Access / IP Access List**: Add `0.0.0.0/0` (Allow access from anywhere) so that Render or cloud servers can connect.
5. In **Database Deployments**, click **Connect** → **Drivers** (Node.js).
6. Copy the connection string. It will look like:
   ```env
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/finsight?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your database credentials).*

---

## Step 2: Deploy the Backend API (on Render)

1. Push your code to your GitHub repository.
2. Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name**: `finsight-api` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Choose the region closest to your MongoDB Atlas cluster
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: `Free`
5. In the **Environment Variables** section, add the following:

   | Variable | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `5000` | Port Render will bind to |
   | `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | `your-secure-random-secret-key-at-least-32-chars` | Used for signing tokens |
   | `JWT_EXPIRES_IN` | `7d` | Token expiration period |
   | `CLIENT_URL` | `*` or your Vercel URL (e.g. `https://finsight.vercel.app`) | Allowed CORS origin |

6. Click **Create Web Service**.
7. Once the build completes and the service is live, copy your backend URL:
   `https://finsight-api.onrender.com`

### Seed Initial Transactions & Users
To populate initial sample data into your live cloud database, run the seed script locally pointing to your Atlas URI:
```bash
# In your terminal, from the backend directory:
$env:MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/finsight?retryWrites=true&w=majority"
npm run seed
```
*(On Linux/macOS: `MONGODB_URI="..." npm run seed`)*

---

## Step 3: Deploy the Frontend (on Vercel)

1. Go to [vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Import your GitHub repository.
3. Configure the Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build` (automatic)
   - **Output Directory**: `dist` (automatic)
4. Under **Environment Variables**, add:

   | Variable | Value | Notes |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://finsight-api.onrender.com/api` | Your deployed backend URL + `/api` |

5. Click **Deploy**.
6. Vercel will build and deploy your app. When finished, you'll receive your live URL:
   `https://finsight.vercel.app`

*(Note: `frontend/vercel.json` is already configured with SPA rewrites to ensure deep links and page refreshes on `/transactions` and `/reports` work seamlessly).*

---

## Alternative: Single-Service All-in-One Deployment (Render)

If you prefer to host both frontend and backend on a single free Render Web Service without CORS:

1. In `backend/src/index.ts`, the backend is already configured to automatically serve static files from `frontend/dist` when present.
2. In Render, create a Web Service with **Root Directory** left empty (repository root).
3. Set:
   - **Build Command**: `npm --prefix frontend install && npm --prefix frontend run build && npm --prefix backend install && npm --prefix backend run build`
   - **Start Command**: `npm --prefix backend run start`
   - **Environment Variables**:
     - `MONGODB_URI`: Atlas URI
     - `JWT_SECRET`: Random key
     - `NODE_ENV`: `production`

---

## Default Demo Credentials

After seeding, test your deployment with:
- **Email**: `admin@finsight.com`
- **Password**: `admin123`

---

## Verification Checklist

- [ ] Health check endpoint responds: `GET https://your-backend.onrender.com/api/health`
- [ ] Login succeeds with `admin@finsight.com` / `admin123`
- [ ] Dashboard KPI cards and charts load live data
- [ ] Transactions page displays data (desktop table & mobile cards)
- [ ] Reports export modal downloads a valid CSV file
- [ ] Direct page refresh on `https://your-domain.vercel.app/transactions` does not throw 404
- [ ] Mobile navigation drawer and sticky top app bar work smoothly on phone viewports
