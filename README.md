# Sehat Saathi (صحت ساتھی)
### AI for Accessible Healthcare in Pakistan · UN SDG 3 (Good Health & Well-Being)
> **Built at Minhaj University AI Hackathon** · Live Multimodal Health Companion

---

## 1. Problem Statement
In Pakistan, millions of patients—particularly elderly individuals, rural residents, and low-literacy citizens—struggle with reading doctor prescriptions, understanding medicine packaging, and interpreting clinical lab reports.
- **The Core Issue:** Medical documentation in Pakistan is predominantly printed in technical English using specialized jargon.
- **The Human Cost:** Misinterpreted dosages, discontinued antibiotic courses leading to antimicrobial resistance (AMR), unnoticed abnormal lab indicators, anxiety, and dangerous delays in seeking emergency treatment.
- **The Vision of Sehat Saathi:** Democratize health literacy through live, multimodal AI that explains medicines, fact-checks medical reports, and answers questions through a compassionate voice-first companion in **اردو (Urdu script)**, **Roman Urdu**, and **English**.

---

## 2. Target Users
1. **Elderly Patients:** Seniors needing high-contrast, large text, big buttons ("Easy Mode"), and audio-first voice interaction.
2. **Low-Literacy & Rural Patients:** Individuals unable to read complex English packaging who can snap a picture or speak into their phone to receive spoken Urdu explanations.
3. **Caregivers & Family Members:** Sons, daughters, and guardians managing chronic ailments (diabetes, hypertension) for elderly parents.
4. **Community Health Workers (LHWs):** Lady Health Workers and rural dispensers looking for a verified, patient-friendly communication tool.

---

## 3. Technology Stack & AI Architecture

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Lucide Icons |
| **AI Foundation** | Google Gemini via official `@google/genai` SDK (`gemini-2.5-flash`) |
| **Validation** | Zod runtime schema enforcement + 2-pass factual document verification |
| **3D Background** | Three.js, `@react-three/fiber`, `@react-three/drei` (DNA helix, floating capsules, particles, reduced-motion fallback) |
| **Audio & Speech** | MediaRecorder API, Server TTS route with Gemini TTS / SpeechSynthesis fallback |
| **Storage & Privacy** | Zero server file retention; client-side localStorage history only (last 5 items) |

---

## 4. How Each Feature Uses Live AI

### Feature 1: Medicine Explainer
- **Multimodal OCR & Safety Verification:** Extracts brand names and active pharmaceutical ingredients (APIs) from photos of medicine strips, boxes, or prescriptions.
- **"Is This Correct?" Confirmation Step:** Lets users review and correct detected names before generating explanations to avoid OCR errors.
- **Structured Schema Guidance:** Gemini produces strictly structured JSON covering generic formula, simple uses, expected benefits, when/how to take, common vs. serious side effects, antibiotic completion notices, and 3 specific questions for the pharmacist.
- **Dose Hallucination Prevention:** The system prompt explicitly forbids hallucinating personal dosages; it instructs patients to adhere to the exact dose written on their packaging or prescription.

### Feature 2: Medical Report Explainer (2-Pass Factual Verification)
- **Document Input:** Accepts lab report images or multi-page PDFs (CBC, Liver Function Tests, Lipid Profile, HbA1c, Renal Profile).
- **Pass 1 (Extraction):** Strictly extracts values and printed reference ranges. If a test has no printed reference range, it is marked as `range not provided`. If any value is blurry or smudged, it is marked `not clearly readable` rather than guessed.
- **Pass 2 (Verification Pass):** A second server-side Gemini verification prompt compares the extracted JSON against the document data to eliminate hallucinated numbers and ensures zero diagnostic assertions (e.g., changing "You have diabetes" into "This glucose value is above the printed range, which doctors evaluate").
- **Visual Presentation:** A color-coded results table (with accessible icons for high, low, normal, range not provided, and unclear), plain-language summaries, questions for the doctor, and emergency triage warnings.

