// src/emailTemplates/invitationTemplate.ts

export const getInvitationEmailTemplate = (
  senderName: string,
  inviteCode: string,
  email: string
): string => {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://pwa.nicolas-schneider.fr"
      : "http://localhost:3000";
  const invitationLink = `${baseURL}/register?email=${encodeURIComponent(
    email
  )}&inviteCode=${inviteCode}`;

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <html lang="en">
      <head></head>
      <body
        style="
          background-color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
        "
      >
        <table
          align="center"
          role="presentation"
          cellspacing="0"
          cellpadding="0"
          border="0"
          width="100%"
          style="max-width: 37.5em; margin: 0 auto; padding: 20px 0 48px"
        >
          <tr style="width: 100%">
            <td>
              <span
                style="
                  display: flex;
                  font-weight: 700;
                  justify-content: center;
                  font-size: 2rem;
                  line-height: 2rem;
                "
                >You have a new message</span
              >
              <p style="font-size: 16px; line-height: 26px; margin: 32px 16px 0 0">
                Hey there,
              </p>
              <p style="font-size: 16px; line-height: 26px; margin: 16px 0">
                ${senderName} has invited you to a new discussion on our platform.
              </p>
              <p style="font-size: 16px; line-height: 26px; margin: 16px 0">
                Come see the message and start talking with your friends! Simply
                create an account and join the conversation. We're excited to have
                you on board!
              </p>

              <table
                style="text-align: center; margin-top: 32px; margin-bottom: 32px"
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <a
                        href="${invitationLink}"
                        target="_blank"
                        style="
                          background-color: #8b5cf6;
                          border-radius: 3px;
                          color: #fff;
                          font-size: 16px;
                          text-decoration: none;
                          text-align: center;
                          display: inline-block;
                          padding: 12px 12px;
                          line-height: 100%;
                          max-width: 100%;
                        "
                        >Get Started Now!</a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr
                style="
                  width: 100%;
                  border: none;
                  border-top: 1px solid #eaeaea;
                  border-color: #cccccc;
                  margin: 20px 0;
                "
              />
              <p
                style="
                  font-size: 12px;
                  line-height: 24px;
                  margin: 16px 0;
                  color: #8898aa;
                "
              >
                © 2023 Instant Message PWA
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
