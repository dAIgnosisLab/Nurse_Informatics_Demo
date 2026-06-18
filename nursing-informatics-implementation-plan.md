# Nursing Informatics System — Implementation Plan

Stack: **Next.js (full-stack, App Router)** + **PostgreSQL** + **Prisma**
No authentication/login in this build. No real-time monitoring — structured forms and dashboards only.

Work through the steps below **in order**. Each step should be a separate commit/PR-sized chunk. Do not skip ahead to a UI step before its underlying schema/API step is done.

---

## Step 0 — Project Setup

1. Scaffold a new Next.js app with TypeScript, App Router, Tailwind CSS enabled.
2. Install dependencies: `prisma`, `@prisma/client`, `zod` (form validation), `date-fns` (timestamps), `react-hook-form`.
3. Initialize Prisma with PostgreSQL as the provider.
4. Set up `.env` with `DATABASE_URL` placeholder.
5. Create base folder structure:
   - `app/` — routes/screens
   - `app/api/` — API route handlers
   - `lib/prisma.ts` — Prisma client singleton
   - `lib/validation/` — zod schemas per form
   - `components/` — shared UI (forms, cards, nav)
   - `components/forms/` — one component per clinical form
   - `prisma/schema.prisma` — DB schema
6. Add a persistent top nav component with a "Switch Department" control (links to `/er`, `/ipd`, `/icu`) and a placeholder "Nurse Dashboard" link to `/`.

**Done when:** app boots locally, Prisma connects to Postgres, nav renders on every page.

---

## Step 1 — Database Schema (Prisma)

Define all models needed to support every form in the flow. Build this in one `schema.prisma` pass, then run `prisma migrate dev`.

### Core models

- **Patient**
  - id, name, age, sex, department (enum: ER / IPD / ICU), status (enum: Waiting / UnderTreatment / Admitted / Transferred / Discharged), diagnosis, bedNumber, ward, ipNumber, dateOfAdmission, createdAt, updatedAt
  - relation to all form tables below (one-to-many where forms can repeat, one-to-one where a form is filled once)

- **ErIntake** (one-to-one with Patient) — broughtBy, relation, arrivalDateTime
- **Triage** (one-to-one) — triageCode (enum Red/Yellow/Green), assignedAt
- **ErVitals** (one-to-one) — temperature, pulse, respiration, bp, spo2, gcs
- **Examination** (one-to-one) — airway, breathing, circulation, pupils, abdomen (each: status enum Normal/Abnormal + notes)
- **ClinicalDetails** (one-to-one) — chiefComplaints, pastHistory, drugAllergyHistory, personalHistory
- **Investigation** (one-to-many) — type (enum CBC/RBS/ECG/Xray/Other), status (enum Ordered/Pending/Completed), notes
- **ProvisionalDiagnosis** (one-to-one) — diagnosisText

- **GeneralCondition** (one-to-one) — consciousness enum, gcsScore, painLevel, orientation (time/place/person booleans)
- **VitalSign** (one-to-many, timestamped log) — temperature, pulse, respiration, bp, spo2, recordedAt, nurseName
- **IntakeOutput** (one-to-many, timestamped log) — type (enum Intake/Output), subtype (OralFluid/IVFluid/TubeFeeding/Urine/Vomit/Stool/Drainage), quantity, recordedAt
- **ActivityLog** (one-to-many) — activityType (BedRest/Sitting/Walking/AssistedMovement), recordedAt
- **Medication** (one-to-many) — drugName, dose, route, timeScheduled, timeGiven, nurseSignature
- **TreatmentCardex** (one-to-many, dated entries) — doctorOrders, medicationsPrescribed, proceduresToDo, ivFluidsInstructions, specialInstructions, nurseInitials, date
- **IvFluid** (one-to-many) — fluidType, rate, startTime, endTime, volumeInfused
- **BloodTransfusion** (one-to-many) — bloodGroup, unitNumber, startTime, endTime, reactionNotes
- **DietChart** (one-to-one, editable) — dietType, restrictions, feedingMethod
- **NursingNote** (one-to-many, timestamped) — shift, observations, interventions, patientResponse, nurseName
- **ProcedureRecord** (one-to-many) — procedureName, dateTime, performedBy, remarks
- **PreOpChecklist** (one-to-one, optional) — consentTaken (bool), fastingStatus, investigationsCompleted (bool)
- **DischargeSummary** (one-to-one) — finalDiagnosis, treatmentSummary, medicationsAtDischarge, advice, conditionAtDischarge

- **VentilatorSupport** (one-to-one, ICU only) — inUse (bool), mode, settings
- **OxygenTherapy** (one-to-one, ICU only) — flowRate, deliveryMethod
- **EcgMonitoring** (one-to-one, ICU only) — inUse (bool), notes
- **CriticalObservation** (one-to-many, ICU only) — suddenChanges, emergencyInterventions, recordedAt, nurseName

- **TransferRecord** (one-to-many) — fromDepartment, toDepartment, transferredAt, notes