### Feature 3: Voice AI Assistant ("Sehat Dost")
- **Voice-First Design:** Features a prominent microphone button tailored for illiterate or elderly users. Records audio via `MediaRecorder` and passes it directly to Gemini's multimodal audio input (with Web Speech API fallback).
- **Real-Time Streaming:** Streams response tokens over Server-Sent Events (SSE) for fast answers.
- **Context Awareness:** Automatically receives the context of the user's latest analyzed medicine or lab report.
- **Emergency Triage (Rescue 1122):** Detects red-flag emergency symptoms (chest pain, stroke signs, severe bleeding, breathing distress) and immediately instructs the user to dial Rescue 1122 or visit an emergency room.
- **Prompt-Injection Defense:** Treats all text inside user images/PDFs strictly as data to explain, never as instructions to execute.

---

## 5. Startup & Business Model

Sehat Saathi is designed with a sustainable dual-engine business model aligned with UN SDG 3:

```
                  ┌──────────────────────────────────────────────┐
                  │                 SEHAT SAATHI                 │
                  └──────────────────────┬───────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
      ┌─────────────────────┐                         ┌─────────────────────┐
      │   B2C Patient Tier  │                         │ B2B & Public Health │
      └──────────┬──────────┘                         └──────────┬──────────┘
                 │                                               │
     ┌───────────┴───────────┐                       ┌───────────┴───────────┐
     ▼                       ▼                       ▼                       ▼
  Freemium               Premium Family            SaaS API               NGO & Govt
  (5 free scans/mo)      (Rs. 450/month)          (Labs, Clinics,       (BISP, Sehat Sahulat,
                          Unlimited voice & TTS   Pharmacies)            Lady Health Workers)
```

1. **B2C Freemium for Patients:**
   - **Free Tier:** 5 free medicine/report explanations per month with standard audio.
   - **Sehat Saathi Plus (Rs. 450/month):** Unlimited scans, offline audio downloads, and multi-profile family health management.
2. **B2B Subscriptions for Diagnostics & Pharmacies:**
   - **Diagnostic Labs (Chughtai, IDC, Shaukat Khanum, Essa):** White-label QR code on lab reports. Patients scan their report QR code to instantly see an accessible, audio-guided explanation in Urdu.
   - **Retail Pharmacy Chains (Servaid, Fazal Din, D.Watson):** Pharmacy counter tablet mode assisting dispensers in explaining dosage schedules to patients.
3. **NGO & Health Program Partnerships:**
   - Sponsored enterprise licenses funded by international development agencies (WHO, UNICEF, Gates Foundation) and provincial health initiatives to empower Lady Health Workers (LHWs) in rural districts.

---

## 6. Safety Limits & Clinical Disclaimers
- **Educational Tool Only:** Sehat Saathi is not a diagnostic device and does not prescribe medication or alter dosages.
- **Persistent Safety Banner:** Displayed continuously across all viewports in Urdu, Roman Urdu, and English.
- **No Data Retention:** Files uploaded by patients are processed in-memory and immediately discarded; zero medical records or images are saved on the server.
- **Local Rate Limiting & Timeouts:** 30-second execution caps and sliding-window IP rate limiters prevent DDoS and server overload.

---

## 7. Local Setup & Installation

### Prerequisites
- Node.js 18.x or 20.x+
- A Google Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/))

### Installation Steps

1. Clone or navigate to the project directory:
   ```bash
   cd sehat-saathi
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

---

## 8. Deployment to Vercel

1. Push your repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com/).
3. In the project settings, configure the Environment Variables:
   - `GEMINI_API_KEY`: Your live Google Gemini API key.
   - `GEMINI_MODEL`: `gemini-2.5-flash`.
4. Deploy. The Next.js Route Handlers run seamlessly on Vercel Serverless Functions.

---

*Built with dedication at Minhaj University AI Hackathon for UN SDG 3: Good Health & Well-Being.*
