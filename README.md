# Itinerary Comparer

A professional React web application that intelligently compares 2-3 travel itineraries using AI-powered parsing and scoring.

🌐 **Live Demo**: [https://itinerary-comparer.vercel.app/](https://itinerary-comparer.vercel.app/)

> **Note**: PDF parsing currently runs on the client-side using Google Gemini API. This may take 2-5 seconds per PDF. In production, this will be moved to a backend service for better performance and security.

## Features

- **AI-Powered PDF Parsing**: Upload PDF itineraries and let Google Gemini AI extract all trip details automatically
- **Smart Comparison**: Compare up to 3 itineraries side-by-side with intelligent scoring (0-100)
- **Intelligent Scoring** based on:
  - Cost Efficiency (35%)
  - Activity Diversity (25%)
  - Time Optimization (20%)
  - Inclusiveness (20%)
- **Interactive Charts**: Visual comparison with cost analysis, activity distribution, and score breakdowns
- **Day-by-Day Timeline**: Collapsible daily itinerary with activities, meals, and accommodation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant recalculation when adding or removing itineraries

## Tech Stack

- React 18 + Vite
- Tailwind CSS 4
- Google Gemini AI (free tier)
- PDF.js
- Recharts
- Zustand

## Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ItineraryComparer
npm install
```

### 2. Get Google Gemini API Key (Free)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### 3. Configure Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your API key
VITE_GOOGLE_API_KEY=your_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Build for Production

```bash
npm run build
npm run preview
```

## Deployment

Deploy to Vercel (recommended):

```bash
npm install -g vercel
vercel --prod
```

Add environment variable in Vercel:
- Key: `VITE_GOOGLE_API_KEY`
- Value: Your Google Gemini API key