### Notes
- Use enums in Prisma for all status/category fields listed above.
- All "form completion status" logic on dashboards is **derived** (check if a related record exists) — do not store a separate "isComplete" flag unless it simplifies a query meaningfully.
- Add indexes on `Patient.department` and `Patient.status` since dashboards filter on these constantly.

**Done when:** `prisma migrate dev` runs clean and `prisma studio` shows all tables correctly related to `Patient`.

---

## Step 2 — Seed Data

Create `prisma/seed.ts` with a handful of fake patients pre-populated across all three departments, in different states (one mid-ER-flow, one fully admitted in IPD with several forms filled, one in ICU with ventilator data) so every dashboard has something to show without manual data entry during a demo.

**Done when:** `prisma db seed` populates a realistic demo dataset.

---

## Step 3 — API Routes

Build REST-style API routes under `app/api/`. Group by resource. Each form gets a GET (fetch existing data for a patient) and POST/PUT (create or update).

1. `app/api/patients/route.ts` — GET (list, filterable by `?department=`), POST (create patient)
2. `app/api/patients/[id]/route.ts` — GET (single patient with all related data joined), PATCH (update core fields), DELETE (optional)
3. `app/api/patients/[id]/transfer/route.ts` — POST: takes `toDepartment`, updates `Patient.department`/`status`, creates a `TransferRecord`
4. One route file per form, nested under `app/api/patients/[id]/<form-name>/route.ts`:
   - `er-intake`, `triage`, `er-vitals`, `examination`, `clinical-details`, `investigations`, `provisional-diagnosis`
   - `general-condition`, `vitals` (log, supports POST to append + GET history), `intake-output` (log), `activity` (log), `medications` (log), `treatment-cardex` (log), `iv-fluids` (log), `blood-transfusion` (log), `diet-chart`, `nursing-notes` (log), `procedures` (log), `pre-op-checklist`, `discharge-summary`
   - `ventilator`, `oxygen-therapy`, `ecg-monitoring`, `critical-observations` (log)
5. Validate every POST/PATCH body with the matching zod schema from `lib/validation/`.

**Done when:** every route can be hit via curl/Postman against seeded data and returns/saves correctly.

---

## Step 4 — Shared Components

Build these before screens, since every screen reuses them:

1. `components/PatientCard.tsx` — used in dashboard lists (name, age/sex, key status, diagnosis, click-through)
2. `components/FormCompletionList.tsx` — renders the list of forms with Filled/Pending tags, used on Patient Dashboard
3. `components/VitalsBadge.tsx` — small inline component to show latest vitals, highlights abnormal values in red
4. `components/AlertBanner.tsx` — shows missing-data / abnormal-value alerts
5. `components/forms/FormShell.tsx` — wrapper for all form screens: title, save button, "back to dashboard" behavior, loading/error states
6. `components/LogTable.tsx` — generic timestamped log table+add-entry pattern, reused by Vitals, I/O, Medications, IV Fluids, Blood Transfusion, Nursing Notes, Procedures, Critical Observations, Treatment Cardex

**Done when:** these are built in isolation (e.g. a quick storybook-style test page) and ready to drop into routes.

---

## Step 5 — Screens / Routes (build in this exact order)

### 5.1 Landing
- `app/page.tsx` — Department Selection screen: three cards (ER/IPD/ICU) linking to `/er`, `/ipd`, `/icu`.

### 5.2 ER Module
- `app/er/page.tsx` — ER Dashboard / Triage Queue. List sorted by triage color, "+ New Patient" button, row click → `/er/[patientId]`.
- `app/er/new/page.tsx` — New Patient Intake form. On submit, POST patient + er-intake, redirect to `/er/[id]/triage`.
- `app/er/[id]/triage/page.tsx` — Triage Assignment screen. On submit → `/er/[id]/vitals`.
- `app/er/[id]/vitals/page.tsx` — Initial Vitals form. On submit → `/er/[id]/examination`.
- `app/er/[id]/examination/page.tsx` — Examination form. On submit → `/er/[id]/clinical-details`.
- `app/er/[id]/clinical-details/page.tsx` — Clinical Details form. On submit → `/er/[id]/investigations`.
- `app/er/[id]/investigations/page.tsx` — Investigations checklist. On submit → `/er/[id]/diagnosis`.
- `app/er/[id]/diagnosis/page.tsx` — Provisional Diagnosis form. On submit → `/er/[id]` (summary).
- `app/er/[id]/page.tsx` — ER Patient Summary screen. Read view of all sections above with edit links back into each step. Contains "Transfer Patient" and "Discharge from ER" actions.
- `app/er/[id]/transfer/page.tsx` — Transfer screen: select destination department (+ optional bed/ward), confirm. Calls transfer API, redirects to `/er`.

