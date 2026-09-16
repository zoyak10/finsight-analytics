# FinSight — Financial Analytics & Transaction Intelligence Dashboard

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Built for the **Loopr AI Full-Stack Assignment**.  
> An enterprise-grade financial analytics dashboard featuring real-time telemetry, interactive visualizations, dynamic multi-field filtering, a customizable CSV export studio, and a cinematic intro experience.

---

## 🌟 Key Highlights & Creative Features

1. **🎬 Cinematic Intro Experience**:
   - Full-screen 60FPS canvas-based particle warp tunnel with cursor parallax.
   - Holographic diagnostic boot HUD (`BOOT::INIT_FINSIGHT_CORE`, `NET::CONNECTING_NODES`, `LEDGER::SYNC`).
   - Browser-native synthesized Web Audio sound FX (telemetry ticks, warp riser, harmonic logo chord).
   - Instant toggle to custom MP4 video player mode.
   - Replay access from the Login page, Sidebar, and Mobile header.

2. **📊 Interactive Financial Visualizations**:
   - Monthly revenue vs. expense trend lines with custom tooltips.
   - Category distribution doughnut chart & transaction status breakdown.
   - Live KPI cards: Total Volume, Average Ticket Size, Success Rate, Active Nodes.

3. **🔍 Advanced Multi-Field Filtering & Real-Time Search**:
   - Date range, Amount sliders/inputs, Category multi-select, Status badges, User ID search.
   - Active filter chips with quick-remove tags and reset controls.

4. **⚡ Creative CSV Export Studio**:
   - Customizable column selector with field presets (All, Financial Only, Identity Only).
   - Respects active search and multi-field filters for targeted reporting.
   - One-click client-side download with timestamped filenames.

5. **🎨 Design & User Experience**:
   - Sleek Dark / Light mode toggle with smooth CSS transitions.
   - Glassmorphism UI with curated neon accent palettes.
   - Fully responsive layout for desktop, tablet, and mobile devices.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite 5
- **Styling**: TailwindCSS 3.4 with custom design tokens, glassmorphism, and neon glows
- **Routing**: React Router v6
- **Data Fetching**: TanStack React Query v5 & Axios
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js & TypeScript with `tsx`
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs password hashing
- **Data Processing**: `@json2csv/plainjs` for streaming CSV generation
- **Testing**: Vitest

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18 or newer
- **MongoDB**: Local instance running on `mongodb://localhost:27017` (or MongoDB Atlas connection string)
- **npm** or **yarn**

---

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd "LooprAI Assignment"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

---

### Step 2: Environment Configuration

#### Backend `.env` (`backend/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/finsight
JWT_SECRET=finsight-dev-secret-key-2024
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

#### Frontend Configuration (`frontend/vite.config.ts`)
The frontend automatically proxies `/api` calls to `http://localhost:5000`.

---

### Step 3: Seed the Database

Populate MongoDB with 300 transactions and the default demo administrator:

```bash
cd backend
npm run seed
```

Output:
```
  FinSight Database Seeder
  ──────────────────────
  ✓ Connected to MongoDB
  ✓ Cleared existing data
  ✓ Inserted 300 transactions
  ✓ Created demo user (admin@finsight.com / admin123)

  Seed completed successfully! ✓
```

---

### Step 4: Run the Application

#### Terminal 1 — Start the Backend Server:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Terminal 2 — Start the Frontend Application:
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Financial Analyst** | `admin@finsight.com` | `admin123` |

---

## 📡 API Documentation

### Authentication Endpoints

#### `POST /api/auth/login`
Authenticates user and returns JWT bearer token.
- **Request Body**:
  ```json
  {
    "email": "admin@finsight.com",
    "password": "admin123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1Ni...",
      "user": {
        "id": "6aaa...",
        "email": "admin@finsight.com",
        "name": "Financial Analyst",
        "role": "analyst"
      }
    }
  }
  ```

#### `GET /api/auth/me`
Fetches authenticated user profile.
- **Headers**: `Authorization: Bearer <token>`

---

### Dashboard Analytics Endpoints

#### `GET /api/dashboard/kpis`
Returns aggregated financial summary metrics:
- Total Revenue, Transaction Count, Average Transaction Value, Success Rate.

#### `GET /api/dashboard/revenue-trend`
Returns monthly revenue vs. expense aggregates for charting.

#### `GET /api/dashboard/category-breakdown`
Returns percentage and value distribution grouped by transaction category.

---

### Transaction Endpoints

#### `GET /api/transactions`
Retrieves paginated and filtered transactions.
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `startDate`, `endDate` (ISO date strings)
  - `minAmount`, `maxAmount` (numbers)
  - `category` (string)
  - `status` (string: `Completed`, `Pending`, `Failed`)
  - `search` (string: searches User ID, Category, Status, or Numeric ID)
  - `sortBy` (field: `date`, `amount`, `id`, `category`, `status`)
  - `sortOrder` (`asc` | `desc`)

---

### Report & CSV Export Endpoints

#### `POST /api/reports/export`
Generates and streams a custom-formatted CSV file based on user-configured columns and active filters.
- **Request Body**:
  ```json
  {
    "columns": ["id", "date", "amount", "category", "status", "user_id"],
    "filters": {
      "category": "Technology",
      "status": "Completed"
    }
  }
  ```
- **Response Headers**:
  - `Content-Type: text/csv`
  - `Content-Disposition: attachment; filename=transactions_export_<timestamp>.csv`

---

## 🧪 Testing

Unit tests are written using **Vitest** for query builders and filter logic.

```bash
cd backend
npm run test
```

Result:
```
 ✓ src/utils/queryBuilder.test.ts (6 tests)
 Test Files  1 passed (1)
 Tests       6 passed (6)
```

To build both packages for production:
```bash
# Frontend production build
cd frontend && npm run build

# Backend production build
cd backend && npm run build
```

---

## 📋 Assignment Evaluation Alignment

| Evaluation Criteria | Implementation Evidence |
|---|---|
| **Code Quality** | Strict TypeScript throughout, ESLint configuration, modular MVC architecture, automated Vitest unit tests, clean separation of concerns. |
| **Problem-Solving Approach** | Optimized MongoDB aggregation pipelines for dashboard metrics, debounce on real-time search, comprehensive error handling via alert chips and toast notifications, session-based intro persistence. |
| **Creativity** | Dual-mode WebGL/Canvas warp tunnel intro with synthesized Web Audio FX, customizable CSV export studio with column configurations, glassmorphic dark/light UI design. |

---

## 📄 License
This project is licensed under the MIT License.
