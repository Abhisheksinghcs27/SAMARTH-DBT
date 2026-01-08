# SAMARTH: Unified DBT Platform for PCR & PoA Acts

SAMARTH is a high-tech, end-to-end digital ecosystem designed to revolutionize the implementation of Direct Benefit Transfer (DBT) under the **Protection of Civil Rights (PCR) Act, 1955** and the **Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989**.

## 🚀 The Challenge
Historically, the disbursement of monetary relief to victims of atrocities and incentives for inter-caste marriages has been manual, time-consuming, and prone to procedural delays. SAMARTH addresses these challenges by replacing manual verification with an automated, AI-driven, and transparent system.

## 🛠 Installation & Setup

Follow these steps to get the SAMARTH platform running on your local machine.

### Prerequisites
- **Node.js**: Version 18.x or higher.
- **Google Gemini API Key**: You will need an API key to power the "Justice Aide" and automated verification features. Get one at [ai.google.dev](https://ai.google.dev/).

### 1. Clone the Repository
```bash
git clone https://github.com/Abhisheksinghcs27/SAMARTH-DBT.git
cd SAMARTH-DBT
```

### 2. Install Dependencies
This project uses modern ESM imports. If you are running this in a standard development environment:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your Gemini API Key:
```env
API_KEY=your_gemini_api_key_here
```

### 4. Run the Application
Start the development server:
```bash
npm run dev
# OR if using a simple static server with JSX support:
npx vite
```
The application will be available at `http://localhost:5173`.

---

## 📖 User Guide

### Accessing the Portal
- **Victim Access (Default):** Use this to file new claims, chat with the Justice Aide, and track active applications.
- **Official Portal:** Switch roles using the toggle in the navigation bar to access the Administrative Command Center.

### Key Workflows
1. **Lodge a Claim:** Navigate to the 'Apply' tab, fill in the incident details (including FIR number), and provide bank details.
2. **AI Scrutiny:** Once a claim is filed, officials can run the "Execute Global Check" which triggers a multi-agency verification (Aadhaar, CCTNS, and AI Semantic Analysis).
3. **Disbursement:** After verification, the official 'Authorizes Payment', which simulates a PFMS gateway transfer.
4. **Grievance:** If a payment is delayed, use the 'Support' tab to create a ticket.

---

## ✨ Key Features

### 1. Dual-Role Specialized Dashboards
- **Victim Portal:** A compassionate, easy-to-use interface for beneficiaries to lodge claims, track their case journey in real-time, and access emergency helplines.
- **Official Portal:** A comprehensive "National Command Center" for administrators to monitor district-wide trends, process verification queues, and manage fund allocation via analytical heatmaps and charts.

### 2. AI-Powered "Justice Aide" Assistant
- An integrated legal assistant powered by **Google Gemini API**.
- Provides instant, context-aware guidance on legal rights, eligibility criteria, and documentation requirements.
- Trained specifically on the provisions of the PCR and PoA Acts to assist marginalized communities.

### 3. Multi-Agency Verification Engine
Automates the verification flow by simulating integration with national databases:
- **UIDAI (Aadhaar):** Instant identity verification.
- **CCTNS (Crime and Criminal Tracking Network Systems):** Automated FIR record retrieval.
- **AI Semantic Matching:** Uses Gemini to compare victim statements against FIR narratives to ensure consistency and prevent fraud.
- **PFMS (Public Financial Management System):** Seamless bank linkage and real-time fund transfer tracking.

### 4. Real-Time Case Tracking
- Visual stepper-based tracking for beneficiaries (Applied → Verified → Sanctioned → Settled).
- Transparent audit logs for every transaction.

### 5. Grievance Redressal Module
- Dedicated ticketing system for beneficiaries to report delays or technical issues.
- Direct linkage to nodal officers with a simulated 48-hour resolution window.

## 📁 Project Structure
```text
├── src/
│   ├── components/
│   │   ├── AILegalAssistant.tsx      # Gemini-powered Chatbot
│   │   ├── ApplicationForm.tsx       # Dynamic Claim Filing
│   │   ├── GrievanceRedressal.tsx    # Support & Ticketing System
│   │   ├── Login.tsx                 # Authentication Component
│   │   ├── Navigation.tsx            # Main Navigation Bar
│   │   ├── OfficerVerificationView.tsx # Verification Interface
│   │   ├── OfficialDashboard.tsx     # Admin Analytics (with AI Scrutiny Insights)
│   │   ├── StatsCards.tsx            # Dashboard Statistics Cards
│   │   ├── VerificationStepper.tsx   # Case Status Tracker
│   │   └── VictimDashboard.tsx       # Beneficiary Home
│   └── services/
│       ├── geminiService.ts          # AI Integration Logic (Verification & Guidance)
│       └── mockApi.ts                # National Database Simulations
├── types.ts                          # Global TypeScript Definitions
├── App.tsx                           # Main Application Shell
├── index.tsx                         # React Entry Point
├── index.html                        # HTML Entry Point with Tailwind & ESM config
├── index.css                         # Global Styles
├── vite.config.ts                    # Vite Configuration
└── package.json                      # Dependencies & Scripts
```

## 🛡 Security & Privacy
- **Accurate Identification:** Multi-factor verification via Aadhaar and CCTNS.
- **Privacy First:** Designed with data isolation and secure identity masking for sensitive victim data.
- **Transparency:** Immutable record of fund disbursement to prevent misallocation.

---
*Developed as a prototype for the effective management of DBT under the PCR/PoA Scheme.*
