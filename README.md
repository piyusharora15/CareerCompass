# 🚀 CareerCompass | AI-Driven Skill Gap Analysis & Roadmap Engine

[![Live Demo](https://img.shields.io/badge/Demo-Live_Now-emerald?style=for-the-badge&logo=vercel)](https://careercompass-dev.vercel.app/)
[![GitHub License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://github.com/piyusharora15/CareerCompass/blob/main/LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-emerald.svg?style=for-the-badge)](https://github.com/piyusharora15/CareerCompass/graphs/commit-activity)

### 🔗 [Explore the Live Application →](https://careercompass-dev.vercel.app/)

CareerCompass is a high-performance Full-Stack (MERN) platform engineered to navigate the 2026 technical landscape. By leveraging **Gemini 3 Flash LLM**, the platform transforms static user profiles into dynamic, data-driven career growth strategies through semantic gap analysis.

---

## 📽️ Video Walkthrough
*Watch how CareerCompass architects a personalized learning path in under 60 seconds.*

[![Watch the Demo](https://cdn.loom.com/sessions/thumbnails/ed7f7f46a5e148c5b67b80de01308693-00001.jpg)](https://www.loom.com/share/ed7f7f46a5e148c5b67b80de01308693)

---

## 📌 The Problem
The primary challenge for modern developers isn't the lack of resources, but the **lack of direction**.
* **Skill Decay:** Technical skills have a shrinking half-life; 2024 standards are legacy by 2026.
* **Analysis Paralysis:** Vague job descriptions don't translate into structured learning.
* **Non-Persistent Learning:** Most tools are static; users lose progress across sessions.

## 💡 The Solution
CareerCompass acts as a persistent **"Personal Engineering Manager"**:
1. **Delta Analysis:** Identifies the specific "delta" between your current profile and 2026 market standards.
2. **Skill Architect:** Generates hierarchical roadmaps with vetted documentation (MDN, Official Docs).
3. **State Synchronization:** Persists progress to a cloud database for long-term goal tracking.

---

## ✨ Key Features & Example Outputs

### 🧠 AI-Powered Skill Architect
The heart of the app is a custom orchestration layer that uses **Gemini 3 Flash** in strict `JSON Mode`. 

**Example AI Output (Structured Analysis):**
```json
{
  "skill_coverage": 65,
  "critical_gaps": ["Redis Caching", "Kafka Event-Driven Architecture", "Dockerization"],
  "priority_roadmap": [
    {
      "step": 1,
      "topic": "Redis Fundamentals",
      "resource": "[https://redis.io/docs/](https://redis.io/docs/)",
      "complexity": "Intermediate"
    }
  ]
}
```

🔄 Real-Time State Persistence
Optimistic UI: Check off milestones with zero-latency.

Sync Engine: Asynchronous background updates ensure your progress is saved to MongoDB Atlas without page reloads.

---

## 🏗️ System Design & Architecture Decisions

### Technical Sequence Diagram
The following diagram illustrates the lifecycle of a user request—from OAuth authentication to AI-driven roadmap generation and persistent milestone tracking.

![CareerCompass Technical Sequence Diagram](./client/src/assets/SequenceDiagram.png)

### 1. Decoupled MERN Architecture
The system is built on a decoupled architecture to ensure clear separation of concerns. The **Express.js** backend acts as a strict API gateway, while the **React** frontend manages complex UI states and asynchronous data fetching.

### 2. Semantic Gap Analysis (LLM Integration)
Instead of simple keyword matching, I utilized **Gemini 3 Flash** with specific "System Instructions" to perform semantic analysis.
* **Decision:** Used `JSON Mode` for AI responses.
* **Reasoning:** Conversational AI is unreliable for UI rendering. Forcing a schema ensures the frontend can reliably map data to Radar Charts and Roadmap nodes without parsing errors.

### 3. State Sync & Persistence Layer

* **Decision:** Implemented a dual-persistence strategy for the Skill Architect.
* **Reasoning:** The roadmap structure is saved to the `Roadmap` collection, while user-specific interactions (toggles/completions) are stored in a `Progress` array. This allows the roadmap to be "reconstructed" perfectly upon page refresh or across different devices.

### 4. Efficient Authentication Flow
* **Decision:** Integrated **Passport.js** for Google OAuth 2.0 coupled with **JWT** for session handling.
* **Reasoning:** OAuth provides a frictionless onboarding experience, while JWTs allow for stateless, secure API requests, reducing server-side session overhead.

---

## 🚀 How It Works: The Pipeline

### Phase 1: Knowledge Profiling
The user undergoes a targeted onboarding flow. This data is structured into a `CareerProfile` schema in MongoDB, acting as the "source of truth" for all subsequent AI calls.

### Phase 2: The Analysis Engine
When a user requests insights, the backend constructs a multi-turn prompt containing:
1. Current Skills
2. Target Role
3. Current Year (2026)
The engine calculates the "Skill Coverage" percentage and identifies the 5-7 most critical technologies the user is missing.

### Phase 3: Dynamic Roadmap Orchestration
The **Skill Architect** consumes the "missing skills" list. It doesn't just list them; it organizes them into a logical sequence (e.g., learning "System Design" after "Backend Fundamentals"). Each node is enriched with:
* **Difficulty Level:** Quantified based on user profile.
* **Vetted Resources:** Programmatic search for MDN/Official documentation links.

### Phase 4: Interactive Milestone Tracking
The frontend renders an interactive timeline using **Framer Motion**. Every time a user completes a milestone:
1. An optimistic UI update occurs.
2. An asynchronous `POST` request is sent to `/api/roadmap/toggle-complete`.
3. The global `Progress Bar` recalculates based on the updated DB state.

---
## 🔧 Technical Challenges & Solutions
* **LLM Non-Determinism:** Enforced strict JSON schemas in prompts to prevent frontend crashes from unstructured AI text.
* **OAuth Proxy Issues:** Configured trust proxy in Express and proxy: true in Passport to handle Render's HTTPS reverse proxy.
* **CORS Mismatches:** Implemented a dynamic origin whitelist to allow secure communication between Vercel and Render.

---

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS, Framer Motion, Recharts
* **Backend:** Node.js, Express.js, MongoDB/Mongoose
* **Intelligence:** Google Gemini 3 Flash API (JSON Mode)
* **Security:** JWT, Google OAuth 2.0 (Passport.js)

---

---

## 📸 Project Preview

| Feature | Visual Representation |
| :--- | :--- |
| **Interactive Dashboard** | ![Dashboard Screenshot](./client/src/assets/Dashboard_Screenshot.png) |
| **Skill Architect Roadmap** | ![Roadmap Screenshot](./client/src/assets/Roadmap_Screenshot.png) |

---

## ⚙️ Setup & Installation

### 1. Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas Account
* Google Cloud Console Project (for OAuth)
* Google AI Studio API Key (Gemini)

### 2. Installation Steps

```bash
# Clone the repository
git clone [https://github.com/piyusharora15/career-compass.git](https://github.com/piyusharora15/career-compass.git)

# Navigate to the project directory
cd career-compass

# Setup Server: Install dependencies and start
cd server
npm install
npm start

# Setup Client: In a new terminal, install dependencies and start
cd ../client
npm install
npm run dev

```

🔗 Profile & Contact:
Feel free to reach out for collaborations, technical discussions, or just to say hi!

LinkedIn: https://www.linkedin.com/in/piyush-arora1504/

GitHub: https://github.com/piyusharora15

Twitter: https://x.com/piyusharora_15
