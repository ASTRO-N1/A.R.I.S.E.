# ⚡ ARISE — AI-Driven Resource & Inventory Smart Engine

## A modern full-stack AI-powered inventory optimization platform built with **React + Vite** (frontend) and **Python Flask** (backend). Features a stunning, futuristic landing page with light/dark themes, interactive animations, and glassmorphism design.

## 📁 Project Structure

```
ARISE/
├── backend/                    # Flask API server
│   ├── app.py                  # Main application entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables (Flask config)
│   ├── Dockerfile              # Multi-stage Docker build
│   └── .dockerignore
├── frontend/                   # React + Vite SPA
│   ├── public/
│   │   └── images/             # Carousel industry images
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── icons/Icons.jsx # SVG icon library (replaces emojis)
│   │   │   ├── Navbar.jsx      # Floating glassmorphism pill navbar
│   │   │   ├── ThemeToggle.jsx # Light/dark theme toggle
│   │   │   ├── HeroSection.jsx # Hero headline + globe network
│   │   │   ├── FeaturesSection.jsx  # 3D tilt feature cards
│   │   │   ├── HeroCarousel.jsx     # Full-width image carousel
│   │   │   ├── DashboardPreview.jsx # Analytics dashboard mockup
│   │   │   ├── TimelineSection.jsx  # How-it-works timeline
│   │   │   ├── MetricsSection.jsx   # Animated KPI counters
│   │   │   ├── CtaSection.jsx       # Bottom call-to-action
│   │   │   ├── Footer.jsx
│   │   │   ├── ParticleBackground.jsx # Canvas particle animation
│   │   │   ├── GlobeNetwork.jsx       # SVG holographic globe
│   │   │   └── LineChart.jsx          # SVG demand chart
│   │   ├── hooks/
│   │   │   └── useInView.js    # IntersectionObserver + count-up hooks
│   │   ├── constants/
│   │   │   └── content.js      # Centralized content & data
│   │   ├── App.jsx             # Root composition component
│   │   ├── App.css             # Component styles (light + dark)
│   │   ├── index.css           # Design system / CSS variables
│   │   └── main.jsx            # React DOM entry point
│   ├── index.html              # HTML template with Google Fonts
│   ├── vite.config.js          # Vite config with API proxy
│   ├── Dockerfile              # Multi-stage Docker build (Nginx)
│   └── .dockerignore
└── README.md                   # ← You are here
```

---

## ✨ Features

### Landing Page

- **Light + Dark Theme** — Fully integrated with CSS custom properties, persisted to localStorage
- **Floating Pill Navbar** — Glassmorphism frosted glass with diamond separators
- **Hero Section** — Animated headline with holographic globe network visualization
- **3D Tilt Feature Cards** — Interactive perspective rotation following cursor
- **Image Carousel** — 5 industry slides with parallax, auto-advance, and pagination
- **Dashboard Preview** — Glassmorphism analytics panel with charts, heatmaps, and AI cards
- **Animated KPI Counters** — Numbers count up when scrolled into view
- **Staggered Scroll Animations** — Elements reveal with cascading delays
- **Particle Background** — Canvas-based floating particle network
- **Responsive Design** — Adapts from mobile to ultrawide

### Backend API

- RESTful Flask API with CORS support
- Health check / test endpoints
- Environment-based configuration

---

## ⚡ Quick Start

### Prerequisites

| Tool    | Version |
| ------- | ------- |
| Node.js | ≥ 18    |
| Python  | ≥ 3.10  |
| pip     | latest  |

---

### 1. Start the Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate        # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

Backend starts at **http://localhost:5000**.

**API Endpoints:**

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| GET    | `/api/health` | Health check              |
| GET    | `/api/test`   | Integration test endpoint |
| GET    | `/api/items`  | List sample modules       |
| POST   | `/api/items`  | Create a new item (demo)  |

---

### 2. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend starts at **http://localhost:5173**.

> The Vite dev server proxies all `/api/*` requests to the Flask backend on port 5000.

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable       | Default                   | Description             |
| -------------- | ------------------------- | ----------------------- |
| `FLASK_DEBUG`  | `1`                       | Enable Flask debug mode |
| `PORT`         | `5000`                    | Server port             |
| `SECRET_KEY`   | `arise-dev-secret-key...` | Flask secret key        |
| `FRONTEND_URL` | `http://localhost:5173`   | Allowed CORS origin     |
| `APP_NAME`     | `ARISE API`               | Application name        |
| `APP_VERSION`  | `1.0.0`                   | Application version     |

### Frontend (`frontend/.env`)

| Variable        | Default                 | Description              |
| --------------- | ----------------------- | ------------------------ |
| `VITE_API_URL`  | `http://localhost:5000` | Backend API base URL     |
| `VITE_APP_NAME` | `ARISE`                 | Application display name |

---

## 🐳 Docker

### Build & Run Backend

```bash
cd backend
docker build -t arise-backend .
docker run -p 5000:5000 --env-file .env arise-backend
```

### Build & Run Frontend

```bash
cd frontend
docker build -t arise-frontend .
docker run -p 3000:80 arise-frontend
```

---

## 🛠 Tech Stack

| Layer            | Technology                           |
| ---------------- | ------------------------------------ |
| Frontend         | React 19, Vite 7                     |
| Styling          | Vanilla CSS (custom design system)   |
| Typography       | Inter (Google Fonts)                 |
| Animations       | CSS keyframes + IntersectionObserver |
| Icons            | Custom SVG components                |
| Backend          | Python 3.12, Flask 3.1               |
| CORS             | flask-cors                           |
| Env Mgmt         | python-dotenv / Vite env             |
| Prod WSGI        | Gunicorn                             |
| Containerization | Docker (multi-stage builds)          |

---

## 👤 Author

**Sneha Rangole**

- GitHub: [github.com/sneha-rangole](https://github.com/sneha-rangole)

---

## 📝 License

This project is for personal / educational purposes.
