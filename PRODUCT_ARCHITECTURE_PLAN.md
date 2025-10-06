# Itinerary Comparer - Product & Architecture Plan

🌐 **Live Demo**: [https://itinerary-comparer.vercel.app/](https://itinerary-comparer.vercel.app/)

> **Current Implementation Note**: The prototype currently performs AI-powered PDF parsing on the client-side using Google Gemini API. This results in processing times of 2-5 seconds per PDF. For production deployment, this will be moved to a backend service for improved performance, security, and cost management (see Section 5.B - PDF Processing Service).

---

## What's Submitted
1. **Frontend Application** ✓
   - React web app with PDF upload and comparison
   - AI-powered parsing using Google Gemini
   - Scoring system (0-100) with insights
   - Responsive design for all devices
   - **Live at**: https://itinerary-comparer.vercel.app/

2. **Backend Planning Document (This File)**
   - Architecture overview
   - Team communication plan
   - Implementation roadmap  

---

## Backend Requirements

### Technology Stack (MERN)
**Why MERN?**
- JavaScript across frontend and backend  
- Fast development  
- Works well with JSON data  
- Easy to scale  

**Components:**
- MongoDB - Store itineraries and user data  
- Express.js - API server  
- React - Frontend (already done)  
- Node.js - Backend runtime  
- AWS S3 - PDF storage  
- Redis - Caching (optional)  

---

## System Architecture
**Flow:**  
User → Frontend → Backend API → Database  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
&nbsp;&nbsp;&nbsp;&nbsp;Cloud Storage (S3)  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
&nbsp;&nbsp;&nbsp;&nbsp;AI Service (Gemini)  

**Backend Services Needed:**
- Authentication (login/registration)  
- PDF Processing (upload, parse, score)  
- Comparison (compare multiple itineraries)  
- Sharing (generate shareable links)  

---

## Database Structure

### Users
- Email, password, name  
- Subscription plan  
- Preferences  

### Itineraries
- Name, cost, duration  
- Daily activities  
- Hotels, transport  
- Inclusions/exclusions  
- AI score and rationale  
- PDF file reference  

### Comparisons
- Linked itineraries  
- Analysis results  
- Sharing settings  

---

## Team Communication

### Team Structure
- Frontend Dev - Maintains React app  
- Backend Dev - Builds APIs  
- DevOps - Server setup  
- QA - Testing  

### Daily Workflow
- **Standup:** done, doing, blockers  
- **Code Review:** all changes via pull requests  
- **Weekly Planning:** prioritize and assign tasks  

**Task Example: User Authentication**  
Frontend:
- Login/signup forms  
- Token storage  
- Protected routes  

Backend:
- Registration endpoint  
- Login endpoint  
- Password hashing  
- JWT tokens  

DevOps:
- Environment setup  
- CORS configuration  

---

## Implementation Plan

**Week 1-2: Foundation**
- Set up Node.js + Express  
- Connect MongoDB  
- Build auth APIs  
- Create login UI  

**Week 3-4: Core Features**
- PDF upload endpoint  
- AI integration (backend)  
- Comparison APIs  
- Connect frontend to backend  

**Week 5-6: Launch**
- Email notifications  
- Sharing features  
- Testing and optimization  
- Deploy to production  

---

## Security Requirements
- Move API key to backend  
- Hash passwords with bcrypt  
- Use HTTPS  
- Validate inputs  
- Rate limiting  

---

## What Each Developer Needs

### Frontend Developer
**Current issues to fix:**
- Replace direct Gemini API calls with backend proxy  
- Remove localStorage, use backend APIs  
- Add login/signup UI  

**Code locations:**
- PDF parsing: `/src/utils/pdfParser.js`  
- Scoring: `/src/utils/scoringEngine.js`  
- State: `/src/context/ItineraryContext.jsx`  

### Backend Developer
**APIs to build:**
- `POST /api/auth/register`  
- `POST /api/auth/login`  
- `POST /api/itineraries/upload`  
- `POST /api/comparisons/create`  
- `GET /api/itineraries`  
- `GET /api/comparisons/:id`  

**Database models:**
- User  
- Itinerary  
- Comparison  

### DevOps Engineer
**Infrastructure:**
- Node.js hosting (Vercel/Railway)  
- MongoDB Atlas  
- S3 bucket setup  
- Environment variables  
- Monitoring (Sentry)  

---

## Next Steps Checklist

**This Week:**
- Team review of this plan  
- Create backend GitHub repo  
- Set up MongoDB database  
- Assign tasks to developers  

**Week 1:**
- Build authentication  
- Create login UI  
- Connect frontend to backend  

**Week 2:**
- PDF upload API  
- Move AI processing to backend  
- Testing  

---

## Cost Estimate
| Service  | Monthly Cost |
|----------|--------------|
| Hosting  | $20          |
| Database | $10          |
| Storage  | $5           |
| Email    | $15          |
| **Total**| **$50**      |
 

---

## FAQ
**Q:** Why move API key to backend?  
**A:** Currently exposed in browser - security risk.  

**Q:** Why MongoDB over MySQL?  
**A:** Itineraries have flexible structure, MongoDB handles this better.  

**Q:** What if PDF parsing fails?  
**A:** Fallback to manual input by user.  

---



