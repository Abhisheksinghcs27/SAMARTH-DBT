# SAMARTH: Unified DBT Platform for PCR & PoA Acts

SAMARTH is a high-tech, end-to-end digital ecosystem designed to revolutionize the implementation of Direct Benefit Transfer (DBT) under the **Protection of Civil Rights (PCR) Act, 1955** and the **Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989**.

## 🚀 The Challenge
Historically, the disbursement of monetary relief to victims of atrocities and incentives for inter-caste marriages has been manual, time-consuming, and prone to procedural delays. SAMARTH addresses these challenges by replacing manual verification with an automated, AI-driven, and transparent system.

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

## 🛠 Tech Stack
- **Frontend:** React 19 (Hooks, Context), Tailwind CSS (Aesthetic UI/UX).
- **AI Engine:** Google Gemini API (`@google/genai`).
- **Analytics:** Recharts (Data visualization).
- **Icons & Typography:** FontAwesome 6, Inter Font.
- **Database Simulation:** Mock APIs for Aadhaar, CCTNS, and PFMS integration.

## 📁 Project Structure
```text
├── components/
│   ├── AILegalAssistant.tsx      # Gemini-powered Chatbot
│   ├── ApplicationForm.tsx       # Dynamic Claim Filing
│   ├── GrievanceRedressal.tsx    # Support Ticket System
│   ├── Navigation.tsx            # Context-aware Nav
│   ├── OfficialDashboard.tsx     # Admin Analytics
│   ├── VictimDashboard.tsx       # Beneficiary Home
│   └── ...                       # UI Helpers
├── services/
│   ├── geminiService.ts          # AI Integration Logic
│   └── mockApi.ts                # National Database Simulations
├── types.ts                      # Global TypeScript Definitions
├── App.tsx                       # Main Application Shell
└── index.html                    # Entry Point
```

## 🛡 Security & Privacy
- **Accurate Identification:** Multi-factor verification via Aadhaar and CCTNS.
- **Privacy First:** Designed with data isolation and secure identity masking for sensitive victim data.
- **Transparency:** Immutable record of fund disbursement to prevent misallocation.

## 🌍 Impact
SAMARTH strengthens public trust in the enforcement framework by ensuring that justice is not just promised, but delivered efficiently. It contributes to a more inclusive, technology-driven welfare delivery system that upholds the dignity of historically marginalized communities.

---
*Developed as a prototype for the effective management of DBT under the PCR/PoA Scheme.*