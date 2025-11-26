import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Lazy load API key to prevent startup crashes if missing
const getSendGrid = () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (apiKey) {
        sgMail.setApiKey(apiKey);
        return sgMail;
    }
    return null;
};

export const sendEmail = async (to: string, subject: string, html: string) => {
    const sg = getSendGrid();
    if (!sg) {
        console.warn("SendGrid API Key missing. Email not sent.");
        return false;
    }

    const msg = {
        to,
        from: 'notifications@thepaperstack.io', // Verified sender (needs to be set up in SendGrid)
        subject,
        html,
    };

    try {
        await sg.send(msg);
        console.log(`Email sent to ${to}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

export const sendVendorEmail = async (to: string, vendorName: string, message: string) => {
    const subject = `Message from Paperstack regarding ${vendorName}`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Hello ${vendorName},</h2>
            <p>${message}</p>
            <br>
            <p>Sent via <strong>Paperstack</strong> - Construction Document Management</p>
        </div>
    `;
    return sendEmail(to, subject, html);
};

export const sendWeeklyTaxSummary = async (to: string, savings: number, docCount: number) => {
    const subject = `Your Weekly Tax Savings Summary 💰`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1 style="color: #006FEE;">Weekly Tax Report</h1>
                <p>Here is your tax optimization summary for this week:</p>
                
                <div style="margin: 20px 0; padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
                    <h2 style="margin: 0; color: #006FEE;">$${savings.toFixed(2)}</h2>
                    <p style="margin: 5px 0 0 0; color: #666;">Potential Tax Deductions Found</p>
                </div>

                <p>You processed <strong>${docCount} documents</strong> this week.</p>
                <p>Keep uploading to maximize your year-end savings!</p>
                
                <br>
                <a href="https://thepaperstack.io/dashboard" style="background-color: #006FEE; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
            </div>
        </div>
    `;
    return sendEmail(to, subject, html);
};
