const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function ago(hours) {
  return new Date(Date.now() - hours * 3600000)
}

async function main() {
  console.log('Cleaning database...')

  await prisma.criticalObservation.deleteMany()
  await prisma.transferRecord.deleteMany()
  await prisma.dischargeSummary.deleteMany()
  await prisma.preOpChecklist.deleteMany()
  await prisma.procedureRecord.deleteMany()
  await prisma.nursingNote.deleteMany()
  await prisma.dietChart.deleteMany()
  await prisma.bloodTransfusion.deleteMany()
  await prisma.ivFluid.deleteMany()
  await prisma.treatmentCardex.deleteMany()
  await prisma.medication.deleteMany()
  await prisma.activityLog.deleteMany()
  await prisma.intakeOutput.deleteMany()
  await prisma.vitalSign.deleteMany()
  await prisma.generalCondition.deleteMany()
  await prisma.provisionalDiagnosis.deleteMany()
  await prisma.investigation.deleteMany()
  await prisma.clinicalDetails.deleteMany()
  await prisma.examination.deleteMany()
  await prisma.erVitals.deleteMany()
  await prisma.triage.deleteMany()
  await prisma.erIntake.deleteMany()
  await prisma.ventilatorSupport.deleteMany()
  await prisma.oxygenTherapy.deleteMany()
  await prisma.ecgMonitoring.deleteMany()
  await prisma.patient.deleteMany()

  console.log('Seeding ER patients...')

  // ── ER 1: Red — Acute Myocardial Infarction ─────────────────────────────
  const er1 = await prisma.patient.create({
    data: { name: 'Ram Bahadur Thapa', age: 52, sex: 'Male', department: 'ER', status: 'UnderTreatment', diagnosis: 'Acute STEMI' },
  })
  await prisma.erIntake.create({ data: { patientId: er1.id, broughtBy: 'Sita Thapa', relation: 'Wife', arrivalDateTime: ago(1.5) } })
  await prisma.triage.create({ data: { patientId: er1.id, triageCode: 'Red', assignedAt: ago(1.4) } })
  await prisma.erVitals.create({ data: { patientId: er1.id, temperature: 37.1, pulse: 112, respiration: 24, bp: '88/58', spo2: 89, gcs: 13 } })
  await prisma.examination.create({
    data: {
      patientId: er1.id,
      airwayStatus: 'Normal',
      breathingStatus: 'Abnormal', breathingNotes: 'Bilateral basal crackles, increased work of breathing',
      circulationStatus: 'Abnormal', circulationNotes: 'Tachycardia, cold clammy peripheries, JVP raised',
      pupilsStatus: 'Normal',
      abdomenStatus: 'Normal',
    },
  })
  await prisma.clinicalDetails.create({
    data: {
      patientId: er1.id,
      chiefComplaints: 'Severe crushing chest pain radiating to left jaw and arm, profuse sweating, breathlessness — onset 2 hours ago',
      pastHistory: 'Hypertension 8 years on Amlodipine 5mg. Previous angina episode 1 year ago.',
      drugAllergyHistory: 'No known drug allergies',
      personalHistory: 'Smoker 25 pack-years. Occasional alcohol. Sedentary occupation (accountant).',
    },
  })
  await prisma.investigation.createMany({
    data: [
      { patientId: er1.id, type: 'ECG', status: 'Completed', notes: 'ST elevation in leads II, III, aVF — Inferior STEMI pattern' },
      { patientId: er1.id, type: 'CBC', status: 'Pending' },
      { patientId: er1.id, type: 'RBS', status: 'Completed', notes: '198 mg/dL' },
    ],
  })
  await prisma.provisionalDiagnosis.create({ data: { patientId: er1.id, diagnosisText: 'Acute ST-elevation Myocardial Infarction (Inferior wall). Cardiogenic shock. Urgent cardiology referral for primary PCI.' } })

  // ── ER 2: Red — Severe Head Injury (RTA) ────────────────────────────────
  const er2 = await prisma.patient.create({
    data: { name: 'Bikash Adhikari', age: 28, sex: 'Male', department: 'ER', status: 'UnderTreatment', diagnosis: 'Severe TBI — Road Traffic Accident' },
  })
  await prisma.erIntake.create({ data: { patientId: er2.id, broughtBy: 'Police — Constable Rana', relation: 'Police', arrivalDateTime: ago(0.8) } })
  await prisma.triage.create({ data: { patientId: er2.id, triageCode: 'Red', assignedAt: ago(0.75) } })
  await prisma.erVitals.create({ data: { patientId: er2.id, temperature: 36.8, pulse: 54, respiration: 10, bp: '178/98', spo2: 87, gcs: 7 } })
  await prisma.examination.create({
    data: {
      patientId: er2.id,
      airwayStatus: 'Abnormal', airwayNotes: 'Gurgling sounds, jaw clenching — airway at risk',
      breathingStatus: 'Abnormal', breathingNotes: 'Shallow and irregular respiration',
      circulationStatus: 'Abnormal', circulationNotes: 'Bradycardia with hypertension — Cushing triad',
      pupilsStatus: 'Abnormal', pupilsNotes: 'Right pupil 6mm dilated, sluggishly reactive. Left 3mm brisk.',
      abdomenStatus: 'Normal',
    },
  })
  await prisma.clinicalDetails.create({
    data: {
      patientId: er2.id,
      chiefComplaints: 'Unconscious since road traffic accident approximately 45 minutes ago. Helmet not worn. Ejected from motorbike.',
      pastHistory: 'Unknown — no family present',
      drugAllergyHistory: 'Unknown',
      personalHistory: 'Unknown',
    },
  })
  await prisma.investigation.createMany({
    data: [
      { patientId: er2.id, type: 'Xray', status: 'Ordered', notes: 'CT head and C-spine ordered urgently' },
      { patientId: er2.id, type: 'CBC', status: 'Pending' },
    ],
  })

  // ── ER 3: Yellow — Acute Appendicitis ───────────────────────────────────
  const er3 = await prisma.patient.create({
    data: { name: 'Sabita Maharjan', age: 24, sex: 'Female', department: 'ER', status: 'Waiting', diagnosis: 'Suspected Acute Appendicitis' },
  })
  await prisma.erIntake.create({ data: { patientId: er3.id, broughtBy: 'Roshan Maharjan', relation: 'Husband', arrivalDateTime: ago(0.5) } })
  await prisma.triage.create({ data: { patientId: er3.id, triageCode: 'Yellow', assignedAt: ago(0.45) } })
  await prisma.erVitals.create({ data: { patientId: er3.id, temperature: 38.4, pulse: 96, respiration: 18, bp: '114/72', spo2: 98, gcs: 15 } })
  await prisma.clinicalDetails.create({
    data: {
      patientId: er3.id,
      chiefComplaints: 'Right iliac fossa pain for 8 hours, initially periumbilical then migrating to RIF. Nausea and two episodes of vomiting.',
      pastHistory: 'No significant past medical history. Last menstrual period 2 weeks ago.',
      drugAllergyHistory: 'Allergy to Penicillin — rash',
      personalHistory: 'Non-smoker, non-drinker.',
    },
  })
  await prisma.investigation.createMany({
    data: [
      { patientId: er3.id, type: 'CBC', status: 'Pending', notes: 'WBC expected to be elevated' },
      { patientId: er3.id, type: 'RBS', status: 'Completed', notes: '92 mg/dL' },
    ],
  })

  // ── ER 4: Green — Mild Asthma Exacerbation ──────────────────────────────
  const er4 = await prisma.patient.create({
    data: { name: 'Hari Prasad Koirala', age: 41, sex: 'Male', department: 'ER', status: 'Waiting', diagnosis: 'Acute Asthma Exacerbation — Mild' },
  })
  await prisma.erIntake.create({ data: { patientId: er4.id, broughtBy: 'Self', relation: 'Self', arrivalDateTime: ago(0.3) } })
  await prisma.triage.create({ data: { patientId: er4.id, triageCode: 'Green', assignedAt: ago(0.25) } })
  await prisma.erVitals.create({ data: { patientId: er4.id, temperature: 37.0, pulse: 88, respiration: 22, bp: '128/82', spo2: 95, gcs: 15 } })
  await prisma.clinicalDetails.create({
    data: {
      patientId: er4.id,
      chiefComplaints: 'Wheeze and shortness of breath since this morning. Partially relieved by own salbutamol inhaler. Triggered by dust exposure at construction site.',
      pastHistory: 'Known asthmatic since childhood. On salbutamol PRN. Fluticasone inhaler prescribed but not using regularly.',
      drugAllergyHistory: 'Aspirin — bronchospasm',
      personalHistory: 'Non-smoker. Works at construction site.',
    },
  })

  console.log('Seeding IPD patients...')

  // ── IPD 1: Diabetic Cellulitis ───────────────────────────────────────────
  const ipd1 = await prisma.patient.create({
    data: {
      name: 'Kamala Devi Sharma', age: 62, sex: 'Female', department: 'IPD', status: 'Admitted',
      diagnosis: 'Type 2 Diabetes with Cellulitis — Right Leg',
      bedNumber: 'B-12', ward: 'General Ward', ipNumber: 'IP-2026-001',
      dateOfAdmission: ago(48),
    },
  })
  await prisma.generalCondition.create({ data: { patientId: ipd1.id, consciousness: 'Alert', gcsScore: 15, painLevel: 5, orientedTime: true, orientedPlace: true, orientedPerson: true } })
  await prisma.vitalSign.createMany({
    data: [
      { patientId: ipd1.id, temperature: 38.1, pulse: 92, respiration: 18, bp: '148/90', spo2: 97, nurseName: 'Anita Rai', recordedAt: ago(0) },
      { patientId: ipd1.id, temperature: 38.4, pulse: 96, respiration: 19, bp: '152/92', spo2: 96, nurseName: 'Anita Rai', recordedAt: ago(6) },
      { patientId: ipd1.id, temperature: 38.8, pulse: 100, respiration: 20, bp: '156/94', spo2: 95, nurseName: 'Meena KC', recordedAt: ago(12) },
    ],
  })
  await prisma.intakeOutput.createMany({
    data: [
      { patientId: ipd1.id, type: 'Intake', subtype: 'OralFluid', quantity: 250, recordedAt: ago(12) },
      { patientId: ipd1.id, type: 'Intake', subtype: 'IVFluid', quantity: 500, recordedAt: ago(8) },
      { patientId: ipd1.id, type: 'Output', subtype: 'Urine', quantity: 380, recordedAt: ago(6) },
      { patientId: ipd1.id, type: 'Intake', subtype: 'OralFluid', quantity: 200, recordedAt: ago(3) },
      { patientId: ipd1.id, type: 'Output', subtype: 'Urine', quantity: 210, recordedAt: ago(1) },
    ],
  })
  await prisma.medication.createMany({
    data: [
      { patientId: ipd1.id, drugName: 'Amoxicillin-Clavulanate', dose: '625mg', route: 'Oral', timeScheduled: '08:00', timeGiven: '08:10', nurseSignature: 'AR' },
      { patientId: ipd1.id, drugName: 'Metformin', dose: '500mg', route: 'Oral', timeScheduled: '08:00', timeGiven: '08:10', nurseSignature: 'AR' },
      { patientId: ipd1.id, drugName: 'Amlodipine', dose: '5mg', route: 'Oral', timeScheduled: '08:00', timeGiven: '08:12', nurseSignature: 'AR' },
      { patientId: ipd1.id, drugName: 'Paracetamol', dose: '500mg', route: 'Oral', timeScheduled: '14:00', timeGiven: null },
      { patientId: ipd1.id, drugName: 'Amoxicillin-Clavulanate', dose: '625mg', route: 'Oral', timeScheduled: '20:00', timeGiven: null },
    ],
  })
  await prisma.ivFluid.create({ data: { patientId: ipd1.id, fluidType: 'Normal Saline 0.9%', rate: '100 mL/hr', startTime: ago(8), volumeInfused: 500 } })
  await prisma.nursingNote.createMany({
    data: [
      { patientId: ipd1.id, shift: 'Morning', observations: 'Patient alert and cooperative. Right leg swelling and erythema from ankle to mid-calf. Wound discharge minimal, yellowish. Pain 5/10. BS 182 mg/dL.', interventions: 'IV antibiotics administered on time. Wound dressed with normal saline gauze. Leg elevated on pillow. RBS monitoring done.', patientResponse: 'Patient tolerated dressing well. Pain slightly reduced post-analgesic.', nurseName: 'Anita Rai', recordedAt: ago(2) },
      { patientId: ipd1.id, shift: 'Night', observations: 'Fever 38.8°C at 2 AM. Patient restless. IV site patent. Urine output adequate.', interventions: 'Tepid sponging, paracetamol 500mg given per order. Fan applied.', patientResponse: 'Temperature reduced to 38.1°C after 1 hour. Patient settled.', nurseName: 'Meena KC', recordedAt: ago(10) },
    ],
  })
  await prisma.dietChart.create({ data: { patientId: ipd1.id, dietType: 'Diabetic', restrictions: 'Low sugar, low carbohydrate. No sweets or fried food.', feedingMethod: 'Self' } })
  await prisma.treatmentCardex.create({
    data: {
      patientId: ipd1.id,
      doctorOrders: 'IV antibiotics as charted. Daily wound dressing. RBS 6-hourly. Leg elevation. Monitor temperature 4-hourly.',
      medicationsPrescribed: 'Amoxicillin-Clavulanate 625mg TDS PO, Metformin 500mg BD PO, Amlodipine 5mg OD PO, Paracetamol 500mg SOS',
      ivFluidsInstructions: 'NS 0.9% at 100mL/hr — review after 500mL',
      specialInstructions: 'Strict diabetic diet. Monitor for signs of sepsis — rising WBC, altered consciousness.',
      nurseInitials: 'AR',
    },
  })
  await prisma.activityLog.createMany({ data: [{ patientId: ipd1.id, activityType: 'BedRest', recordedAt: ago(12) }, { patientId: ipd1.id, activityType: 'Sitting', recordedAt: ago(3) }] })

  // ── IPD 2: Typhoid Fever ─────────────────────────────────────────────────
  const ipd2 = await prisma.patient.create({
    data: {
      name: 'Mohan Lal Acharya', age: 19, sex: 'Male', department: 'IPD', status: 'Admitted',
      diagnosis: 'Enteric Fever (Typhoid) — Day 5',
      bedNumber: 'B-08', ward: 'General Ward', ipNumber: 'IP-2026-002',
      dateOfAdmission: ago(96),
    },
  })
  await prisma.generalCondition.create({ data: { patientId: ipd2.id, consciousness: 'Alert', gcsScore: 15, painLevel: 3, orientedTime: true, orientedPlace: true, orientedPerson: true } })
  await prisma.vitalSign.createMany({
    data: [
      { patientId: ipd2.id, temperature: 39.2, pulse: 84, respiration: 18, bp: '106/68', spo2: 97, nurseName: 'Anita Rai', recordedAt: ago(0) },
      { patientId: ipd2.id, temperature: 39.6, pulse: 86, respiration: 19, bp: '104/66', spo2: 97, nurseName: 'Anita Rai', recordedAt: ago(6) },
      { patientId: ipd2.id, temperature: 39.8, pulse: 88, respiration: 20, bp: '108/70', spo2: 96, nurseName: 'Meena KC', recordedAt: ago(12) },
    ],
  })
  await prisma.medication.createMany({
    data: [
      { patientId: ipd2.id, drugName: 'Ceftriaxone', dose: '2g', route: 'IV', timeScheduled: '08:00', timeGiven: '08:05', nurseSignature: 'AR' },
      { patientId: ipd2.id, drugName: 'Paracetamol', dose: '500mg', route: 'Oral', timeScheduled: '06:00', timeGiven: '06:10', nurseSignature: 'MK' },
      { patientId: ipd2.id, drugName: 'Paracetamol', dose: '500mg', route: 'Oral', timeScheduled: '12:00', timeGiven: null },
      { patientId: ipd2.id, drugName: 'Ceftriaxone', dose: '2g', route: 'IV', timeScheduled: '20:00', timeGiven: null },
    ],
  })
  await prisma.ivFluid.create({ data: { patientId: ipd2.id, fluidType: 'DNS (Dextrose Normal Saline)', rate: '80 mL/hr', startTime: ago(6), volumeInfused: 480 } })
  await prisma.intakeOutput.createMany({
    data: [
      { patientId: ipd2.id, type: 'Intake', subtype: 'OralFluid', quantity: 350, recordedAt: ago(8) },
      { patientId: ipd2.id, type: 'Intake', subtype: 'IVFluid', quantity: 480, recordedAt: ago(2) },
      { patientId: ipd2.id, type: 'Output', subtype: 'Urine', quantity: 420, recordedAt: ago(4) },
      { patientId: ipd2.id, type: 'Output', subtype: 'Stool', quantity: 150, recordedAt: ago(6) },
    ],
  })
  await prisma.nursingNote.create({
    data: {
      patientId: ipd2.id, shift: 'Morning',
      observations: 'Patient alert, complains of persistent high-grade fever and generalised body ache. Step-ladder fever pattern continuing. Mild abdominal distension. Soft, non-tender. Spleen palpable 2 cm below costal margin. Rash (rose spots) noted on abdomen.',
      interventions: 'Antipyretic given. Tepid sponging. IV antibiotics administered. Encourage oral fluids. Stool chart maintained.',
      patientResponse: 'Fever reduced by 0.8°C after interventions. Patient resting.',
      nurseName: 'Anita Rai', recordedAt: ago(2),
    },
  })
  await prisma.dietChart.create({ data: { patientId: ipd2.id, dietType: 'Soft', restrictions: 'Soft, easily digestible food. Avoid high fibre. Plenty of fluids.', feedingMethod: 'Self' } })
  await prisma.activityLog.create({ data: { patientId: ipd2.id, activityType: 'BedRest', recordedAt: ago(4) } })

  // ── IPD 3: Post-Op Day 2 Appendectomy ───────────────────────────────────
  const ipd3 = await prisma.patient.create({
    data: {
      name: 'Parvati Shrestha', age: 31, sex: 'Female', department: 'IPD', status: 'Admitted',
      diagnosis: 'Post-Laparoscopic Appendectomy — Day 2',
      bedNumber: 'B-15', ward: 'Surgical Ward', ipNumber: 'IP-2026-003',
      dateOfAdmission: ago(52),
    },
  })
  await prisma.generalCondition.create({ data: { patientId: ipd3.id, consciousness: 'Alert', gcsScore: 15, painLevel: 3, orientedTime: true, orientedPlace: true, orientedPerson: true } })
  await prisma.vitalSign.createMany({
    data: [
      { patientId: ipd3.id, temperature: 37.3, pulse: 76, respiration: 16, bp: '118/74', spo2: 99, nurseName: 'Anita Rai', recordedAt: ago(0) },
      { patientId: ipd3.id, temperature: 37.5, pulse: 80, respiration: 17, bp: '120/76', spo2: 98, nurseName: 'Meena KC', recordedAt: ago(8) },
    ],
  })
  await prisma.medication.createMany({
    data: [
      { patientId: ipd3.id, drugName: 'Diclofenac', dose: '75mg', route: 'IM', timeScheduled: '08:00', timeGiven: '08:08', nurseSignature: 'AR' },
      { patientId: ipd3.id, drugName: 'Metronidazole', dose: '500mg', route: 'IV', timeScheduled: '08:00', timeGiven: '08:05', nurseSignature: 'AR' },
      { patientId: ipd3.id, drugName: 'Metronidazole', dose: '500mg', route: 'IV', timeScheduled: '16:00', timeGiven: null },
    ],
  })
  await prisma.intakeOutput.createMany({
    data: [
      { patientId: ipd3.id, type: 'Intake', subtype: 'OralFluid', quantity: 400, recordedAt: ago(6) },
      { patientId: ipd3.id, type: 'Intake', subtype: 'OralFluid', quantity: 300, recordedAt: ago(2) },
      { patientId: ipd3.id, type: 'Output', subtype: 'Urine', quantity: 550, recordedAt: ago(4) },
    ],
  })
  await prisma.nursingNote.create({
    data: {
      patientId: ipd3.id, shift: 'Morning',
      observations: 'Patient alert and recovering well. Three laparoscopic port sites clean and dry. Mild pain at umbilical port site 3/10. Tolerating oral fluids and soft diet. Passed flatus yesterday. Bowels not open yet.',
      interventions: 'Wound inspection done — no signs of infection. IM analgesic given. Encouraged early ambulation. Wound care per surgical protocol.',
      patientResponse: 'Patient walked to bathroom independently. Pain well controlled.',
      nurseName: 'Anita Rai', recordedAt: ago(1),
    },
  })
  await prisma.preOpChecklist.create({ data: { patientId: ipd3.id, consentTaken: true, fastingStatus: 'NPO since midnight', investigationsCompleted: true } })
  await prisma.procedureRecord.create({ data: { patientId: ipd3.id, procedureName: 'Wound Dressing', dateTime: ago(2), performedBy: 'Nurse Anita Rai', remarks: 'Port sites clean and dry. No discharge. Steri-strips intact.' } })
  await prisma.dietChart.create({ data: { patientId: ipd3.id, dietType: 'Soft', restrictions: 'Start with clear liquids, progress to soft diet as tolerated.', feedingMethod: 'Self' } })
  await prisma.activityLog.createMany({ data: [{ patientId: ipd3.id, activityType: 'BedRest', recordedAt: ago(24) }, { patientId: ipd3.id, activityType: 'Walking', recordedAt: ago(2) }] })

  // ── IPD 4: COPD Exacerbation ─────────────────────────────────────────────
  const ipd4 = await prisma.patient.create({
    data: {
      name: 'Dilip Kumar Yadav', age: 68, sex: 'Male', department: 'IPD', status: 'Admitted',
      diagnosis: 'Acute Exacerbation of COPD — Day 4',
      bedNumber: 'B-03', ward: 'Medical Ward', ipNumber: 'IP-2026-004',
      dateOfAdmission: ago(96),
    },
  })
  await prisma.generalCondition.create({ data: { patientId: ipd4.id, consciousness: 'Alert', gcsScore: 15, painLevel: 2, orientedTime: true, orientedPlace: true, orientedPerson: true } })
  await prisma.vitalSign.createMany({
    data: [
      { patientId: ipd4.id, temperature: 37.4, pulse: 90, respiration: 24, bp: '138/86', spo2: 91, nurseName: 'Anita Rai', recordedAt: ago(0) },
      { patientId: ipd4.id, temperature: 37.6, pulse: 94, respiration: 26, bp: '140/88', spo2: 89, nurseName: 'Meena KC', recordedAt: ago(6) },
      { patientId: ipd4.id, temperature: 37.8, pulse: 98, respiration: 28, bp: '144/90', spo2: 87, nurseName: 'Meena KC', recordedAt: ago(12) },
    ],
  })
  await prisma.medication.createMany({
    data: [
      { patientId: ipd4.id, drugName: 'Salbutamol Nebulisation', dose: '2.5mg', route: 'Nebulisation', timeScheduled: '06:00', timeGiven: '06:05', nurseSignature: 'MK' },
      { patientId: ipd4.id, drugName: 'Ipratropium Nebulisation', dose: '500mcg', route: 'Nebulisation', timeScheduled: '06:00', timeGiven: '06:05', nurseSignature: 'MK' },
      { patientId: ipd4.id, drugName: 'Prednisolone', dose: '40mg', route: 'Oral', timeScheduled: '08:00', timeGiven: '08:10', nurseSignature: 'AR' },
      { patientId: ipd4.id, drugName: 'Doxycycline', dose: '100mg', route: 'Oral', timeScheduled: '08:00', timeGiven: '08:10', nurseSignature: 'AR' },
      { patientId: ipd4.id, drugName: 'Salbutamol Nebulisation', dose: '2.5mg', route: 'Nebulisation', timeScheduled: '14:00', timeGiven: null },
    ],
  })
  await prisma.nursingNote.createMany({
    data: [
      { patientId: ipd4.id, shift: 'Morning', observations: 'Patient alert, sitting upright. Audible wheeze and productive cough with greenish sputum. Respiratory rate 24/min. SpO₂ 91% on 2L/min O₂ via nasal cannula. Pursed lip breathing noted.', interventions: 'O₂ therapy via nasal cannula maintained at 2L/min. Nebulisation given. Positional change to high Fowler\'s. Encouraged deep breathing and coughing exercises.', patientResponse: 'SpO₂ improved to 93% after nebulisation. Patient feels slightly better.', nurseName: 'Anita Rai', recordedAt: ago(2) },
    ],
  })
  await prisma.dietChart.create({ data: { patientId: ipd4.id, dietType: 'Regular', restrictions: 'High protein, adequate calories. Small frequent meals. Avoid gas-forming foods.', feedingMethod: 'Self' } })
  await prisma.activityLog.createMany({ data: [{ patientId: ipd4.id, activityType: 'BedRest', recordedAt: ago(12) }, { patientId: ipd4.id, activityType: 'Sitting', recordedAt: ago(2) }] })

  console.log('Seeding ICU patients...')

  // ── ICU 1: ARDS Post-Sepsis — on Ventilator ─────────────────────────────
  const icu1 = await prisma.patient.create({
    data: {
      name: 'Gopal Krishna Pandey', age: 58, sex: 'Male', department: 'ICU', status: 'Admitted',
      diagnosis: 'ARDS Secondary to Sepsis — Mechanical Ventilation Day 2',
      bedNumber: 'ICU-1', dateOfAdmission: ago(36),
    },
  })
  await prisma.ventilatorSupport.create({ data: { patientId: icu1.id, inUse: true, mode: 'IPPV', settings: 'FiO₂ 65%, Tidal Volume 420mL (6mL/kg IBW), PEEP 10cmH₂O, RR 16/min, I:E 1:2' } })
  await prisma.oxygenTherapy.create({ data: { patientId: icu1.id, flowRate: 'FiO₂ 65% via ventilator circuit', deliveryMethod: 'Endotracheal Tube' } })
  await prisma.ecgMonitoring.create({ data: { patientId: icu1.id, inUse: true, notes: 'Continuous cardiac monitoring. Sinus tachycardia HR 118-124/min. No ST changes or arrhythmias.' } })
  await prisma.vitalSign.createMany({
    data: [
      { patientId: icu1.id, temperature: 39.2, pulse: 120, respiration: 16, bp: '84/52', spo2: 87, nurseName: 'Sunita Gurung', recordedAt: ago(0) },
      { patientId: icu1.id, temperature: 39.4, pulse: 124, respiration: 16, bp: '82/50', spo2: 85, nurseName: 'Sunita Gurung', recordedAt: ago(2) },
      { patientId: icu1.id, temperature: 39.6, pulse: 128, respiration: 18, bp: '80/48', spo2: 83, nurseName: 'Puja Tamang', recordedAt: ago(6) },
    ],
  })
  await prisma.criticalObservation.createMany({
    data: [
      { patientId: icu1.id, suddenChanges: 'SpO₂ dropped to 74% — ventilator alarm triggered. Copious secretions audible. Circuit condensation.', emergencyInterventions: 'Emergency suction performed via ETT. FiO₂ increased to 80% temporarily. Chest physiotherapy. Physician at bedside. SpO₂ recovered to 84% in 8 minutes.', nurseName: 'Sunita Gurung', recordedAt: ago(2) },
      { patientId: icu1.id, suddenChanges: 'MAP dropped to 42 mmHg. Patient peripherally shut down. Urine output dropped to 10mL in last 2 hours.', emergencyInterventions: 'Rapid crystalloid bolus 250mL NS over 15 min. Norepinephrine infusion increased from 0.1 to 0.2 mcg/kg/min. Intensivist called. MAP improved to 58 after bolus.', nurseName: 'Puja Tamang', recordedAt: ago(6) },
    ],
  })
  await prisma.medication.createMany({
    data: [
      { patientId: icu1.id, drugName: 'Norepinephrine', dose: '0.2 mcg/kg/min', route: 'IV Infusion', timeScheduled: 'Continuous', timeGiven: 'Running', nurseSignature: 'SG' },
      { patientId: icu1.id, drugName: 'Meropenem', dose: '1g', route: 'IV', timeScheduled: '08:00', timeGiven: '08:05', nurseSignature: 'SG' },
      { patientId: icu1.id, drugName: 'Meropenem', dose: '1g', route: 'IV', timeScheduled: '16:00', timeGiven: null },
      { patientId: icu1.id, drugName: 'Midazolam', dose: '2-5mg/hr', route: 'IV Infusion', timeScheduled: 'Continuous', timeGiven: 'Running', nurseSignature: 'SG' },
      { patientId: icu1.id, drugName: 'Fentanyl', dose: '25-50mcg/hr', route: 'IV Infusion', timeScheduled: 'Continuous', timeGiven: 'Running', nurseSignature: 'SG' },
    ],
  })
  await prisma.intakeOutput.createMany({
    data: [
      { patientId: icu1.id, type: 'Intake', subtype: 'IVFluid', quantity: 500, recordedAt: ago(6) },
      { patientId: icu1.id, type: 'Intake', subtype: 'IVFluid', quantity: 250, recordedAt: ago(2) },
      { patientId: icu1.id, type: 'Output', subtype: 'Urine', quantity: 80, recordedAt: ago(6) },
      { patientId: icu1.id, type: 'Output', subtype: 'Drainage', quantity: 40, recordedAt: ago(2) },
    ],
  })
  await prisma.nursingNote.create({
    data: {
      patientId: icu1.id, shift: 'Morning',
      observations: 'Patient intubated and deeply sedated (RASS -3). On IPPV mode mechanical ventilation. Haemodynamically unstable — on norepinephrine infusion. ETT at 22cm at lip, secured. Bilateral air entry present but decreased at bases. Purulent secretions suctioned. Foley catheter in situ, urine dark yellow, output 80mL in last 6 hours — oliguria.',
      interventions: '2-hourly positioning. ETT and oral care done. Pressure area care. Eyes lubricated. NGT feed commenced at 20mL/hr per ICU protocol. All drips checked and documented.',
      patientResponse: 'No spontaneous movements. On sedation scoring RASS -3. GCS 6T.',
      nurseName: 'Sunita Gurung', recordedAt: ago(1),
    },
  })

  // ── ICU 2: Cardiogenic Shock Post-Cardiac Arrest ─────────────────────────
  const icu2 = await prisma.patient.create({
    data: {
      name: 'Sunita Basnet', age: 47, sex: 'Female', department: 'ICU', status: 'Admitted',
      diagnosis: 'Cardiogenic Shock — Post Out-of-Hospital Cardiac Arrest (OHCA), ROSC achieved',
      bedNumber: 'ICU-2', dateOfAdmission: ago(18),
    },
  })
  await prisma.ventilatorSupport.create({ data: { patientId: icu2.id, inUse: true, mode: 'SIMV', settings: 'FiO₂ 50%, Tidal Volume 400mL, PEEP 6cmH₂O, RR 14/min, PS 8cmH₂O' } })
  await prisma.oxygenTherapy.create({ data: { patientId: icu2.id, flowRate: 'FiO₂ 50% via ventilator', deliveryMethod: 'Endotracheal Tube' } })
  await prisma.ecgMonitoring.create({ data: { patientId: icu2.id, inUse: true, notes: 'Post-arrest monitoring. Sinus rhythm HR 102/min. Frequent PVCs noted — cardiology consulted. QT interval prolonged at 480ms.' } })
  await prisma.vitalSign.createMany({
    data: [
      { patientId: icu2.id, temperature: 36.2, pulse: 102, respiration: 14, bp: '92/60', spo2: 94, nurseName: 'Puja Tamang', recordedAt: ago(0) },
      { patientId: icu2.id, temperature: 36.0, pulse: 108, respiration: 16, bp: '88/56', spo2: 92, nurseName: 'Puja Tamang', recordedAt: ago(4) },
    ],
  })
  await prisma.criticalObservation.create({
    data: {
      patientId: icu2.id,
      suddenChanges: 'Run of 8 PVCs (ventricular ectopics) in 2 minutes on cardiac monitor. Patient\'s BP dropped from 92 to 76 mmHg systolic.',
      emergencyInterventions: 'Cardiologist notified immediately. Amiodarone 150mg IV bolus given over 10 min per order. Defibrillator at bedside on standby. BP recovered to 86 after 15 minutes.',
      nurseName: 'Puja Tamang', recordedAt: ago(4),
    },
  })
  await prisma.medication.createMany({
    data: [
      { patientId: icu2.id, drugName: 'Dobutamine', dose: '5 mcg/kg/min', route: 'IV Infusion', timeScheduled: 'Continuous', timeGiven: 'Running', nurseSignature: 'PT' },
      { patientId: icu2.id, drugName: 'Norepinephrine', dose: '0.08 mcg/kg/min', route: 'IV Infusion', timeScheduled: 'Continuous', timeGiven: 'Running', nurseSignature: 'PT' },
      { patientId: icu2.id, drugName: 'Amiodarone', dose: '900mg/24hr', route: 'IV Infusion', timeScheduled: 'Continuous', timeGiven: 'Running', nurseSignature: 'PT' },
      { patientId: icu2.id, drugName: 'Aspirin', dose: '300mg', route: 'NGT', timeScheduled: '08:00', timeGiven: '08:10', nurseSignature: 'PT' },
    ],
  })
  await prisma.intakeOutput.createMany({
    data: [
      { patientId: icu2.id, type: 'Intake', subtype: 'IVFluid', quantity: 200, recordedAt: ago(4) },
      { patientId: icu2.id, type: 'Output', subtype: 'Urine', quantity: 120, recordedAt: ago(4) },
      { patientId: icu2.id, type: 'Output', subtype: 'Urine', quantity: 95, recordedAt: ago(0) },
    ],
  })
  await prisma.nursingNote.create({
    data: {
      patientId: icu2.id, shift: 'Night',
      observations: 'Post-OHCA day 1. Patient intubated and sedated (RASS -2). On dual inotrope/vasopressor support. Cardiac rhythm: sinus with frequent PVCs — cardiologist involved. ETT secure at 21cm. Pupils equal and reactive 3mm bilaterally. Hands and feet warm, capillary refill 3 seconds. Foley in situ.',
      interventions: 'Cardiac monitoring continuous. PVC episode managed with amiodarone per protocol. Cooling not initiated (temperature 36°C). Pressure area care done. Mouth care every 2 hours.',
      patientResponse: 'No response to voice. Responds to deep pain with withdrawal. GCS 7T (E2VtM4).',
      nurseName: 'Puja Tamang', recordedAt: ago(3),
    },
  })

  // ── ICU 3: Acute Liver Failure ──────────────────────────────────────────
  const icu3 = await prisma.patient.create({
    data: {
      name: 'Rajan Gurung', age: 44, sex: 'Male', department: 'ICU', status: 'Admitted',
      diagnosis: 'Acute-on-Chronic Liver Failure — Hepatic Encephalopathy Grade III',
      bedNumber: 'ICU-3', dateOfAdmission: ago(24),
    },
  })
  await prisma.ecgMonitoring.create({ data: { patientId: icu3.id, inUse: true, notes: 'Sinus rhythm 88/min. No significant arrhythmia. QTc borderline prolonged 450ms. Monitoring for changes with electrolyte imbalance.' } })
  await prisma.oxygenTherapy.create({ data: { patientId: icu3.id, flowRate: '4 L/min', deliveryMethod: 'Nasal Cannula' } })
  await prisma.vitalSign.createMany({
    data: [
      { patientId: icu3.id, temperature: 37.8, pulse: 90, respiration: 20, bp: '98/62', spo2: 95, nurseName: 'Sunita Gurung', recordedAt: ago(0) },
      { patientId: icu3.id, temperature: 38.0, pulse: 94, respiration: 22, bp: '96/60', spo2: 94, nurseName: 'Puja Tamang', recordedAt: ago(4) },
      { patientId: icu3.id, temperature: 37.6, pulse: 88, respiration: 20, bp: '100/64', spo2: 95, nurseName: 'Puja Tamang', recordedAt: ago(8) },
    ],
  })
  await prisma.criticalObservation.create({
    data: {
      patientId: icu3.id,
      suddenChanges: 'Patient became acutely confused and agitated, pulling at IV lines. Flapping tremor (asterixis) observed. Unable to follow commands. Encephalopathy progressed from Grade II to Grade III.',
      emergencyInterventions: 'Side rails raised. Soft restraints applied for safety. Lactulose dose increased per hepatologist order. Rifaximin started. Blood ammonia level sent. Family informed of deterioration.',
      nurseName: 'Puja Tamang', recordedAt: ago(4),
    },
  })
  await prisma.medication.createMany({
    data: [
      { patientId: icu3.id, drugName: 'Lactulose', dose: '30mL', route: 'Oral/NGT', timeScheduled: '06:00', timeGiven: '06:10', nurseSignature: 'PT' },
      { patientId: icu3.id, drugName: 'Rifaximin', dose: '550mg', route: 'Oral', timeScheduled: '08:00', timeGiven: '08:10', nurseSignature: 'SG' },
      { patientId: icu3.id, drugName: 'Vitamin K', dose: '10mg', route: 'IV', timeScheduled: '08:00', timeGiven: '08:08', nurseSignature: 'SG' },
      { patientId: icu3.id, drugName: 'Lactulose', dose: '30mL', route: 'Oral/NGT', timeScheduled: '14:00', timeGiven: null },
      { patientId: icu3.id, drugName: 'Spironolactone', dose: '100mg', route: 'Oral', timeScheduled: '08:00', timeGiven: '08:10', nurseSignature: 'SG' },
    ],
  })
  await prisma.intakeOutput.createMany({
    data: [
      { patientId: icu3.id, type: 'Intake', subtype: 'IVFluid', quantity: 500, recordedAt: ago(6) },
      { patientId: icu3.id, type: 'Output', subtype: 'Urine', quantity: 220, recordedAt: ago(6) },
      { patientId: icu3.id, type: 'Output', subtype: 'Drainage', quantity: 80, recordedAt: ago(3) },
      { patientId: icu3.id, type: 'Output', subtype: 'Urine', quantity: 180, recordedAt: ago(1) },
    ],
  })
  await prisma.nursingNote.create({
    data: {
      patientId: icu3.id, shift: 'Morning',
      observations: 'Patient deeply jaundiced — scleral icterus +++, generalised jaundice visible. Confusion and disorientation — Grade III hepatic encephalopathy. Asterixis present. Abdomen distended with ascites — shifting dullness positive. Bilateral pitting oedema up to knees. Spider naevi visible on chest.',
      interventions: 'Patient safety maintained — side rails up, soft restraints. Lactulose and Rifaximin given. Fluid balance strictly monitored. Neurological observations hourly. Avoiding nephrotoxic and hepatotoxic drugs.',
      patientResponse: 'Patient intermittently responds to loud voice. Restless. Unable to maintain orientation.',
      nurseName: 'Sunita Gurung', recordedAt: ago(1),
    },
  })

  console.log('\n✅ Seed complete!')
  console.log('\n📋 ER Patients (4):')
  console.log(`   🔴 ${er1.name}, ${er1.age}M — ${er1.diagnosis}`)
  console.log(`   🔴 ${er2.name}, ${er2.age}M — ${er2.diagnosis}`)
  console.log(`   🟡 ${er3.name}, ${er3.age}F — ${er3.diagnosis}`)
  console.log(`   🟢 ${er4.name}, ${er4.age}M — ${er4.diagnosis}`)
  console.log('\n🏥 IPD Patients (4):')
  console.log(`   ${ipd1.name}, ${ipd1.age}F — ${ipd1.diagnosis}`)
  console.log(`   ${ipd2.name}, ${ipd2.age}M — ${ipd2.diagnosis}`)
  console.log(`   ${ipd3.name}, ${ipd3.age}F — ${ipd3.diagnosis}`)
  console.log(`   ${ipd4.name}, ${ipd4.age}M — ${ipd4.diagnosis}`)
  console.log('\n🚨 ICU Patients (3):')
  console.log(`   ${icu1.name}, ${icu1.age}M — ${icu1.diagnosis}`)
  console.log(`   ${icu2.name}, ${icu2.age}F — ${icu2.diagnosis}`)
  console.log(`   ${icu3.name}, ${icu3.age}M — ${icu3.diagnosis}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
