<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ilyn-GCaVvEw4Yv_9ivGW72P9x0ctZjZ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment

### 1. GitHub Preparation
1. Initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub.
3. Link and push your code:
   ```bash
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### 2. Deploy on Vercel

#### Method 1: Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** > **"Project"**.
3. Import your GitHub repository.
4. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Environment Variables:** Add `GEMINI_API_KEY` (copy from your local `.env.local`).
5. Click **Deploy**.

#### Method 2: Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy (Preview):
   ```bash
   vercel
   ```
   - Set up and deploy? [Y]
   - Which scope? [Select your scope]
   - Link to existing project? [N]
   - Project name? [arafath-assignment-web]
   - In which directory? [./]
   - Want to modify these settings? [N]
4. Deploy (Production):
   ```bash
   vercel --prod
   ```
