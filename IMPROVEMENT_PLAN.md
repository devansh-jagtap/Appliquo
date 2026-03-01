# Appliquo Improvement Plan

**Project Transformation Roadmap**  
**Date:** March 2, 2026  
**Status:** Planning Phase  
**Goal:** Transform Appliquo from MVP to Production-Ready Job Application Tracker

---

## Executive Summary

Appliquo has a solid foundation with real AI integration (Gemini), functional application tracking, and resume management. However, it suffers from:

- ❌ Misleading "ATS Score" (basic keyword matching)
- ❌ Missing critical features (OAuth, user profile, deadlines, follow-ups)
- ❌ Bug: Date field mismatch in applications
- ❌ Confusing navigation names ("Assistant" doesn't explain functionality)
- ❌ Overselling features in hero section cards

**This plan addresses all issues systematically.**

---

## Current State Analysis

### ✅ What Works Well

- **Core application tracking** - Add, update, delete applications
- **Real AI integration** - Gemini 2.5 Flash for resume help & cover letters
- **Resume upload** - Text and PDF with signed URL viewing
- **Authentication** - Supabase email/password with protected routes
- **Modern UI** - Claude theme with dark mode

### 🔴 Critical Issues

1. **ATS Scoring is Fake**
   - File: `src/components/resume/ResumeUpload.jsx` (lines 13-29)
   - Current: Basic keyword matching (`["react", "javascript", "node", "sql", "api"]`)
   - PDF files get hardcoded score of **75** without analysis

2. **Date Field Bug**
   - File: `src/components/application/ApplicationForm.jsx`
   - Issue: Creates `date` field but database uses `created_at`
   - Result: Application dates show as `undefined`

3. **Missing Features**
   - No OAuth (Google, GitHub, LinkedIn)
   - No user profile page
   - No deadline/follow-up tracking
   - No job description library
   - Can't save AI-generated cover letters

4. **Confusing Navigation**
   - "Assistant" doesn't explain what it does
   - "Dashboard" could be more descriptive

---

## Phase 1: Fix Critical Bugs & Rename Navigation 🔧

**Priority:** HIGH | **Timeline:** 1-2 days

### 1.1 Fix Application Date Bug

**Problem:**

```javascript
// ApplicationForm.jsx creates unused 'date' field
const [date, setDate] = React.useState("");
// But database has 'created_at' (auto-generated)
```

**Solution:**

- Remove `date` state from ApplicationForm.jsx
- Update ApplicationList.jsx to display `created_at` timestamp
- Format dates properly: "Applied 2 days ago" or "March 1, 2026"

**Files to Edit:**

- `src/components/application/ApplicationForm.jsx`
- `src/components/application/ApplicationList.jsx`

---

### 1.2 Rename Navigation for Clarity

**Current → New:**

| Old Name  | New Name               | Subtitle                                       |
| --------- | ---------------------- | ---------------------------------------------- |
| Dashboard | **Track Applications** | "Manage your job applications in one place"    |
| Assistant | **AI Career Coach**    | "Get personalized resume help & cover letters" |
| Resumes   | **My Resumes**         | "Upload and analyze your resumes"              |
| _(New)_   | **Profile & Settings** | "Manage your account and preferences"          |

**Files to Edit:**

- `src/App.jsx` - Update route names
- `src/components/layout/Navbar.jsx` - Update navigation links
- `src/components/landing/HeroSection.jsx` - Update footer links

---

## Phase 2: Honest Resume Scoring System 📊

**Priority:** HIGH | **Timeline:** 2-3 days

### 2.1 Replace "ATS Score" with "Resume Quality Score"

**Why:** Current ATS is misleading - it's not actual Applicant Tracking System parsing.

**Approach: Enhanced Quality Scoring**

**New Algorithm:**

```javascript
const calculateResumeQualityScore = (text) => {
  let score = 0;
  const lower = text.toLowerCase();

  // 1. Length & Structure (25 points)
  if (text.length > 1500) score += 15;
  if (text.length > 500 && text.length <= 1500) score += 10;

  // 2. Essential sections (30 points)
  const sections = ["experience", "education", "skills"];
  sections.forEach((s) => {
    if (lower.includes(s)) score += 10;
  });

  // 3. Contact information (15 points)
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(
    text,
  );
  const hasPhone = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  if (hasEmail) score += 8;
  if (hasPhone) score += 7;

  // 4. Action verbs & achievements (20 points)
  const actionVerbs = [
    "developed",
    "created",
    "led",
    "managed",
    "increased",
    "reduced",
    "implemented",
    "designed",
    "achieved",
  ];
  const verbCount = actionVerbs.filter((v) => lower.includes(v)).length;
  score += Math.min(verbCount * 2, 20);

  // 5. Quantifiable results (10 points)
  const hasNumbers = /\d+%|\d+x|\$\d+/.test(text);
  if (hasNumbers) score += 10;

  return Math.min(score, 100);
};
```

**UI Changes:**

- Rename all "ATS Score" → "Quality Score"
- Add disclaimer: _"This is a resume quality indicator, not an actual ATS system"_
- Show breakdown: "Structure: 15/25, Sections: 30/30, Contact: 15/15..."

**Files to Edit:**

- `src/components/resume/ResumeUpload.jsx`
- `src/components/resume/ResumeList.jsx`
- `src/components/resume/ResumeViewer.jsx`

---

### 2.2 Fix PDF Resume Analysis

**Problem:** PDFs get hardcoded score of 75

**Solution:** Extract text from PDF and analyze

**Implementation:**

```bash
npm install pdf-parse
```

```javascript
import pdfParse from "pdf-parse";

const analyzePdfResume = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdfParse(buffer);
  const text = data.text;

  return calculateResumeQualityScore(text);
};
```

---

## Phase 3: Enhanced Application Tracking 🎯

**Priority:** HIGH | **Timeline:** 3-4 days

### 3.1 Database Schema Updates

**New columns for `applications` table:**

```sql
ALTER TABLE applications
ADD COLUMN deadline DATE,
ADD COLUMN applied_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN follow_up_date DATE,
ADD COLUMN notes TEXT,
ADD COLUMN job_url TEXT,
ADD COLUMN salary_range TEXT,
ADD COLUMN location TEXT;
```

**Migration File:** `supabase/migrations/001_enhance_applications.sql`

---

### 3.2 New Dashboard Features

**Add to ApplicationForm:**

- ✅ Company (existing)
- ✅ Role (existing)
- ✅ Status dropdown (existing)
- 🆕 Application deadline (date picker)
- 🆕 Applied date (date picker, defaults to today)
- 🆕 Follow-up date (date picker, optional)
- 🆕 Job posting URL (text input)
- 🆕 Salary range (text input, optional)
- 🆕 Location (text input)
- 🆕 Notes (textarea for interview notes, reminders, etc.)

**Add to ApplicationList:**

- Show deadline with visual indicator (red if past due)
- "Follow up today" badge if follow_up_date is today
- Filter by: Status, Company, Date range
- Search by company or role name
- Sort by: Date applied, Deadline, Status, Company
- Export to CSV button

**New Components to Create:**

- `src/components/application/ApplicationFilters.jsx`
- `src/components/application/DeadlineWidget.jsx`
- `src/components/application/UpcomingFollowUps.jsx`

---

### 3.3 Calendar View (Future Enhancement)

**Future Feature:** Visual calendar showing:

- Application deadlines (red)
- Follow-up dates (blue)
- Interview dates (green)

**Library:** `react-big-calendar` or `@fullcalendar/react`

---

## Phase 4: AI Career Coach Enhancement 🤖

**Priority:** MEDIUM | **Timeline:** 3-4 days

### 4.1 Reorganize AI Features

**Rename Page:** `Assistant.jsx` → `AICareerCoach.jsx`

**New Layout:**

```
┌─────────────────────────────────────────────────────────┐
│                    AI Career Coach                       │
│   Powered by Google Gemini 2.5 Flash                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  📝 Resume Optimizer                                     │
│  ────────────────────────────────────────────────────── │
│  [Upload or Select Resume ▼]                            │
│  [ Generate Suggestions ]                               │
│                                                          │
│  Results: [COPY] [SAVE TO LIBRARY]                     │
│  • Use more action verbs...                             │
│  • Add quantifiable achievements...                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ✉️ Cover Letter Generator                              │
│  ────────────────────────────────────────────────────── │
│  [Select Resume ▼] [Select Job from Library ▼]         │
│  OR paste job description:                              │
│  [Textarea for job description]                         │
│  [ Generate Cover Letter ]                              │
│                                                          │
│  Results: [COPY] [SAVE] [DOWNLOAD AS PDF]              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  🎯 Skill Gap Analyzer                                  │
│  ────────────────────────────────────────────────────── │
│  [Your Resume] + [Target Job] = Gap Analysis            │
│  [ Analyze Gap ]                                        │
│                                                          │
│  Results: [SAVE TO LIBRARY]                             │
│  Missing Skills:                                        │
│  • TypeScript → [Learn on Udemy]                       │
│  • Docker → [Free Course]                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  💼 Interview Preparation (Coming Soon)                 │
│  Mock interviews & common questions for your role       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  📚 My AI Content Library                               │
│  View all saved cover letters, resume tips, and more    │
│  [View Library →]                                       │
└─────────────────────────────────────────────────────────┘
```

---

### 4.2 Add Save Functionality

**New Database Table:**

```sql
CREATE TABLE ai_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('resume_tips', 'cover_letter', 'skill_gap', 'interview')),
  content TEXT NOT NULL,
  job_title TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX idx_ai_content_user ON ai_content(user_id, created_at DESC);
```

**New Component:**

- `src/components/ai/AIContentLibrary.jsx`

**Features:**

- View all saved AI content
- Filter by type (cover letters, resume tips, etc.)
- Delete old content
- Re-use saved cover letters for similar jobs

---

## Phase 5: Job Description Library 📚

**Priority:** MEDIUM | **Timeline:** 2-3 days

### 5.1 Create New Page

**Route:** `/jobs` → "Job Library"

**Database Table:**

```sql
CREATE TABLE job_descriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  location TEXT,
  salary_range TEXT,
  saved_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied BOOLEAN DEFAULT FALSE,
  application_id UUID REFERENCES applications(id)
);

CREATE INDEX idx_jobs_user ON job_descriptions(user_id, saved_date DESC);
```

---

### 5.2 Features

**Job Library Page:**

- Save job postings while browsing LinkedIn/Indeed
- Full text search in job descriptions
- Tag jobs by industry, seniority level
- Link to applications: "Applied ✓" or "Not Applied"
- Quick actions:
  - "Generate Cover Letter" → Opens AI Career Coach
  - "Create Application" → Opens Track Applications with pre-filled data

**Chrome Extension (Future):**

- Save jobs directly from LinkedIn/Indeed
- One-click save to Appliquo

---

## Phase 6: User Profile & Settings 👤

**Priority:** MEDIUM | **Timeline:** 2-3 days

### 6.1 Database Schema

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  website TEXT,
  github_url TEXT,
  profile_photo_url TEXT,
  default_resume_id UUID REFERENCES resumes(id),
  email_notifications BOOLEAN DEFAULT TRUE,
  deadline_reminders BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### 6.2 Profile Page Sections

**Personal Information**

- Full name
- Email (from auth, display only)
- Phone
- Location
- LinkedIn URL
- Website
- GitHub profile
- Profile photo upload (stored in Supabase storage)

**Resume Settings**

- Default resume for AI tools
- Resume privacy: Public/Private

**Preferences**

- Theme (Light/Dark/System)
- Email notifications
- Deadline reminders
- Follow-up reminders

**Statistics**

- Total applications: 42
- Response rate: 23.8%
- Average response time: 7 days
- Most successful resume: "Software Engineer Resume v3"
- Applications by status (pie chart)
- Application timeline (line graph)

**Account Management**

- Change password
- Export all data (JSON/CSV)
- Delete account (with confirmation)

**Files:**

- `src/pages/Profile.jsx`
- `src/components/profile/PersonalInfo.jsx`
- `src/components/profile/ResumeSettings.jsx`
- `src/components/profile/Preferences.jsx`
- `src/components/profile/Statistics.jsx`
- `src/components/profile/AccountManagement.jsx`

---

## Phase 7: OAuth Authentication 🔐

**Priority:** HIGH | **Timeline:** 1-2 days

### 7.1 Enable OAuth in Supabase

**Providers to Add:**

1. **Google** (highest priority - most users)
2. **GitHub** (developer audience)
3. **LinkedIn** (ideal for job search app!)

**Supabase Dashboard Setup:**

```
Settings → Authentication → Providers
- Enable Google OAuth
  - Client ID: [from Google Cloud Console]
  - Client Secret: [from Google Cloud Console]
  - Redirect URL: https://your-project.supabase.co/auth/v1/callback

- Enable GitHub OAuth
  - Client ID: [from GitHub OAuth Apps]
  - Client Secret: [from GitHub OAuth Apps]

- Enable LinkedIn OAuth (if available)
```

---

### 7.2 Update Auth Components

**Login.jsx:**

```javascript
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  if (error) {
    setError(error.message);
  }
};

const handleGitHubLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
};

const handleLinkedInLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "linkedin",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
};
```

**UI Layout:**

```
┌──────────────────────────────────────┐
│         Sign in to Appliquo          │
├──────────────────────────────────────┤
│  [🔷 Continue with Google]           │
│  [⚫ Continue with GitHub]           │
│  [🔵 Continue with LinkedIn]         │
├──────────────────────────────────────┤
│      Or continue with email          │
├──────────────────────────────────────┤
│  Email: [________________]           │
│  Password: [________________]        │
│  [ Forgot password? ]                │
│  [        Sign In        ]           │
│                                      │
│  Don't have an account? Sign up      │
└──────────────────────────────────────┘
```

**Files to Edit:**

- `src/components/auth/Login.jsx`
- `src/components/auth/Signup.jsx`

**New Component:**

- `src/components/auth/OAuthButtons.jsx`

---

## Phase 8: Update Hero Section 🎯

**Priority:** MEDIUM | **Timeline:** 1 day

### 8.1 Honest & Compelling Cards

**Current cards oversell features. New cards accurately reflect functionality:**

**Card 1: AI Career Coach** 🤖

```
Icon: <Sparkles>
Title: "AI-Powered Career Assistant"
Description: "Get personalized resume feedback, generate custom cover
letters, and identify skill gaps with our AI-powered career coach."
CTA: "Try AI Coach →"
```

**Card 2: Smart Tracking** 🎯

```
Icon: <Target>
Title: "Smart Application Tracking"
Description: "Organize all your job applications with deadlines,
follow-up reminders, and status tracking. Never miss an opportunity."
CTA: "Start Tracking →"
```

**Card 3: Resume Optimization** 📄

```
Icon: <FileText> or <TrendingUp>
Title: "Resume Quality Analysis"
Description: "Upload and analyze multiple resume versions. Get quality
scores and insights to improve your applications."
CTA: "Upload Resume →"
```

**File to Edit:**

- `src/components/landing/HeroSection.jsx`

---

## Phase 9: Enhanced UX Features ✨

**Priority:** LOW | **Timeline:** Ongoing

### 9.1 Onboarding Flow

**First-time user experience:**

```
┌─────────────────────────────────────────┐
│   Welcome to Appliquo! 👋               │
│   Let's get you set up in 3 steps      │
├─────────────────────────────────────────┤
│  Step 1/3: Upload Your Resume           │
│  [Upload Resume] or [Skip for now]     │
├─────────────────────────────────────────┤
│  Step 2/3: Add Your First Application   │
│  [Add Application] or [Skip]           │
├─────────────────────────────────────────┤
│  Step 3/3: Try Our AI Career Coach      │
│  [Get Resume Feedback] or [Skip]       │
└─────────────────────────────────────────┘
```

**Implementation:**

- Store onboarding state in `user_profiles.onboarding_completed`
- Show modal on first login
- Allow skip at any step
- Track completion

---

### 9.2 Dashboard Widgets

**Top of Dashboard:**

```
┌────────────┬────────────┬────────────┬────────────┐
│  📊 Total  │ ⏳ Pending │ ✅ Offers  │ 📅 Deadlines│
│     42     │     23     │     3      │   5 today   │
└────────────┴────────────┴────────────┴────────────┘

┌─────────────────────────────────────────────────────┐
│  🔔 Action Items                                     │
│  • 3 applications need follow-up today               │
│  • 2 deadlines this week                             │
│  • Resume "Software Engineer v2" has 85% quality    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  📈 Recent Activity                                  │
│  • Applied to Google - Software Engineer (2h ago)    │
│  • Updated status for Amazon (5h ago)                │
│  • Generated cover letter for Meta (1d ago)         │
└─────────────────────────────────────────────────────┘
```

---

### 9.3 Notifications System

**Browser Notifications:**

```javascript
// Request permission
Notification.requestPermission();

// Trigger on:
// 1. Application deadline today
// 2. Follow-up reminder
// 3. Status change (if tracking externally)

const notifyDeadline = (application) => {
  if (Notification.permission === "granted") {
    new Notification("Application Deadline Today!", {
      body: `${application.company} - ${application.role}`,
      icon: "/logo.png",
      tag: `deadline-${application.id}`,
    });
  }
};
```

**In-App Notification Center:**

- Bell icon in navbar
- Red badge with count
- Dropdown showing recent notifications
- Mark as read/unread

**Email Notifications (via Supabase Edge Functions):**

- Daily digest of upcoming deadlines
- Follow-up reminders
- Weekly summary (optional)

---

### 9.4 Export Functionality

**Export to CSV:**

```javascript
const exportToCSV = (applications) => {
  const headers = [
    "Company",
    "Role",
    "Status",
    "Applied Date",
    "Deadline",
    "Location",
    "Salary",
  ];
  const rows = applications.map((app) => [
    app.company,
    app.role,
    app.status,
    app.applied_date,
    app.deadline,
    app.location,
    app.salary_range,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `appliquo-applications-${new Date().toISOString()}.csv`;
  a.click();
};
```

**Files to Create:**

- `src/utils/exportUtils.js`

---

## Phase 10: Mobile & PWA Support 📱

**Priority:** LOW | **Timeline:** 2-3 days

### 10.1 Responsive Design Audit

**Check all pages on:**

- Mobile (320px - 425px)
- Tablet (768px - 1024px)
- Desktop (1440px+)

**Critical pages:**

- Landing page ✓ (already responsive)
- Dashboard - needs mobile optimization
- AI Career Coach - needs mobile layout
- Resume viewer - test PDF on mobile

---

### 10.2 Progressive Web App (PWA)

**Make Appliquo installable:**

**manifest.json:**

```json
{
  "name": "Appliquo - Job Application Tracker",
  "short_name": "Appliquo",
  "description": "Track job applications with AI-powered insights",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#00d4aa",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker:**

- Cache static assets
- Offline fallback page
- Background sync for notifications

**Benefits:**

- Installable on mobile home screen
- Works offline (basic features)
- Push notifications

---

## Testing Checklist ✅

### Critical Functionality

- [ ] Date fields display correctly in applications
- [ ] Resume quality score calculates accurately
- [ ] PDF text extraction works for scoring
- [ ] OAuth login redirects to dashboard
- [ ] OAuth user profile created automatically
- [ ] AI-generated content saves to library
- [ ] Job descriptions save and link to applications
- [ ] User profile updates persist
- [ ] Deadline notifications trigger at correct time
- [ ] Follow-up reminders work
- [ ] Export to CSV includes all fields

### UI/UX

- [ ] All navigation names are clear
- [ ] Hero section cards accurately describe features
- [ ] Mobile layout works on all pages
- [ ] Dark mode works on all new pages
- [ ] Loading states show on all async operations
- [ ] Error messages are user-friendly
- [ ] Success messages confirm actions

### Performance

- [ ] Dashboard loads < 2 seconds with 100+ applications
- [ ] AI responses appear < 5 seconds
- [ ] PDF upload completes < 3 seconds
- [ ] Search and filter are instant
- [ ] No memory leaks on long sessions

### Security

- [ ] Row-level security (RLS) enabled on all tables
- [ ] Users can only access their own data
- [ ] SQL injection vulnerabilities checked
- [ ] XSS vulnerabilities checked
- [ ] API keys stored in environment variables
- [ ] OAuth tokens handled securely

### Accessibility

- [ ] All forms have proper labels
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces important changes
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] Alt text on all images

---

## Deployment Checklist 🚀

### Environment Setup

- [ ] Production Supabase project created
- [ ] Database migrations applied
- [ ] Row-level security (RLS) policies configured
- [ ] Storage buckets created with proper policies
- [ ] OAuth providers configured in production
- [ ] Environment variables set in Vercel/hosting

### Pre-Launch

- [ ] Run full test suite
- [ ] Check Google Lighthouse scores (aim for 90+)
- [ ] Test on multiple devices/browsers
- [ ] Verify analytics integration
- [ ] Test error tracking (Sentry/similar)
- [ ] Create backup of database schema

### Launch

- [ ] Deploy to production
- [ ] Verify all OAuth redirects work
- [ ] Test production database connections
- [ ] Monitor error logs for first 24 hours
- [ ] Check performance metrics

### Post-Launch

- [ ] Set up uptime monitoring
- [ ] Configure backup schedules
- [ ] Document any issues found
- [ ] Collect user feedback
- [ ] Plan next iteration

---

## Future Enhancements 🔮

### Phase 11: Advanced Analytics

- Application success rate by company size
- Resume performance tracking (which resumes get more interviews)
- Industry-specific insights
- Salary trend analysis
- Time-to-hire metrics

### Phase 12: Collaboration Features

- Share resume with mentors for feedback
- Company review/ratings
- Interview experience notes (Glassdoor-style)
- Referral tracking

### Phase 13: Integration Partners

- LinkedIn Auto-import applications
- Indeed API integration
- Glassdoor company data
- Google Calendar sync for interviews
- Email parsing (Gmail/Outlook) to auto-add applications

### Phase 14: Premium Features

- **Free Tier:**
  - 50 applications max
  - 5 AI queries per month
  - 3 resumes
- **Pro Tier ($9.99/month):**
  - Unlimited applications
  - Unlimited AI queries
  - Unlimited resumes
  - Priority support
  - Advanced analytics
  - Export to PDF reports
- **Enterprise:** For career counselors and universities

---

## Success Metrics 📊

Track these KPIs:

### User Engagement

- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Average session duration
- Feature adoption rate (% using AI coach, % uploading resumes)

### Product Metrics

- Average applications per user
- AI query usage
- Cover letter generation rate
- Resume upload completion rate
- OAuth vs email signup ratio

### Performance

- Page load time (aim < 2s)
- API response time (aim < 500ms)
- Error rate (aim < 1%)
- Uptime (aim 99.9%)

### Business Metrics (if monetizing)

- Conversion rate (free → pro)
- Monthly Recurring Revenue (MRR)
- Churn rate
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)

---

## Technical Debt & Maintenance 🔧

### Code Quality

- [ ] Add TypeScript for type safety
- [ ] Implement E2E tests (Playwright/Cypress)
- [ ] Add unit tests for critical business logic
- [ ] Set up CI/CD pipeline
- [ ] Configure code linting (ESLint + Prettier)
- [ ] Add pre-commit hooks (Husky)

### Documentation

- [ ] Create API documentation
- [ ] Document database schema
- [ ] Write component style guide
- [ ] Create user documentation/help center
- [ ] Document deployment process

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (PostHog/Mixpanel)
- [ ] Add performance monitoring (Vercel Analytics)
- [ ] Set up log aggregation
- [ ] Create alerting for critical errors

---

## Resources & Dependencies

### New NPM Packages Needed

```bash
# PDF text extraction
npm install pdf-parse

# Calendar/date utilities
npm install date-fns

# Charts for analytics
npm install recharts

# Notifications
npm install react-toastify

# CSV export
npm install papaparse

# Rich text editor (for notes)
npm install @tiptap/react @tiptap/starter-kit

# Calendar view (future)
npm install react-big-calendar
```

### External Services

- **Supabase** - Backend (current)
- **Google Gemini AI** - AI features (current)
- **Vercel** - Hosting (assumed)
- **Sentry** (optional) - Error tracking
- **PostHog** (optional) - Analytics

### API Keys Required

```env
# Existing
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GEMINI_API_KEY=

# New for OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
```

---

## Timeline Estimate

**Total Implementation Time: 4-6 weeks (1 developer)**

| Phase                 | Priority | Duration | Dependencies |
| --------------------- | -------- | -------- | ------------ |
| 1. Bug Fixes & Rename | HIGH     | 1-2 days | None         |
| 2. Resume Scoring     | HIGH     | 2-3 days | Phase 1      |
| 3. Enhanced Tracking  | HIGH     | 3-4 days | Phase 1      |
| 4. AI Coach           | MEDIUM   | 3-4 days | Phase 3      |
| 5. Job Library        | MEDIUM   | 2-3 days | Phase 3      |
| 6. User Profile       | MEDIUM   | 2-3 days | None         |
| 7. OAuth              | HIGH     | 1-2 days | Phase 6      |
| 8. Hero Section       | MEDIUM   | 1 day    | None         |
| 9. UX Features        | LOW      | Ongoing  | All phases   |
| 10. Mobile/PWA        | LOW      | 2-3 days | All phases   |

**Critical Path:** Phase 1 → 2 → 3 → 7 → Launch

---

## Conclusion

This plan transforms Appliquo from a functional MVP into a production-ready, honest, and genuinely useful job search tool. The key improvements:

1. **Honesty First** - Renamed "ATS Score" to avoid misleading users
2. **Feature Complete** - Added missing critical features (OAuth, profiles, deadlines)
3. **AI-Powered** - Made the powerful Gemini integration the star feature
4. **User-Friendly** - Clear navigation, helpful notifications, mobile support
5. **Scalable** - Proper database schema, organized codebase, ready for growth

The result will be a tool job seekers genuinely want to use.

---

**Next Steps:**

1. Review and approve this plan
2. Set up project management (GitHub Issues/Projects)
3. Begin Phase 1 implementation
4. Ship iteratively - launch after Phase 7

**Questions or changes?** This is a living document - update as needed!
