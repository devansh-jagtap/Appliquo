# Appliquo

**TrackEveryApplication. LandYourDreamJob.**

Appliquo is a full-stack job application tracker with an AI Job Assistant that helps users manage job applications and quickly generate resume improvements, cover letters, and skill gap analysis using only a job description and resume text.

---

## ✨ Features

### Job Tracking
- Track and manage job applications
- Monitor application status in one place

### AI Job Assistant
Provide **Job Description + Resume (text)** to get:
- Resume Improvement suggestions  
- AI-generated Cover Letter  
- Skill Gap Analysis  

---

## 🛠️ Tech Stack

- React  
- Tailwind CSS  
- shadcn/ui  
- Supabase  
- Gemini AI  

**Domain:** Full Stack Development

---

## 🌐 Live Demo

https://appliquo.vercel.app/

---

## ⚙️ Setup

```bash
git clone <repository_url>
cd Appliquo
```
### 2. Install Dependencies
```bash
npm install
```
This installs all required frontend libraries, UI components, Supabase client, and AI-related dependencies.

### 3. Environment Variables Setup
Create a .env file in the root directory and add the following:
.env
```bash
VITE_GEMINI_API_KEY="your_gemini_api_key"
VITE_SUPABASE_URL="your_supabase_project_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
```
### Explanation:

VITE_GEMINI_API_KEY
Used for AI features such as resume improvement, cover letter generation, and skill gap analysis.

VITE_SUPABASE_URL
The URL of your Supabase project used for authentication and database operations.

VITE_SUPABASE_ANON_KEY
Public anonymous key required to connect the frontend with Supabase.

Note: Since this project uses Vite, all environment variables must start with VITE_.

### 4. Start the Development Server
``` bash
npm run dev
```
After running the command, open the browser and visit:
```bash
http://localhost:5173
```
