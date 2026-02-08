import nodemailer from 'nodemailer'
;
;// Email configuration using environment variables
const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig)

// Email templates
const emailTemplates = {
  appointmentConfirmation: {
    subject: 'Appointment Confirmation - Glad Tidings',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .detail-label { font-weight: bold; color: #6b7280; }
          .detail-value { color: #111827; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .btn { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 Glad Tidings</h1>
            <p>Appointment Confirmation</p>
          </div>
          <div class="content">
            <p>Dear ${data.userName},</p>
            <p>Thank you for booking an appointment with us. Your appointment has been received and is currently pending approval.</p>
            
            <div class="appointment-details">
              <h3>Appointment Details</h3>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${data.serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${data.formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${data.appointmentTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="status-badge status-pending">Pending</span>
              </div>
              ${data.notes ? `
              <div class="detail-row">
                <span class="detail-label">Notes:</span>
                <span class="detail-value">${data.notes}</span>
              </div>
              ` : ''}
            </div>
            
            <p>You will receive another email once your appointment is approved by our team.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">View Dashboard</a>
            </div>
            
            <div class="footer">
              <p>If you have any questions, please contact us at support@gladtidings.com</p>
              <p>© 2026 Glad Tidings. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  appointmentApproval: {
    subject: 'Appointment Approved - Glad Tidings',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Approved</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .detail-label { font-weight: bold; color: #6b7280; }
          .detail-value { color: #111827; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status-approved { background: #d1fae5; color: #065f46; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .btn { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .success-icon { font-size: 48px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 Glad Tidings</h1>
            <p>Appointment Approved</p>
          </div>
          <div class="content">
            <div style="text-align: center;">
              <div class="success-icon">✅</div>
            </div>
            <p>Dear ${data.userName},</p>
            <p>Great news! Your appointment has been approved and confirmed.</p>
            
            <div class="appointment-details">
              <h3>Confirmed Appointment Details</h3>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${data.serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${data.formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${data.appointmentTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="status-badge status-approved">Approved</span>
              </div>
              ${data.notes ? `
              <div class="detail-row">
                <span class="detail-label">Notes:</span>
                <span class="detail-value">${data.notes}</span>
              </div>
              ` : ''}
            </div>
            
            <p>Please arrive 10 minutes before your scheduled appointment time. If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">View Appointment</a>
            </div>
            
            <div class="footer">
              <p>If you have any questions, please contact us at support@gladtidings.com</p>
              <p>© 2026 Glad Tidings. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  appointmentCancellation: {
    subject: 'Appointment Cancelled - Glad Tidings',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Cancelled</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .detail-label { font-weight: bold; color: #6b7280; }
          .detail-value { color: #111827; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status-cancelled { background: #fee2e2; color: #991b1b; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .btn { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .cancel-icon { font-size: 48px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 Glad Tidings</h1>
            <p>Appointment Cancelled</p>
          </div>
          <div class="content">
            <div style="text-align: center;">
              <div class="cancel-icon">❌</div>
            </div>
            <p>Dear ${data.userName},</p>
            <p>Your appointment has been cancelled${data.cancelledBy === 'admin' ? ' by our team' : ' at your request'}.</p>
            
            <div class="appointment-details">
              <h3>Cancelled Appointment Details</h3>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${data.serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${data.formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${data.appointmentTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="status-badge status-cancelled">Cancelled</span>
              </div>
              ${data.reason ? `
              <div class="detail-row">
                <span class="detail-label">Reason:</span>
                <span class="detail-value">${data.reason}</span>
              </div>
              ` : ''}
            </div>
            
            <p>We apologize for any inconvenience. You can book a new appointment at your convenience through our dashboard.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/appointments" class="btn">Book New Appointment</a>
            </div>
            
            <div class="footer">
              <p>If you have any questions, please contact us at support@gladtidings.com</p>
              <p>© 2026 Glad Tidings. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Service name mapping
const serviceNames = {
  consultation: 'Natural Health Consultation',
  'follow-up': 'Follow-up Appointment',
  workshop: 'Wellness Workshop',
  detox: 'Detox Program',
  counseling: 'Spiritual Counseling'
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
};

// Send email function
export async function sendEmail(to, template, data) {
  try {
    // Validate email configuration
    if (!emailConfig.host || !emailConfig.auth.user || !emailConfig.auth.pass) {
      throw new Error('Email configuration is missing. Please check environment variables.')
    }

    const templateData = {
      ...data,
      serviceName: serviceNames[data.serviceType] || data.serviceType,
      formattedDate: formatDate(data.appointmentDate)
    }

    const mailOptions = {
      from: `"Glad Tidings" <${emailConfig.auth.user}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: emailTemplates[template].subject,
      html: emailTemplates[template].html(templateData)
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

// Specific email functions
export async function sendAppointmentConfirmation(userEmail, userName, appointmentData) {
  return await sendEmail(userEmail, 'appointmentConfirmation', {
    userName,
    ...appointmentData
  })
}

export async function sendAppointmentApproval(userEmail, userName, appointmentData) {
  return await sendEmail(userEmail, 'appointmentApproval', {
    userName,
    ...appointmentData
  })
}

export async function sendAppointmentCancellation(userEmail, userName, appointmentData, cancelledBy = 'user', reason = '') {
  return await sendEmail(userEmail, ';appointmentCancellation', {
    userName,
    cancelledBy,
    reason,
    ...appointmentData
  })
}

// Test email configuration
export async function testEmailConfiguration() {
  try {
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
};
