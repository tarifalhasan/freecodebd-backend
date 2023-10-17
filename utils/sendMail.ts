require("dotenv").config();

import ejs from "ejs";
import nodemailer, { Transporter } from "nodemailer";

import path from "path";

interface EmailOptions {
  email: string;
  subject: string;
  data: { [Key: string]: any };
  template: string;
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const t: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMPT_SERVICES,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PAS,
    },
  });

  const { email, subject, data, template } = options;

  //  get path

  const templatePath = path.join(__dirname, "../mails", template);
  const html: string = await ejs.renderFile(templatePath, data);
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: email,
    subject,
    html,
  };

  await t.sendMail(mailOptions);
};

export default sendMail;
