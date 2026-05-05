export function generateEmailTemplate(
  templateName: string,
  templateData: Record<string, any>
): string {
  // FoodHub professional, fresh, appetizing theme
  const COLORS = {
    brand: "#ff5722", // main accent (carrot orange)
    highlight: "#ffe082", // highlight (lemon yellow)
    leaf: "#43a047", // green (fresh herb/leaf)
    background: "#f9fafc", // light, airy
    card: "#fffefb", // card background, light warm
    border: "#e0e0e0", // subtle border
    heading: "#2d2a31", // deep food brown/gray
    text: "#41392e", // appetizing brown
    subtext: "#7e7465", // muted brown
    error: "#e64a19", // for missing OTP, accent red-orange
    shadow: "rgba(255, 87, 34, 0.10)" // orange tint shadow
  };

  switch (templateName) {
    case "otp":
      return `
        <html>
          <body style="margin:0;padding:0;background:${COLORS.background};font-family:'Segoe UI','Montserrat',Arial,sans-serif;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:${COLORS.card};margin:48px auto 0 auto;border-radius:16px;box-shadow:0 10px 42px ${COLORS.shadow};border:1px solid ${COLORS.border};overflow:hidden;">
              <tr>
                <td style="padding:3em 2.2em 1.2em 2.2em;">
                  <div style="text-align:center;">
                    <img src="https://images.pexels.com/photos/36982119/pexels-photo-36982119.jpeg" alt="bitebase" height="54" style="display:block;margin:0 auto 18px auto;border-radius:10px;box-shadow:0 2px 10px #f3d2b0;"/>
                    <h1 style="margin:0 0 10px 0;font-size:2.1em;font-weight:800;letter-spacing:-1px;color:${COLORS.brand};line-height:1.16;">
                      bitebase Secure Verification
                    </h1>
                    <span style="display:inline-block;margin:0 auto 8px auto;font-size:1.19em;color:${COLORS.leaf};font-weight:700;">
                      One Step Away From Tasty Journeys!
                    </span>
                  </div>
                  <div style="margin:32px 0 22px 0;border-radius:15px;padding:28px 0;background:linear-gradient(92deg,#fff9ee 55%,${COLORS.highlight} 120%);border:1.5px dashed ${COLORS.brand};text-align:center;box-shadow:0 3px 22px #ffe9d5;">
                    <span style="
                      display:inline-block;
                      font-size:2.3em;
                      font-family:'Space Mono',monospace;
                      color:${COLORS.card};
                      background:linear-gradient(89deg,${COLORS.leaf} 14%,${COLORS.brand} 110%);
                      border-radius:10px;
                      padding:15px 56px;
                      font-weight:900;
                      letter-spacing:0.22em;
                      box-shadow:0 4px 18px 0 rgba(255,87,34,0.09);
                      ">
                      ${templateData.otp ? escapeStr(templateData.otp) : `<span style="color:${COLORS.error}">•••••••</span>`}
                    </span>
                  </div>
                  <p style="color:${COLORS.text};font-size:1.32em;line-height:1.66;margin:20px 0 24px 0;font-weight:500;">
                    Hi${templateData.name ? ` <b>${escapeStr(templateData.name)}</b>,` : ','}<br/>
                    Welcome to bitebase! Please enter the above code to verify your email and continue to delightful food experiences.
                  </p>
                  <ul style="font-size:1em;color:${COLORS.subtext};margin:0 0 40px 14px;padding:0;">
                    <li style="margin-bottom:7px;">This OTP is valid for a limited time, so complete your verification promptly.</li>
                    <li style="margin-bottom:7px;">Keep your code confidential for account security.</li>
                  </ul>
                  
                </td>
              </tr>
              <tr>
                <td style="background:${COLORS.background};padding:1.3em 2.4em 1.38em 2.4em;text-align:center;border-top:1px solid ${COLORS.border};">
                  <span style="color:${COLORS.subtext};font-size:1.02em;">
                    If you did not request this, simply ignore this email.<br/>
                    Enjoy fresh discoveries with <strong style="color:${COLORS.brand}">bitebase</strong>!
                  </span>
                  <div style="margin-top:15px;">
                    <span style="font-size:0.95em;color:#b6b2ad;">
                      &copy; ${new Date().getFullYear()} bitebase. All rights reserved.
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    default:
      return `
        <html>
          <body style="margin:0;padding:0;background:${COLORS.background};font-family:'Segoe UI','Montserrat',Arial,sans-serif;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:${COLORS.card};margin:48px auto 0 auto;border-radius:16px;box-shadow:0 10px 42px ${COLORS.shadow};border:1px solid ${COLORS.border};overflow:hidden;">
              <tr>
                <td style="padding:2.6em 2.4em 1.5em 2.4em;">
                  <div style="text-align:center;">
                    <img src="https://images.pexels.com/photos/36982119/pexels-photo-36982119.jpeg" alt="bitebase" height="48" style="display:block;margin:0 auto 24px auto;border-radius:10px;box-shadow:0 2px 10px #f3d2b0;" />
                  </div>
                  <h2 style="margin:0 0 10px 0;color:${COLORS.leaf};font-size:2.05em;font-weight:800;letter-spacing:-1px;text-align:center;">
                    bitebase Notification
                  </h2>
                  <span style="display:block;font-size:1.16em;color:${COLORS.brand};margin-bottom:12px;text-align:center;font-weight:600;">
                    Discover. Taste. Enjoy.
                  </span>
                  <p style="font-size:1.10em;color:${COLORS.text};margin:12px 0 27px 0;text-align:center;">
                    You’ve received a system message from bitebase.
                  </p>
                  <div style="border:1px solid ${COLORS.border};border-radius:11px;padding:20px 22px;background:#fcf8ee;">
                    <p style="color:${COLORS.text};font-size:1.07em;line-height:1.7;margin:8px 0;">
                      This is an automated notification. For more delicious updates, visit bitebase and enjoy a world of experiences!
                    </p>
                  </div>
                  <div style="margin:42px 0 16px 0;text-align:center;">
                    <a href="https://foodhub.app" target="_blank" style="
                      display:inline-block;
                      background:linear-gradient(90deg,${COLORS.leaf},${COLORS.brand});
                      color:white;
                      font-weight:700;
                      font-size:1.06em;
                      padding:11px 38px;
                      border-radius:8px;
                      text-decoration:none;
                      box-shadow:0 3px 12px 0 rgba(255,87,34,0.08);
                      border:none;">
                      Go to bitebase
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:${COLORS.background};padding:1.28em 2em 1.26em 2em;text-align:center;border-top:1px solid ${COLORS.border};">
                  <span style="color:${COLORS.subtext};font-size:0.97em;">
                    Thank you for being part of <strong style="color:${COLORS.brand}">bitebase</strong>.
                  </span>
                  <div style="margin-top:13px;">
                    <span style="font-size:0.92em;color:#b6b2ad;">
                      &copy; ${new Date().getFullYear()} bitebase. All rights reserved.
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
  }
}

// Escapes unsafe strings for html safety.
function escapeStr(str: string): string {
  return str.replace(/[&<>"'`]/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
    "`": "&#96;",
  }[m] as string));
}