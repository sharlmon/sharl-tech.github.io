const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { name, email, phone, message, item_name } = JSON.parse(event.body);
    const selectedPlan = item_name || "General Inquiry";

    // 1. Setup Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // sharlmon19@gmail.com
            pass: process.env.EMAIL_PASS  // App Password
        }
    });

    // Email 1: To Admin (You)
    const mailOptionsAdmin = {
        from: `"Sharl-Tech System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: `🚨 New Signal: ${selectedPlan}`,
        text: `
      NEW TRANSMISSION RECEIVED
      -------------------------
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'N/A'}
      Mission Brief: ${message}
      
      Plan/Service: ${selectedPlan}
    `
    };

    // Email 2: To Client (Them)
    const mailOptionsClient = {
        from: `"SHARL-TECH Command" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Transmission Received: Order Confirmed',
        html: `
      <div style="background-color: #000; color: #ccc; font-family: 'Courier New', monospace; padding: 20px;">
        <h2 style="color: #4ade80;">TRANSMISSION RECEIVED</h2>
        <p>Greetings <strong>${name}</strong>,</p>
        <p>This confirms we have received your request for: <strong style="color: #fff;">${selectedPlan}</strong>.</p>
        
        <div style="border: 1px solid #333; padding: 15px; margin: 20px 0; background: #111;">
          <p style="margin: 5px 0;"><strong>STATUS:</strong> PROCESSING</p>
          <p style="margin: 5px 0;"><strong>REF ID:</strong> #ORD-${Math.floor(Math.random() * 90000)}</p>
        </div>

        <p>Our operatives are currently reviewing your mission requirements. We will establish a secure connection via this frequency shortly.</p>
        
        <hr style="border-color: #333;">
        <p style="font-size: 12px; color: #666;">
          SECURE CONNECTION ENDED.<br>
          SHARL-TECH | Nairobi, Kenya
        </p>
      </div>
    `
    };

    try {
        // Send both emails
        await transporter.sendMail(mailOptionsAdmin);
        await transporter.sendMail(mailOptionsClient);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Emails sent successfully" })
        };
    } catch (error) {
        console.error("Email Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send transmission" })
        };
    }
};
