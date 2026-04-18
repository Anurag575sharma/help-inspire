const https = require("https");
const nodemailer = require("nodemailer");

function buildHtml({ donorName, amount, campaignTitle, paymentId }) {
  return `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fffbeb; border: 1px solid #f59e0b; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #92400e, #b45309); padding: 24px; text-align: center;">
        <h1 style="color: #fef3c7; margin: 0; font-size: 22px;">🙏 Hare Krishna, ${donorName}!</h1>
        <p style="color: #fde68a; margin: 8px 0 0; font-size: 14px;">Thank you for your generous donation</p>
      </div>
      <div style="padding: 24px;">
        <p style="color: #78350f; font-size: 15px; line-height: 1.6;">
          We are grateful for your kind contribution to <strong>${campaignTitle}</strong> at ISKCON Ujjain.
          May Lord Krishna bless you abundantly for your seva.
        </p>
        <div style="background: white; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="color: #92400e; margin: 0 0 12px; font-size: 16px;">Donation Details</h3>
          <table style="width: 100%; font-size: 14px; color: #78350f;">
            <tr><td style="padding: 6px 0; font-weight: bold;">Donor Name</td><td style="text-align: right;">${donorName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Amount</td><td style="text-align: right; font-size: 18px; color: #b45309; font-weight: bold;">₹${amount.toLocaleString("en-IN")}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Campaign</td><td style="text-align: right;">${campaignTitle}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Payment ID</td><td style="text-align: right; font-size: 12px;">${paymentId}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Date</td><td style="text-align: right;">${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</td></tr>
          </table>
        </div>
        <p style="color: #92400e; font-style: italic; font-size: 13px; text-align: center; margin: 20px 0; line-height: 1.5;">
          "If you simply give some contribution to spreading this Krishna consciousness movement,<br/>
          you get a permanent credit. It will never be lost."<br/>
          <strong>— Srila Prabhupada</strong>
        </p>
      </div>
      <div style="background: #92400e; padding: 16px; text-align: center; color: #fde68a; font-size: 12px;">
        <p style="margin: 0;">ISKCON Ujjain · Sri Sri Radha Madanmohan Mandir</p>
        <p style="margin: 4px 0 0;">35–37 Hare Krishna Land, Bharatpuri, Ujjain, MP – 456010</p>
        <p style="margin: 4px 0 0;">📞 +91 76929 32955 · ✉️ info@iskconujjain.com</p>
      </div>
    </div>
  `;
}

// Send via Resend using Node https module
function sendViaResend({ donorName, donorEmail, amount, campaignTitle, paymentId }) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      from: "ISKCON Ujjain <onboarding@resend.dev>",
      to: donorEmail,
      subject: `🙏 Hare Krishna! Donation Receipt – ₹${amount.toLocaleString("en-IN")}`,
      html: buildHtml({ donorName, amount, campaignTitle, paymentId }),
    });

    const req = https.request(
      {
        hostname: "api.resend.com",
        path: "/emails",
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          const parsed = JSON.parse(data);
          if (parsed.id) {
            console.log(`Receipt sent via Resend to ${donorEmail}`);
            resolve();
          } else {
            reject(new Error(data));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// Send via Gmail SMTP
async function sendViaSmtp({ donorName, donorEmail, amount, campaignTitle, paymentId }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: `"ISKCON Ujjain" <${process.env.EMAIL_USER}>`,
    to: donorEmail,
    subject: `🙏 Hare Krishna! Donation Receipt – ₹${amount.toLocaleString("en-IN")}`,
    html: buildHtml({ donorName, amount, campaignTitle, paymentId }),
  });
  console.log(`Receipt sent via SMTP to ${donorEmail}`);
}

// Main — tries SMTP first, falls back to Resend
async function sendDonationReceipt(params) {
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendViaSmtp(params);
    } else if (process.env.RESEND_API_KEY) {
      await sendViaResend(params);
    } else {
      console.log("No email provider configured, skipping receipt.");
    }
  } catch (err) {
    console.error("Email failed:", err.message);
  }
}

module.exports = { sendDonationReceipt };
