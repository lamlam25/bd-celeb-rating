# BD Celebrity Rater — Complete Setup Guide
## For Beginners (Step by Step)

---

## WHAT YOU'LL BUILD
- A website where users register/login with email & password
- Users can view 20 Bangladeshi celebrities (5 images each = 100 images)
- Users rate each image 1–5 stars
- Admin can download ratings + dataset as Excel files
- The site can be made live on the internet for free using Vercel

---

## PART 1 — INSTALL REQUIRED SOFTWARE ON YOUR PC

### Step 1: Install Node.js
Node.js is the engine that runs your project.

1. Open your browser and go to: **https://nodejs.org**
2. Click the big green button that says **"LTS"** (Long Term Support)
3. Download the Windows installer (.msi file)
4. Open the downloaded file and click Next → Next → Install
5. Wait for it to finish, then click Finish

**Check it worked:**
- Press `Windows key + R`, type `cmd`, press Enter
- In the black window, type: `node --version` and press Enter
- You should see something like: `v20.11.0`
- Also type: `npm --version` — you should see a number like `10.2.4`

---

### Step 2: Install Git
Git is used to save and upload your project files.

1. Go to: **https://git-scm.com/download/win**
2. Download the installer and run it
3. Click Next on every screen (default settings are fine)
4. Finish the installation

**Check it worked:**
- Open cmd again
- Type: `git --version`
- You should see: `git version 2.x.x`

---

### Step 3: Install VS Code (Code Editor)
This is where you'll view and edit your project files.

1. Go to: **https://code.visualstudio.com**
2. Click the blue "Download for Windows" button
3. Install it (click Next, Next, Install)
4. Open VS Code after installation

---

## PART 2 — SET UP THE PROJECT ON YOUR PC

### Step 4: Create a folder for your project

1. Open **File Explorer** (Windows key + E)
2. Go to your Desktop or Documents folder
3. Right-click → New → Folder
4. Name it: `bd-celeb-rating`

---

### Step 5: Copy the project files

The project files I've created need to go inside your `bd-celeb-rating` folder.
Copy ALL of these files maintaining the exact folder structure:

```
bd-celeb-rating/
├── package.json
├── next.config.js
├── vercel.json
├── .gitignore
├── .env.local
└── src/
    ├── lib/
    │   ├── celebrities.js
    │   ├── storage.js
    │   └── auth.js
    ├── pages/
    │   ├── _app.js
    │   ├── index.js
    │   ├── dashboard.js
    │   └── api/
    │       ├── export.js
    │       ├── auth/
    │       │   ├── login.js
    │       │   └── register.js
    │       └── ratings/
    │           └── index.js
    └── styles/
        └── globals.css
```

---

### Step 6: Open the project in VS Code

1. Open VS Code
2. Click **File** → **Open Folder**
3. Find your `bd-celeb-rating` folder and click **Select Folder**
4. You should see all your files in the left panel

---

### Step 7: Open Terminal inside VS Code

1. In VS Code, click **Terminal** in the top menu
2. Click **New Terminal**
3. A black panel will appear at the bottom — this is your terminal

---

### Step 8: Install project dependencies

In the VS Code terminal, type this command and press Enter:

```
npm install
```

This will download all the required packages. It may take 1–3 minutes.
You'll see a lot of text scrolling — that's normal!
Wait until you see the cursor blinking again.

---

### Step 9: Start the project locally

In the terminal, type:

```
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

**Now open your browser and go to: http://localhost:3000**

You should see the BD Celebrity Rater login page! 🎉

---

## PART 3 — ADD YOUR CELEBRITY IMAGES

### Step 10: Add real celebrity images

Right now the images are placeholder URLs. You need to replace them with real images.

**Option A — Upload images to Imgur (Free & Easy)**
1. Go to: **https://imgur.com**
2. Click "New post" → upload a celebrity photo
3. After upload, right-click the image → "Copy image address"
4. That URL looks like: `https://i.imgur.com/XXXXXXX.jpg`

**Option B — Use direct Google image URLs**
1. Find a celebrity image on Google
2. Right-click → "Copy image address"
3. Use that URL

**How to update the celebrities.js file:**
1. In VS Code, open `src/lib/celebrities.js`
2. Find the celebrity you want (e.g., Shakib Khan)
3. Replace each `https://i.imgur.com/placeholder1a.jpg` with your actual image URL
4. Do this for all 5 images of each celebrity (5 images × 20 celebrities = 100 URLs total)

Example — change this:
```javascript
images: [
  "https://i.imgur.com/placeholder1a.jpg",
  "https://i.imgur.com/placeholder1b.jpg",
```

To this (with real URLs):
```javascript
images: [
  "https://i.imgur.com/ABCDEFG.jpg",
  "https://i.imgur.com/HIJKLMN.jpg",
```

