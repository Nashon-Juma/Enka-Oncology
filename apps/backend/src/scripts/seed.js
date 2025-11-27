require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const { User } = require('../src/models/User');
const { Medication } = require('../src/models/Medication');
const { Symptom } = require('../src/models/Symptom');
const { Appointment } = require('../src/models/Appointment');
const { Document } = require('../src/models/Document');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cancer-care';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Medication.deleteMany({});
    await Symptom.deleteMany({});
    await Appointment.deleteMany({});
    await Document.deleteMany({});

    console.log('🗑️  Cleared existing data');

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

    const caregiverUser = new User({
      email: 'caregiver@example.com',
      password: 'password123',
      firstName: 'Mike',
      lastName: 'Johnson',
      role: 'caregiver',
      phoneNumber: '+1234567893',
    });

    await patientUser.save();
    await clinicianUser.save();
    await caregiverUser.save();

    console.log('👥 Created sample users');

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
    console.log('💊 Created sample medications');

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
    console.log('🤒 Created sample symptoms');

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
    console.log('📅 Created sample appointments');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample user credentials:');
    console.log('   Patient:    patient@example.com / password123');
    console.log('   Clinician:  doctor@example.com / password123');
    console.log('   Caregiver:  caregiver@example.com / password123');
    console.log('\n🚀 You can now start the application with: npm run dev');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📭 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };