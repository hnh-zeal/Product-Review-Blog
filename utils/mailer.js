const dotenv = require("dotenv");
dotenv.config();

const nodemailer = require("nodemailer");

// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SG_KEY);

// const sendSGMail = async ({
//   recipient,
//   sender,
//   subject,
//   html,
//   text,
//   attachments,
// }) => {
//   try {
//     const from = sender || "htetnainghein2001@gmail.com";
//     const msg = {
//       to: recipient, // email of the recipient,
//       from: from, // verified sender
//       subject,
//       html: html,
//       text: text,
//       attachments,
//     };

//     return sgMail.send(msg);
//   } catch (error) {
//     console.log("Error", error);
//   }
// };

const developmentTransporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  // logger: true,
  // debug: true,
  secureConnection: false,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PWD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

const production_Transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PWD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

const sendEmail = async (
  { from, to, subject, html, text, attachments },
  status
) => {
  const from_email = from || "htetnainghein2001@gmail.com";

  const msg = {
    from: from_email,
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
    attachments,
  };

  if (status === "development") {
    await developmentTransporter.sendMail(msg, (error, info) => {
      if (error) {
        return console.log(error);
      }
      // console.log("Message sent: %s", info.messageId);
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  } else {
    await production_Transporter.sendMail(msg, (error) => {
      if (error) {
        return console.log(error);
      }
    });
  }
};

exports.sendEmail = async (args) => {
  // return new Promise.resolve();
  return sendEmail(args, process.env.NODE_ENV);
};
