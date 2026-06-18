const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing data
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

  // ── ER Patient: mid-flow ──────────────────────────────────────────────────
  const erPatient = await prisma.patient.create({
    data: {
      name: 'Ram Bahadur Thapa',
      age: 45,
      sex: 'Male',
      department: 'ER',
      status: 'UnderTreatment',
      diagnosis: 'Suspected Acute MI',
    },
  })

  await prisma.erIntake.create({
    data: { patientId: erPatient.id, broughtBy: 'Sita Thapa', relation: 'Wife', arrivalDateTime: new Date('2026-06-18T08:30:00') },
  })
  await prisma.triage.create({
    data: { patientId: erPatient.id, triageCode: 'Red', assignedAt: new Date('2026-06-18T08:35:00') },
  })
  await prisma.erVitals.create({
    data: { patientId: erPatient.id, temperature: 37.2, pulse: 110, respiration: 22, bp: '90/60', spo2: 91, gcs: 14 },
  })
  await prisma.examination.create({
    data: {
      patientId: erPatient.id,
      airwayStatus: 'Normal', breathingStatus: 'Abnormal', breathingNotes: 'Reduced air entry on left side',
      circulationStatus: 'Abnormal', circulationNotes: 'Tachycardia, cold peripheries',
      pupilsStatus: 'Normal', abdomenStatus: 'Normal',
    },
  })
  await prisma.clinicalDetails.create({
    data: {
      patientId: erPatient.id,
      chiefComplaints: 'Chest pain radiating to left arm, diaphoresis, shortness of breath for 2 hours',
      pastHistory: 'Hypertension for 5 years, on Amlodipine',
      drugAllergyHistory: 'No known drug allergies',
      personalHistory: 'Smoker, 20 pack-years',
    },
  })
  await prisma.investigation.createMany({
    data: [
      { patientId: erPatient.id, type: 'ECG', status: 'Completed', notes: 'ST elevation in leads II, III, aVF' },
      { patientId: erPatient.id, type: 'CBC', status: 'Pending' },
      { patientId: erPatient.id, type: 'RBS', status: 'Completed', notes: 'RBS 180 mg/dL' },
    ],
  })

  // ── IPD Patient: fully admitted, several forms filled ────────────────────
  const ipdPatient = await prisma.patient.create({
    data: {
      name: 'Kamala Devi Sharma',
      age: 62,
      sex: 'Female',
      department: 'IPD',
      status: 'Admitted',
      diagnosis: 'Type 2 Diabetes with Cellulitis - Right Leg',
      bedNumber: 'B-12',
      ward: 'General Ward',
      ipNumber: 'IP-2026-001',
      dateOfAdmission: new Date('2026-06-16T10:00:00'),
    },
  })

  await prisma.generalCondition.create({
    data: {
      patientId: ipdPatient.id,
      consciousness: 'Alert',
      gcsScore: 15,
      painLevel: 6,
      orientedTime: true, orientedPlace: true, orientedPerson: true,
    },
  })

  const now = new Date()
  const minus2h = new Date(now.getTime() - 2 * 3600000)
  const minus6h = new Date(now.getTime() - 6 * 3600000)
  const minus12h = new Date(now.getTime() - 12 * 3600000)

  await prisma.vitalSign.createMany({
    data: [
      { patientId: ipdPatient.id, temperature: 38.8, pulse: 96, respiration: 18, bp: '150/92', spo2: 96, nurseName: 'Anita Rai', recordedAt: now },
      { patientId: ipdPatient.id, temperature: 38.5, pulse: 98, respiration: 19, bp: '148/90', spo2: 95, nurseName: 'Anita Rai', recordedAt: minus6h },
      { patientId: ipdPatient.id, temperature: 38.2, pulse: 100, respiration: 20, bp: '152/94', spo2: 94, nurseName: 'Meena KC', recordedAt: minus12h },
    ],
  })

  await prisma.intakeOutput.createMany({
    data: [
      { patientId: ipdPatient.id, type: 'Intake', subtype: 'OralFluid', quantity: 250, recordedAt: minus12h },
      { patientId: ipdPatient.id, type: 'Intake', subtype: 'IVFluid', quantity: 500, recordedAt: minus6h },
      { patientId: ipdPatient.id, type: 'Output', subtype: 'Urine', quantity: 350, recordedAt: minus6h },
      { patientId: ipdPatient.id, type: 'Intake', subtype: 'OralFluid', quantity: 200, recordedAt: minus2h },
      { patientId: ipdPatient.id, type: 'Output', subtype: 'Urine', quantity: 200, recordedAt: now },
    ],
  })

  await prisma.medication.createMany({
    data: [
      { patientId: ipdPatient.id, drugName: 'Amoxicillin-Clavulanate', dose: '625mg', route: 'Oral', timeScheduled: '08:00', timeGiven: '08:10', nurseSignature: 'AR' },
      { patientId: ipdPatient.id, drugName: 'Metformin', dose: '500mg', route: 'Oral', timeScheduled: '08:00', timeGiven: '08:10', nurseSignature: 'AR' },
      { patientId: ipdPatient.id, drugName: 'Amlodipine', dose: '5mg', route: 'Oral', timeScheduled: '08:00', timeGiven: null },
      { patientId: ipdPatient.id, drugName: 'Amoxicillin-Clavulanate', dose: '625mg', route: 'Oral', timeScheduled: '20:00', timeGiven: null },
    ],
  })

  await prisma.ivFluid.create({
    data: {
      patientId: ipdPatient.id,
      fluidType: 'Normal Saline 0.9%',
      rate: '100 mL/hr',
      startTime: minus6h,
      volumeInfused: 500,
    },
  })

  await prisma.nursingNote.createMany({
    data: [
      {
        patientId: ipdPatient.id,
        shift: 'Morning',
        observations: 'Patient alert and cooperative. Right leg swelling and redness extends from ankle to mid-calf. Wound discharge noted, dressing changed. Pain score 6/10.',
        interventions: 'IV antibiotics administered, leg elevation maintained, wound dressed with normal saline soaked gauze.',
        patientResponse: 'Patient tolerated dressing change. Pain slightly reduced after analgesic.',
        nurseName: 'Anita Rai',
        recordedAt: now,
      },
      {
        patientId: ipdPatient.id,
        shift: 'Night',
        observations: 'Patient had disturbed sleep. Fever 38.5°C noted at 2 AM. IV fluids running at 100 mL/hr.',
        interventions: 'Tepid sponging done, paracetamol given per order.',
        patientResponse: 'Temperature reduced to 37.9°C after 1 hour.',
        nurseName: 'Meena KC',
        recordedAt: minus12h,
      },
    ],
  })

  await prisma.dietChart.create({
    data: {
      patientId: ipdPatient.id,
      dietType: 'Diabetic',
      restrictions: 'Low sugar, low carbohydrate. No sweets.',
      feedingMethod: 'Self',
    },
  })

  await prisma.treatmentCardex.create({
    data: {
      patientId: ipdPatient.id,
      doctorOrders: 'Continue IV antibiotics. Daily wound dressing. Monitor RBS 6-hourly.',
      medicationsPrescribed: 'Amoxicillin-Clavulanate 625mg TDS, Metformin 500mg BD, Amlodipine 5mg OD, Paracetamol 500mg SOS',
      ivFluidsInstructions: 'NS 0.9% at 100mL/hr. Review after 500mL.',
      specialInstructions: 'Strict diabetic diet. Leg elevation. Monitor for signs of sepsis.',
      nurseInitials: 'AR',
    },
  })

  await prisma.activityLog.createMany({
    data: [
      { patientId: ipdPatient.id, activityType: 'BedRest', recordedAt: minus12h },
      { patientId: ipdPatient.id, activityType: 'Sitting', recordedAt: minus2h },
    ],
  })

  // ── ICU Patient: ventilator, critical observations ───────────────────────
  const icuPatient = await prisma.patient.create({
    data: {
      name: 'Gopal Krishna Pandey',
      age: 58,
      sex: 'Male',
      department: 'ICU',
      status: 'Admitted',
      diagnosis: 'ARDS post-sepsis, Mechanical Ventilation',
      bedNumber: 'ICU-3',
      ward: 'ICU',
      dateOfAdmission: new Date('2026-06-17T14:00:00'),
    },
  })

  await prisma.ventilatorSupport.create({
    data: {
      patientId: icuPatient.id,
      inUse: true,
      mode: 'IPPV',
      settings: 'FiO₂ 60%, Tidal Volume 450mL, PEEP 8cmH₂O, RR 14/min, I:E ratio 1:2',
    },
  })

  await prisma.oxygenTherapy.create({
    data: {
      patientId: icuPatient.id,
      flowRate: 'FiO₂ 60% via ventilator circuit',
      deliveryMethod: 'Endotracheal Tube',
    },
  })

  await prisma.ecgMonitoring.create({
    data: {
      patientId: icuPatient.id,
      inUse: true,
      notes: 'Continuous cardiac monitoring. Sinus tachycardia HR 118/min. No ST changes.',
    },
  })

  await prisma.vitalSign.createMany({
    data: [
      { patientId: icuPatient.id, temperature: 39.1, pulse: 118, respiration: 14, bp: '88/54', spo2: 88, nurseName: 'Sunita Gurung', recordedAt: now },
      { patientId: icuPatient.id, temperature: 38.9, pulse: 122, respiration: 16, bp: '86/52', spo2: 86, nurseName: 'Sunita Gurung', recordedAt: minus2h },
      { patientId: icuPatient.id, temperature: 39.3, pulse: 125, respiration: 18, bp: '82/50', spo2: 84, nurseName: 'Puja Tamang', recordedAt: minus6h },
    ],
  })

  await prisma.criticalObservation.createMany({
    data: [
      {
        patientId: icuPatient.id,
        suddenChanges: 'SpO₂ dropped to 78%, increased secretions. Desaturation episode lasting 3 minutes.',
        emergencyInterventions: 'Suction performed, FiO₂ increased to 70%, repositioned patient. Doctor notified.',
        nurseName: 'Sunita Gurung',
        recordedAt: minus2h,
      },
      {
        patientId: icuPatient.id,
        suddenChanges: 'BP dropped to 78/48 mmHg. Patient unresponsive to verbal stimuli.',
        emergencyInterventions: 'Rapid fluid bolus 250mL NS given, norepinephrine infusion started per ICU protocol. Intensivist called.',
        nurseName: 'Puja Tamang',
        recordedAt: minus6h,
      },
    ],
  })

  await prisma.medication.createMany({
    data: [
      { patientId: icuPatient.id, drugName: 'Norepinephrine', dose: '0.1 mcg/kg/min', route: 'IV Infusion', timeScheduled: 'Continuous', timeGiven: 'Running', nurseSignature: 'SG' },
      { patientId: icuPatient.id, drugName: 'Meropenem', dose: '1g', route: 'IV', timeScheduled: '08:00', timeGiven: '08:05', nurseSignature: 'SG' },
      { patientId: icuPatient.id, drugName: 'Meropenem', dose: '1g', route: 'IV', timeScheduled: '16:00', timeGiven: null },
    ],
  })

  await prisma.intakeOutput.createMany({
    data: [
      { patientId: icuPatient.id, type: 'Intake', subtype: 'IVFluid', quantity: 500, recordedAt: minus6h },
      { patientId: icuPatient.id, type: 'Intake', subtype: 'IVFluid', quantity: 250, recordedAt: minus2h },
      { patientId: icuPatient.id, type: 'Output', subtype: 'Urine', quantity: 180, recordedAt: minus6h },
      { patientId: icuPatient.id, type: 'Output', subtype: 'Drainage', quantity: 50, recordedAt: minus2h },
    ],
  })

  await prisma.nursingNote.create({
    data: {
      patientId: icuPatient.id,
      shift: 'Morning',
      observations: 'Patient intubated and sedated. On mechanical ventilation IPPV mode. Haemodynamically unstable, on vasopressor support. ETT position confirmed, bilateral air entry present.',
      interventions: 'Hourly vitals monitoring, ETT care done, position change 2-hourly, pressure area care, mouth care done.',
      patientResponse: 'No spontaneous movements. GCS 6T (E1V1M4).',
      nurseName: 'Sunita Gurung',
    },
  })

  console.log('✅ Seed complete!')
  console.log(`   ER patient:  ${erPatient.name} (${erPatient.id})`)
  console.log(`   IPD patient: ${ipdPatient.name} (${ipdPatient.id})`)
  console.log(`   ICU patient: ${icuPatient.name} (${icuPatient.id})`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