**Save the file** (Ctrl + S) after every edit.

---

## PART 4 — TEST YOUR PROJECT

### Step 11: Test all features

With the project running (npm run dev), go to http://localhost:3000 and:

1. **Register:** Click Register → fill in Name, Email, Password → Create Account
2. **Login:** It should log you in automatically
3. **Dashboard:** You should see all 20 celebrities
4. **Rate an image:** Click any image thumbnail → click stars in the popup
5. **Export Excel:** Click "↓ Dataset Excel" or "↓ Ratings Excel" buttons

If you see the placeholder emoji (🎬) instead of photos — that just means your
placeholder URLs don't load. Replace them with real image URLs in Step 10.

---

## PART 5 — DEPLOY TO THE INTERNET (FREE with Vercel)

### Step 12: Create a GitHub account (if you don't have one)

1. Go to: **https://github.com**
2. Click "Sign up"
3. Enter email, password, username
4. Verify your email

---

### Step 13: Create a new GitHub repository

1. After logging in to GitHub, click the **+** button (top right) → **New repository**
2. Repository name: `bd-celeb-rating`
3. Keep it **Private** (so only you can see)
4. Click **Create repository**
5. You'll see a page with setup instructions — keep this tab open

---

### Step 14: Upload your project to GitHub

Go back to VS Code terminal (stop the running server first with Ctrl+C, then type):

```
git init
git add .
git commit -m "Initial commit - BD Celebrity Rater"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bd-celeb-rating.git
git push -u origin main
```

⚠️ Replace `YOUR_USERNAME` with your actual GitHub username!

It will ask for your GitHub username and password.
For password — you need to use a **Personal Access Token** instead:
1. Go to GitHub → Profile → Settings → Developer settings
2. Personal access tokens → Tokens (classic) → Generate new token
3. Check the "repo" checkbox → Generate token
4. Copy the token and paste it as your password

---

### Step 15: Deploy on Vercel

1. Go to: **https://vercel.com**
2. Click **Sign Up** → choose **Continue with GitHub**
3. Authorize Vercel to access your GitHub
4. Click **Add New** → **Project**
5. Find `bd-celeb-rating` in the list → click **Import**
6. On the configuration screen:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: leave as `./`
7. Scroll down to **Environment Variables** and add:
   - Name: `JWT_SECRET`
   - Value: `some-long-random-secret-string-type-anything-here-make-it-long`
   - Click **Add**
8. Click **Deploy**
9. Wait 2–3 minutes...
10. 🎉 Your site is LIVE! You'll get a URL like: `https://bd-celeb-rating.vercel.app`

---

## PART 6 — IMPORTANT NOTES

### About Data Storage
The project stores users and ratings in JSON files in a `data/` folder.
- On your local PC: works perfectly
- On Vercel free tier: data resets when the server restarts (every few hours)

**To keep data permanently on Vercel, you have two options:**

**Option A (Easy & Free) — Use a free database:**
1. Go to: **https://supabase.com** → Sign up for free
2. Create a new project
3. Use the Supabase documentation to connect — or ask me to update the code!

**Option B — Keep it simple for your project submission:**
If this is just for a university project/submission, run it locally with
`npm run dev` and use the Excel export buttons to download your data.
The local version works perfectly and data stays saved.

---

### How to Export Excel Files
Once logged in on the dashboard:
- Click **"↓ Dataset Excel"** → downloads the 100-image dataset
- Click **"↓ Ratings Excel"** → downloads all ratings + summary sheet

These files will open in Microsoft Excel or Google Sheets.

---

### How to Update Code and Re-deploy
After making any changes to your code:
1. Save the file in VS Code (Ctrl+S)
2. In terminal, run:
```
git add .
git commit -m "Update - describe what you changed"
git push
```
3. Vercel automatically re-deploys within 1–2 minutes!

---

## QUICK REFERENCE COMMANDS

| What you want to do | Command |
|---|---|
| Start project locally | `npm run dev` |
| Stop the server | `Ctrl + C` |
| Install packages | `npm install` |
| Save + push to GitHub | `git add . && git commit -m "update" && git push` |

---

## TROUBLESHOOTING

**"npm is not recognized"**
→ Node.js didn't install properly. Re-install from nodejs.org and restart your PC.

**"Port 3000 already in use"**
→ Another app is using port 3000. Change it: `npm run dev -- -p 3001`
→ Then visit http://localhost:3001

**Images not showing**
→ Replace placeholder URLs in `src/lib/celebrities.js` with real image URLs.

**Login not working**
→ Make sure the server is running (`npm run dev`) and no errors show in terminal.

**Vercel deploy failing**
→ Check that your `.env.local` file has the JWT_SECRET variable set in Vercel dashboard.

---

## NEED HELP?
If you get stuck at any step, take a screenshot of the error and ask for help!