### 5.3 IPD Module
- `app/ipd/page.tsx` — IPD Dashboard / Patient List. "+ Admit Patient" button, row click → `/ipd/[id]`.
- `app/ipd/new/page.tsx` — Admit Patient form (direct admissions only). On submit → `/ipd/[id]`.
- `app/ipd/[id]/page.tsx` — **Patient Dashboard (hub screen)**. Shows overview, latest vitals, form completion list, medication summary, I/O summary, latest nursing note, alerts. Every item links to its form route below. This is also the screen a patient lands on after ER transfer.
- `app/ipd/[id]/general-condition/page.tsx`
- `app/ipd/[id]/vitals/page.tsx` — log + add-entry pattern (uses LogTable)
- `app/ipd/[id]/intake-output/page.tsx` — log
- `app/ipd/[id]/activity/page.tsx` — log
- `app/ipd/[id]/medications/page.tsx` — log
- `app/ipd/[id]/treatment-cardex/page.tsx` — log
- `app/ipd/[id]/iv-fluids/page.tsx` — log
- `app/ipd/[id]/blood-transfusion/page.tsx` — log
- `app/ipd/[id]/diet-chart/page.tsx` — single editable form
- `app/ipd/[id]/nursing-notes/page.tsx` — log
- `app/ipd/[id]/procedures/page.tsx` — log
- `app/ipd/[id]/pre-op-checklist/page.tsx` — conditional form
- `app/ipd/[id]/discharge-summary/page.tsx` — terminal form; on submit, marks patient Discharged and redirects to `/ipd`
- `app/ipd/[id]/transfer/page.tsx` — same Transfer pattern as ER, destination can be ICU

All form pages above: submit returns user to `app/ipd/[id]/page.tsx` (the Patient Dashboard), per the "hub" pattern — no fixed order required.

### 5.4 ICU Module
- `app/icu/page.tsx` — ICU Dashboard / Patient List (same as IPD list, plus ventilator/critical badges on cards).
- `app/icu/new/page.tsx` — Admit to ICU form.
- `app/icu/[id]/page.tsx` — Patient Dashboard (ICU). Same hub as IPD's, plus Ventilator/Oxygen/ECG sections and a prominent Critical Notes block at top. Links to all IPD form routes (reuse `app/ipd/[id]/<form>` logic via shared components, or mirror routes under `app/icu/[id]/<form>` — pick one pattern and keep it consistent) **plus**:
- `app/icu/[id]/ventilator/page.tsx`
- `app/icu/[id]/oxygen-therapy/page.tsx`
- `app/icu/[id]/ecg-monitoring/page.tsx`
- `app/icu/[id]/critical-observations/page.tsx` — log, styled as a chronological feed
- `app/icu/[id]/transfer/page.tsx` — Transfer pattern, destination can be IPD

### 5.5 Cross-Cutting
- Update `app/page.tsx` (or add `app/dashboard/page.tsx`) to optionally double as the **Nurse Dashboard**: aggregated list of patients across all departments, pending forms, recently updated records. Build this last since it depends on every other piece existing.

**Done when:** every route in the flow doc exists, every "Save" action persists to Postgres via the Step 3 APIs, and every "back to dashboard" link correctly returns to the right hub screen.

---

## Step 6 — Dashboard Logic (Derived Data)

Implement the "smart" parts of the dashboards as server-side data-fetching logic (not separate screens, but logic within Step 5 screens):

1. **Form Completion Status** — for a given patient, check which related records exist/are empty; render Filled/Pending tags.
2. **Abnormal value highlighting** — define simple threshold rules per vital (e.g. SpO2 < 92, Temp > 38.5, BP out of range) in `lib/clinicalThresholds.ts`; apply in `VitalsBadge` and `AlertBanner`.
3. **Medication Summary** — scheduled vs. completed doses count, computed from `Medication` records where `timeGiven` is null vs. filled.
4. **I/O Summary** — sum of all Intake records vs. sum of all Output records for the patient.
5. **Triage Queue sort** — ER dashboard list sorted Red → Yellow → Green, then by arrival time within each color.

**Done when:** seeded demo patients visibly show correct completion tags, summaries, and at least one abnormal-value alert without manual intervention.

---

## Step 7 — Polish Pass

1. Add loading and empty states to every list/dashboard screen.
2. Add basic responsive layout (this is a webapp, but nurses may use tablets at bedside — test at tablet width).
3. Add a confirmation step on Discharge and Transfer actions (these are irreversible/high-impact).
4. Smoke-test the full demo script end to end: Landing → ER New Patient → Triage → Vitals → Exam → Clinical Details → Investigations → Diagnosis → ER Summary → Transfer to ICU → ICU Patient Dashboard → fill Ventilator + Vitals + Critical Observations → Transfer to IPD → IPD Patient Dashboard → fill remaining forms → Discharge Summary.

**Done when:** the full script above can be performed live without errors, using only the UI (no DB edits needed mid-demo).

---

## Explicitly Out of Scope (for this build)

- Authentication / login / role-based access
- Real-time monitoring or live device integration
- Notifications/alerts beyond in-page highlighting
- Multi-nurse concurrency handling
