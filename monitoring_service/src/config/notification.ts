import { Resend } from "resend";
import { getEmailTemplate } from "./emailTemplate";
import axios from "axios";
import { config } from "dotenv";
import { logger } from "./logs";
config();
export async function sendNotification(
  currentStatus: "UP" | "DOWN",
  domain: string,
  urlId: string
) {
  // get user-email
  try {
    const res = await axios.get(
      `${process.env.URL_SERVICE_URL}/user/internal/get-user?urlId=${urlId}`
    );
    const user = res.data.data.user;

    const totalAlert: number = currentStatus == "DOWN" ? 2 : 1;

    for (let index = 0; index < totalAlert; index++) {
      await sendEmail(currentStatus, user.email, domain);
    }
  } catch (error) {
    return null;
  }
}

async function sendEmail(
  emailType: "UP" | "DOWN",
  emailId: string,
  domain: string 
) {
  const resend = new Resend(process.env.RESEND_API_KEY as string);
  const subject =
    emailType == "DOWN" ? `${domain} seems down ` : `${domain} is UP now`;
  const body = getEmailTemplate(emailType, domain);
  const { data, error } = await resend.emails.send({
    from: "Alert <alert@sitewatch.tech>",
    to: [emailId],
    subject: subject,
    html: body,
  });

  if (error) {
    logger.error({ error });
  }


}
