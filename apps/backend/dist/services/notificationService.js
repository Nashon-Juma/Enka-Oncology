"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAppointmentReminder = exports.sendSMSReminder = exports.sendEmailReminder = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const twilio_1 = __importDefault(require("twilio"));
const config_1 = require("../utils/config");
if (config_1.config.email.sendgridApiKey) {
    mail_1.default.setApiKey(config_1.config.email.sendgridApiKey);
}
const twilioClient = config_1.config.sms.twilioAccountSid ?
    (0, twilio_1.default)(config_1.config.sms.twilioAccountSid, config_1.config.sms.twilioAuthToken) : null;
const sendEmailReminder = async (to, subject, html) => {
    if (!config_1.config.email.sendgridApiKey) {
        console.log('Email service not configured. Would send:', { to, subject, html });
        return;
    }
    try {
        await mail_1.default.send({
            to,
            from: config_1.config.email.fromEmail,
            subject,
            html,
        });
    }
    catch (error) {
        console.error('Send email error:', error);
        throw error;
    }
};
exports.sendEmailReminder = sendEmailReminder;
const sendSMSReminder = async (to, message) => {
    if (!twilioClient || !config_1.config.sms.twilioPhoneNumber) {
        console.log('SMS service not configured. Would send:', { to, message });
        return;
    }
    try {
        await twilioClient.messages.create({
            body: message,
            from: config_1.config.sms.twilioPhoneNumber,
            to,
        });
    }
    catch (error) {
        console.error('Send SMS error:', error);
        throw error;
    }
};
exports.sendSMSReminder = sendSMSReminder;
const sendAppointmentReminder = async (email, phone, appointment) => {
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
        await (0, exports.sendEmailReminder)(email, subject, html);
    }
    if (phone) {
        await (0, exports.sendSMSReminder)(phone, smsMessage);
    }
};
exports.sendAppointmentReminder = sendAppointmentReminder;
//# sourceMappingURL=notificationService.js.map