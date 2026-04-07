# Deployment Guide for BD Celebrity Rating App

## Your Project Status
✅ All 20 celebrities with 100 images are configured (using Imgur URLs)
✅ No local image files need to be committed (images are external URLs)
✅ Project is ready to deploy

## Step 1: Commit Your Code to Git

Open **Command Prompt** or **Git Bash** and run:

```bash
cd "D:\Artificial Intelligence\bd-celeb-rating\bd-celeb-rating"

# Check current status
git status

# Add all changes
git add .

# Commit
git commit -m "Ready for production deployment with all celebrities"

# If you haven't created a GitHub repository yet:
# 1. Go to github.com and create a new repository
# 2. Then run:
# git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
# git branch -M main
# git push -u origin main

# If you already have a remote:
git push
```

## Step 2: Deploy to Vercel

### Method A: Using Vercel CLI (Fastest - 2 minutes)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login (opens browser)
vercel login

# Deploy to production
vercel --prod
```

**When prompted:**
- Set up and deploy? **Y**
- Which scope? *Choose your account*
- Link to existing project? **N**
- What's your project's name? **bd-celeb-rating** (or any name)
- In which directory is your code located? **./** (press Enter)
- Want to override the settings? **N**

Vercel will deploy and give you a URL like: `https://bd-celeb-rating.vercel.app`

### Method B: Using Vercel Dashboard (Easiest for beginners)

1. **Go to https://vercel.com** and sign in with GitHub
2. **Click "Add New" → "Project"**
3. **Import your repository** (it should appear in the list)
4. **Configure:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
5. **Add Environment Variable:**
   - Key: `JWT_SECRET`
   - Value: `bd-celeb-2026-secret-key-change-in-production`
   - Apply to: Production, Preview, Development
6. **Click "Deploy"**

## Step 3: After Deployment

1. Vercel will give you a URL: `https://your-project.vercel.app`
2. Visit the URL and test:
   - Register a new user
   - Login
   - Rate some celebrities
3. **Important**: Your current setup uses local file storage which won't persist on Vercel. Each deployment resets the data. This is fine for demos but for production, you'll need a database.

## Environment Variables

Make sure to set in Vercel Dashboard:
- `JWT_SECRET`: A secure random string (required for authentication)

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Troubleshooting

**Build fails?** Check:
- JWT_SECRET is set in Vercel environment variables
- All dependencies are in package.json

**Can't connect to GitHub?** 
```bash
git remote -v  # Check if remote is set
```

**Images not loading?**
- Your images are on Imgur and should load automatically
- Check next.config.js allows imgur.com domain

## Next Steps (Optional)

For a production app, consider:
1. **Database**: Replace file storage with MongoDB, Supabase, or Vercel Postgres
2. **Security**: Generate a strong JWT_SECRET
3. **Analytics**: Add Vercel Analytics
4. **Domain**: Add a custom domain in Vercel settings

---

Need help? Check the logs in Vercel Dashboard → Your Project → Deployments
