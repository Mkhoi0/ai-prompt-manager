# AI Prompt Manager

This is my Assessment 3 (AI Capsule) for CSE3CWA — a full-stack web app to save and manage AI prompts, with proper login, deployed live on the cloud for the demo.

## What it does

- Register / login with password hashing (bcrypt) and JWT authentication
- Create, edit, delete prompts — each prompt has a title, content, and tags
- Search by title/content, filter by tag
- One-click copy to clipboard so you don't have to select text manually
- Prompts are private per user — no one can see anyone else's prompts

## Tech stack

- **Frontend:** React 18 + Vite, React Router
- **Backend:** Node.js + Express
- **Auth:** JWT (jsonwebtoken) + bcryptjs for password hashing
- **Database:** SQLite via Node's built-in `node:sqlite` module
- **Deploy:** Render (both backend and frontend)

## Project structure

```
ai-prompt-manager/
├── backend/            # Express API
│   ├── routes/
│   │   ├── auth.js     # /api/auth/register, /api/auth/login
│   │   └── prompts.js  # prompt CRUD, protected by middleware
│   ├── middleware/auth.js   # verifies the JWT
│   ├── db.js            # SQLite setup + schema
│   ├── server.js
│   └── .env.example
└── frontend/            # React SPA
    ├── src/
    │   ├── pages/       # Login, Register, Dashboard
    │   ├── components/  # PromptCard, PromptForm
    │   └── api.js       # fetch wrapper for the API
    └── .env.example
```

## Running it locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
# open .env and set JWT_SECRET to any random string
npm run dev        # or: npm start
```

Runs on `http://localhost:5000`. Health check: `GET /api/health`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:5000
npm run dev
```

Open `http://localhost:5173`, register an account, and start adding prompts.

## API endpoints

| Method | Endpoint              | Auth needed | Description                |
|--------|------------------------|-------------|------------------------------|
| POST   | `/api/auth/register`  | No          | Create account, returns JWT   |
| POST   | `/api/auth/login`     | No          | Log in, returns JWT           |
| GET    | `/api/prompts`        | Yes         | List prompts (`?search=&tag=`)|
| GET    | `/api/prompts/:id`    | Yes         | Get one prompt                |
| POST   | `/api/prompts`        | Yes         | Create a prompt               |
| PUT    | `/api/prompts/:id`    | Yes         | Update a prompt               |
| DELETE | `/api/prompts/:id`    | Yes         | Delete a prompt               |

All `/api/prompts` routes require the header `Authorization: Bearer <token>` — no token means a 401.

## Deploying to Render

You need two separate Render services: one for the backend, one for the frontend.

### 1. Push the code to GitHub
```bash
git init
git add .
git commit -m "AI Prompt Manager - Assessment 3"
git branch -M main
git remote add origin https://github.com/<username>/ai-prompt-manager.git
git push -u origin main
```

### 2. Deploy the backend
1. On [render.com](https://render.com) → **New +** → **Web Service**
2. Connect your GitHub repo, set Root Directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `JWT_SECRET` — a long random string (run `openssl rand -base64 32` to generate one)
   - `CLIENT_ORIGIN` — leave blank for now, fill it in after step 3
6. Backend needs Node ≥ 22.5 because it uses `node:sqlite`. The repo already ships a `.node-version` file (22.9.0) and an `engines` field in `package.json`, so Render should pick the right version automatically — if it doesn't, go to Settings → Environment and add `NODE_VERSION=22.9.0`, then redeploy.
7. Once deployed, grab the URL, e.g. `https://ai-prompt-manager-api.onrender.com`

> Note: on Render's free tier, disk storage is wiped on redeploy, so the SQLite file resets whenever the service redeploys or wakes up from sleep. That's totally fine for a coursework demo — for a real production app you'd want a persistent disk or a hosted Postgres instead.

### 3. Deploy the frontend
1. **New +** → **Static Site**
2. Root Directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Environment variable: `VITE_API_URL` = the backend URL from step 2
6. Deploy — you'll get a URL like `https://ai-prompt-manager.onrender.com`
7. Go back to the backend's env vars, set `CLIENT_ORIGIN` to this frontend URL, and manually redeploy the backend so CORS isn't blocked

### 4. Double-check it works
Visit the frontend URL, register a new account, add/edit/delete a few prompts, refresh to confirm they persist, and open DevTools → Network to see the JWT being sent with each request — good footage for the demo video too.

## Suggested demo video structure (3-5 min)

1. **(~30s)** Quick intro — what the app does, tech stack used
2. **(~60s)** Register on the live URL — can show the Network tab with the JWT being issued
3. **(~90s)** Add a couple of prompts, try search/tag filter, edit one, copy one, delete one
4. **(~30s)** Log out, try hitting `/api/prompts` without a token (Postman, or clear localStorage) to show it gets a 401
5. **(~30s)** Quick look at the code — JWT middleware, password hashing, SQLite schema
6. **(~20s)** Wrap up, mention deployment + GitHub link

## AI use declaration

Don't forget to fill in La Trobe's AI declaration form — note which tool(s) you used, what for, and what you did/checked yourself.
