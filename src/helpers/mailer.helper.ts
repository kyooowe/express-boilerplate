//#region Import
import nodemailer from 'nodemailer'
import { IMailer } from '../interface/mailer.interface'
//#endregion

const Mailer = async ({ from, to, subject, text, html }: IMailer) => {

    // Reusable transport object using default SMTP
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "johnmarkbrinas@gmail.com",
            pass: "tpkzfciqlfyuomtc"
        }
    });

    
    await transporter.sendMail({
        from: `${from}`,
        to: `${to}`,
        subject: `${subject}`,
        text: `${text}`,
        html: `${html}`
    });
}

export const MailerHelper = {
    Mailer
}