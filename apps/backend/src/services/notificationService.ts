import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { config } from '../utils/config';

if (config.email.sendgridApiKey) {
  sgMail.setApiKey(config.email.sendgridApiKey);
}

const twilioClient = config.sms.twilioAccountSid ? 
  twilio(config.sms.twilioAccountSid, config.sms.twilioAuthToken) : null;

export const sendEmailReminder = async (to: string, subject: string, html: string): Promise<void> => {
  if (!config.email.sendgridApiKey) {
    console.log('Email service not configured. Would send:', { to, subject, html });
    return;
  }

  try {
    await sgMail.send({
      to,
      from: config.email.fromEmail,
      subject,
      html,
    });
  } catch (error) {
    console.error('Send email error:', error);
    throw error;
  }
};

export const sendSMSReminder = async (to: string, message: string): Promise<void> => {
  if (!twilioClient || !config.sms.twilioPhoneNumber) {
    console.log('SMS service not configured. Would send:', { to, message });
    return;
  }

  try {
    await twilioClient.messages.create({
      body: message,
      from: config.sms.twilioPhoneNumber,
      to,
    });
  } catch (error) {
    console.error('Send SMS error:', error);
    throw error;
  }
};

export const sendAppointmentReminder = async (
  email: string,
  phone: string,
  appointment: any
): Promise<void> => {
  const subject = `Appointment Reminder: ${appointment.title}`;
  const html = `
    <div>
      <h2>Appointment Reminder</h2>
      <p><strong>Title:</strong> ${appointment.title}</p>
      <p><strong>Provider:</strong> ${appointment.provider}</p>
      <p><strong>Location:</strong> ${appointment.location}</p>
      <p><strong>Time:</strong> ${new Date(appointment.startTime).toLocaleString()}</p>
      <p>Please arrive 15 minutes early for your appointment.</p>
    </div>
  `;

  const smsMessage = `Reminder: ${appointment.title} with ${appointment.provider} at ${new Date(appointment.startTime).toLocaleString()}`;

  if (email) {
    await sendEmailReminder(email, subject, html);
  }

  if (phone) {
    await sendSMSReminder(phone, smsMessage);
  }
};