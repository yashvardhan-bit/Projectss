# AI Learning Path Assistant

A minimal full-stack app that analyzes your current skills vs a target role and generates a personalized learning roadmap.

- **Backend**: FastAPI (Python)
- **Frontend**: React (Vite) + Tailwind CSS
- **Roadmap logic**: Rule-based (always works offline)

## Project structure

```
backend/
frontend/
```

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** (recommended) + npm

## 1) Run the backend

From the repo root:

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend health:
- `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs`

## 2) Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the app at the URL Vite prints (typically `http://localhost:5173`).

The frontend calls the backend at `http://localhost:8000` (see `frontend/.env`).

### If you don’t have Node/npm installed

Install Node.js (LTS) first, then re-run the frontend commands above.

## API

### POST `/analyze`

Request:

```json
{
  "role": "Data Scientist",
  "skills": ["Python", "SQL"],
  "skillLevel": "Beginner"
}
```

Response:

```json
{
  "role": "Data Scientist",
  "existing_skills": ["Python", "SQL"],
  "missing_skills": ["Statistics", "Machine Learning", "Data Visualization"],
  "roadmap": [
    {
      "step": 1,
      "title": "Statistics fundamentals",
      "skills": ["Statistics"],
      "explanation": "Learn descriptive stats, probability, and common distributions.",
      "resources": ["Khan Academy: Statistics", "StatQuest (YouTube)"]
    }
  ]
}
```
