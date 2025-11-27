const mongoose = require('mongoose');
const { User, Medication, Symptom, Appointment, Document } = require('../apps/backend/src/models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cancer-care';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Medication.deleteMany({});
    await Symptom.deleteMany({});
    await Appointment.deleteMany({});
    await Document.deleteMany({});

    // Create sample users
    const patientUser = new User({
      email: 'patient@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'patient',
      phoneNumber: '+1234567890',
      dateOfBirth: new Date('1980-01-15'),
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+1234567891',
        relationship: 'Spouse',
      },
    });

    const clinicianUser = new User({
      email: 'doctor@example.com',
      password: 'password123',
      firstName: 'Sarah',
      lastName: 'Smith',
      role: 'clinician',
      phoneNumber: '+1234567892',
    });

    await patientUser.save();
    await clinicianUser.save();

    // Create sample medications
    const medications = [
      {
        userId: patientUser._id,
        name: 'Ibuprofen',
        dosage: '200mg',
        frequency: 'every 6 hours as needed',
        startDate: new Date(),
        prescribedBy: 'Dr. Sarah Smith',
        instructions: 'Take with food',
        status: 'active',
      },
      {
        userId: patientUser._id,
        name: 'Oxycodone',
        dosage: '5mg',
        frequency: 'every 4 hours as needed for pain',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        prescribedBy: 'Dr. Sarah Smith',
        instructions: 'Take only for severe pain',
        status: 'active',
      },
    ];

    await Medication.insertMany(medications);

    // Create sample symptoms
    const symptoms = [
      {
        userId: patientUser._id,
        name: 'Headache',
        intensity: 6,
        notes: 'Dull pain in temples',
        location: 'Head',
        duration: 120,
        recordedAt: new Date(),
      },
      {
        userId: patientUser._id,
        name: 'Nausea',
        intensity: 4,
        notes: 'Mild nausea after medication',
        location: 'Stomach',
        recordedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        userId: patientUser._id,
        name: 'Fatigue',
        intensity: 7,
        notes: 'Feeling very tired today',
        recordedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ];

    await Symptom.insertMany(symptoms);

    // Create sample appointments
    const appointments = [
      {
        userId: patientUser._id,
        title: 'Follow-up Consultation',
        description: 'Routine follow-up appointment',
        type: 'consultation',
        provider: 'Dr. Sarah Smith',
        location: 'Oncology Center, Room 205',
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        status: 'scheduled',
        reminders: {
          email: true,
          sms: false,
        },
      },
      {
        userId: patientUser._id,
        title: 'Chemotherapy Session',
        description: 'Weekly chemotherapy treatment',
        type: 'treatment',
        provider: 'Dr. Sarah Smith',
        location: 'Treatment Center, Infusion Room 3',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        status: 'scheduled',
        reminders: {
          email: true,
          sms: true,
        },
      },
    ];

    await Appointment.insertMany(appointments);

    console.log('Database seeded successfully!');
    console.log('Sample user credentials:');
    console.log('Patient: patient@example.com / password123');
    console.log('Clinician: doctor@example.com / password123');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();