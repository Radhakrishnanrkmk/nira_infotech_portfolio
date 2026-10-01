# Deploying NIRA Infotech on Vercel

This full-stack application (Vite + React frontend with Express API backend and Supabase PostgreSQL database) is pre-configured for one-click deployment on **Vercel** via Serverless Functions.

---

## 📁 Pre-Configured Files

1. **`vercel.json`**:
   - Routes all `/api/(.*)` requests to the Serverless Function at `/api`.
   - Routes all other traffic `/(.*)` to `/index.html` for client-side React SPA routing.
2. **`api/index.ts`**:
   - Vercel Serverless Function entry point exporting the Express application handling all CRUD endpoints (`/api/projects`, `/api/services`, `/api/skills`, `/api/inquiries`, `/api/settings`, `/api/upload`, etc.).
3. **`dist`**:
   - Output directory built by `npm run build`.

---

## 🚀 Step-by-Step Deployment Process

### Step 1: Push Code to Git (GitHub / GitLab / Bitbucket)
Initialize git (if not already done) and push to your repository:
```bash
git init
git add .
git commit -m "feat: complete NIRA Infotech full-stack application"
git branch -M main
git remote add origin https://github.com/your-username/nira-infotech.git
git push -u origin main
```

---

### Step 2: Import Project into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..." ➔ "Project"**.
3. Select your GitHub repository and click **"Import"**.
4. In the **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

---

### Step 3: Configure Environment Variables
In the **Environment Variables** section on Vercel, add the following 4 variables:

| Variable Name | Description | Example / Location |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Your Supabase project URL | `https://xyzabcdefg.supabase.co` (Supabase Settings ➔ API) |
| `SUPABASE_ANON_KEY` | Public client API key | `eyJhbGciOi...` (Supabase Settings ➔ API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret service role API key | `eyJhbGciOi...` (Supabase Settings ➔ API) |
| `ADMIN_SECRET` | Secret password for admin login | `admin123456` (or your chosen password) |

*(Optional)* `GEMINI_API_KEY`: If you enable AI features.

---

### Step 4: Click "Deploy"
1. Click the **"Deploy"** button.
2. Vercel will install dependencies, run `npm run build`, and bundle the Serverless Functions.
3. Once finished, you will receive your live production URL (e.g. `https://nira-infotech.vercel.app`).

---

## 🛠️ Verification & Post-Deployment Checklist

1. **Visit Public Homepage**: Verify hero, services, skills, projects, and contact form load.
2. **Visit Admin Panel (`/admin`)**:
   - Click "Admin Access" in the footer or top navigation.
   - Enter your `ADMIN_SECRET` password.
   - Go to **"Connect Supabase"** tab to verify green connection status.
   - Click **"Sync Local Data"** if you want to push all showcase items into your Supabase database.
3. **Submit Test Inquiry**: Submit a message on the contact form and verify it appears in the Admin **"Inquiries"** tab.
