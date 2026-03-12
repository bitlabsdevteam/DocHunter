# AI Agentic Healthcare Locator – Product Requirement Document (PRD)

## 1. Project Overview

Product Name: AI Healthcare Locator Agent
Product Type: AI Agentic Web Application
Primary Region: Japan
Primary Language: English
Secondary Language: Japanese

The system provides an AI agent interface on a website that allows users to describe medical symptoms.
The AI agent analyzes the symptoms, determines urgency level, identifies the nearest available hospital or clinic, and assists the user in booking an appointment.

After the booking is completed, the system sends a confirmation email to the user.

The system must integrate with Perplexity search APIs and Japanese healthcare directories to retrieve clinic information and availability signals.

The application is designed as a lightweight AI agentic web platform optimized for fast interaction and minimal onboarding.

## 2. Objectives

Build an AI agent capable of:
1. Understanding user medical symptoms via chat.
2. Determining healthcare urgency.
3. Locating the nearest available clinic or hospital in Japan.
4. Searching healthcare providers using Perplexity API.
5. Checking availability indicators in real time.
6. Booking an appointment.
7. Sending confirmation to the user via email.
8. Supporting English and Japanese localization.

## 3. Core User Flow

### Step 1 – User Onboarding
User opens the website.
Minimal onboarding required.
Required: Email address
Optional: Name, Phone
User consent must be collected for:
- Location usage
- Health-related information processing
User onboarding data will be stored securely in Supabase.

### Step 2 – Location Detection
Priority order:
1. Browser geolocation API
2. IP-based geolocation
3. Manual location input

Location precision target:
- within 1–5 km radius

Returned location data:
- latitude
- longitude
- city
- postal_code

### Step 3 – Symptom Input
The AI agent must extract:
- symptoms
- severity
- possible medical specialty

Example mapping:
- fever → general medicine
- stomach pain → gastroenterology
- broken bone → orthopedics
- chest pain → emergency hospital

### Step 4 – Clinic Discovery
The agent searches healthcare providers using Perplexity API.
The agent parses results to extract:
- clinic name
- address
- distance
- specialty
- contact information
- possible availability indicators

Results are ranked based on:
1. availability
2. distance
3. specialty match
4. clinic reliability

### Step 5 – Appointment Booking
User selects preferred clinic.
Agent initiates booking workflow.

### Step 6 – Confirmation
After booking is successful, the system sends a confirmation email containing:
- clinic name
- clinic address
- Google Maps link
- appointment time
- booking reference

## 4. System Architecture
High-level architecture to be designed.

## 5. Technology Stack
### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

Required UI features:
- chatbot interface
- streaming responses
- clinic recommendation cards
- mobile responsiveness
- language toggle

### Backend
- Node.js
- TypeScript
- Express or Fastify

Responsibilities:
- agent orchestration
- API integrations
- booking workflows
- email notification

### Database
Use Supabase for:
- PostgreSQL database
- Authentication
- Row Level Security
- Edge Functions

## 6. Deployment
### Option 1 – Vercel
Frontend on Vercel, backend via serverless functions.

### Option 2 – AWS
- ECS / EC2
- API Gateway
- Lambda
- SES

## 7. AI Agent Design
The system uses an AI agent with tool-calling capability.
Agent responsibilities:
- symptom analysis
- location reasoning
- clinic discovery
- ranking recommendations
- appointment workflow
- email confirmation

## 8. Agent Tools
### Tool 1 – Location Tool
Purpose: determine user location.

### Tool 2 – Clinic Search Tool (Perplexity)
Purpose: search nearby clinics and hospitals.

## 11. Localization Requirements
Support:
- English
- Japanese

Coverage:
- UI: EN / JP
- Chat: EN / JP
- Email confirmation: EN / JP

## 12. Security & Compliance
Required protections:
- HTTPS
- encrypted user data
- secure API keys
- rate limiting

Healthcare considerations:
- avoid long-term storage of symptom data
- anonymize logs where possible

## 13. AI Safety
The AI agent must not provide medical diagnosis.

This is a brief PRD. Yuri should think like an AI CTO at OpenAI to design the solution.
