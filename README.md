# Agentic Study Buddy (YouTube & PDF)

Live app: https://ai-agentic-study-buddy-d8ec6ec5b559.herokuapp.com/

## Demo

![App demo](assets/demo.gif)

[► Full demo video (MP4)](assets/Agentic_Study_Buddy_Demo.mp4)







<!-- Add a GIF or video link if available -->
<!-- ![App demo](assets/demo.gif) -->
<!-- [▶ Full demo video](assets/demo.mp4) -->

Turn any **YouTube link** or **PDF** into deep study notes and a **30-question quiz** in seconds. The agent ingests sources, summarizes with timestamps (for YouTube), and synthesizes a comprehensive guide and quiz.

## How to use
- Paste a YouTube link or upload a PDF, then choose Research, Study Guide, or Quiz.
- View the agent log, per-source notes, and a synthesized guide.
- Generate a 30-question quiz to practice.

## Tech stack
- Frontend: React + Vite + TypeScript + Tailwind
- Backend: Node/Express (TypeScript)
- LLM: Google Gemini (2.5 Flash)
- Infra: Docker (local), Heroku or Vercel (deploy)

## Local development

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env

cd server && npm install && npm run dev
cd ../client && npm install && npm run dev
```

- Server default: http://localhost:4000
- Client default: http://localhost:5173

## Docker

```bash
docker compose up --build
```

App is available at http://localhost:8080 if the compose file uses a reverse proxy.

## Environment

Root .env (used by Docker and compose):

```
PORT=8787
YOUTUBE_API_KEY=""
GEMINI_API_KEY=""
MAX_VIDEOS=8
```

server/.env:

```
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
YOUTUBE_API_KEY=
MAX_VIDEOS=8
```

client/.env:

```
VITE_BACKEND_URL=http://localhost:4000
```

Keep real keys out of Git. Commit only the .env.example files.

## Deploy (Heroku container)

```bash
heroku login
heroku container:login
APP="ai-agentic-study-buddy"
heroku apps:create "$APP"
heroku stack:set container -a "$APP"
heroku config:set GEMINI_API_KEY="your_value" YOUTUBE_API_KEY="your_value" MAX_VIDEOS=8 -a "$APP"
export DOCKER_DEFAULT_PLATFORM=linux/amd64
heroku container:push web -a "$APP"
heroku container:release web -a "$APP"
heroku open -a "$APP"
```


## License
MIT © 2025 Simon Yam

