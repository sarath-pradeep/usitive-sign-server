import nodemailer from "nodemailer";

/**
 * Sends an email using provided credentials.
 * @param {string} senderEmail - Email address to send from.
 * @param {string} senderPassword - Password for the sender's email account.
 * @param {string} recipientEmail - Recipient's email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Email body content.
 */
export const sendEmail = async (recipientEmail, subject, html) => {
  try {
    // Step 1: Create transporter with dynamic credentials
    const transporter = nodemailer.createTransport({
      service: "gmail", // Replace with a specific email service if needed
      auth: {
        user: "minhajtestfi@gmail.com",
        pass: "kqiu zgtf krod sgmg" // Ensure this is an app-specific password if using Gmail,
      },
    });

    // Step 2: Set email options
    const mailOptions = {
      from: "minhajtestfi@gmail.com",
      to: recipientEmail,
      subject,
      html, // HTML body for rich formatting
    };

    // Step 3: Send the email
    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};