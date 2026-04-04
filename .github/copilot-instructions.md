# Project Guidelines

## Build And Run
- Install dependencies: npm install
- Start dev server: npm run dev
- Production build: npm run build
- Start production server: npm start
- No test script is configured.
- No lint script is configured. Use npx eslint src when needed.

## Architecture
- Framework: Next.js pages router.
- UI pages are in src/pages.
  - src/pages/index.js handles login and registration.
  - src/pages/dashboard.js handles celebrity image rating flow.
- API routes are in src/pages/api.
  - src/pages/api/auth/login.js and src/pages/api/auth/register.js handle authentication.
  - src/pages/api/ratings/index.js handles reading and writing user ratings.
  - src/pages/api/export.js exports dataset and ratings files.
- Shared logic is in src/lib.
  - src/lib/auth.js handles JWT token signing and request auth.
  - src/lib/storage.js handles file-based persistence.
  - src/lib/celebrities.js is the source of truth for celebrity metadata and image lists.

## Conventions
- Auth uses Bearer JWT in Authorization header.
- Protected API handlers should call getUserFromRequest early and return 401 on missing or invalid token.
- API errors use JSON shape: { error: "message" } with appropriate status codes.
- Ratings are upserted by userId + imageId, not appended blindly.
- imageId format is celebrityId_imageNumber.
- JSON storage files are pretty-printed with 2-space indentation.

## Data And Environment Gotchas
- JWT_SECRET must be defined in .env.local.
- Storage is local file-based under data/users.json and data/ratings.json.
- The data directory must be writable in local development.
- File storage is not durable on serverless platforms; keep this in mind for production deploys.
- next.config.js currently allows broad image domains. Tighten this for production.

## Key Pattern Files
- src/lib/auth.js
- src/lib/storage.js
- src/pages/api/ratings/index.js
- src/pages/index.js
- src/pages/dashboard.js

## Documentation Links
- See SETUP_GUIDE.md for full onboarding, local setup, and image replacement steps.
- See vercel.json for deployment routing config.
- See next.config.js for image handling configuration.
