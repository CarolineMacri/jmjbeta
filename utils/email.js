const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");

// UTILS
const logger = require("../utils/logger");

// new Email (user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    if (process.env.NODE_ENV.toLowerCase() == "production") {
      const transporter = nodemailer.createTransport({
        host: process.env.JMJCOOP_HOST,
        port: process.env.JMJCOOP_PORT,
        auth: {
          user: process.env.JMJCOOP_USERNAME,
          pass: process.env.JMJCOOP_PASSWORD,
        },
      });
      logger.log("_______________New Transport - production");
      logger.log(
        process.env.JMJCOOP_HOST,
        process.env.JMJCOOP_PORT,
        process.env.JMJCOOP_USERNAME,
        process.env.EMAIL_FROM
      );

      transporter.verify(function (error, success) {
        if (error) {
          console.log("Transporter" + error);
          logger.log("Transporter" + error);
        } else {
          console.log("JMJ coop is ready to take our messages");
          logger.log("JMJ coop is ready to take our messages");
        }
      });
      return transporter;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.log("Transporter" + error);
        logger.log("Transporter" + error);
      } else {
        console.log("Mailtrap is ready to take our messages");
        logger.log("Mailtrap is ready to take our messages");
      }
    });
    return transporter;
  }

  async send(template, subject) {
    //1) render the html based on a put template and
    const html = pug.renderFile(
      __dirname + "/../views/email/" + template + ".pug",
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    //2) define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // create a transport and send email
    const transporter = this.newTransport();
    await transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the JMJ Co-op");
  }

  async sendPasswordReset() {
    console.log("---------------------------------IN Passowrd reset");
    logger.log("---------------------------------IN Passowrd reset");
    await this.send(
      "passwordReset",
      "Your password reset token (valid for 10 minutes"
    );
  }
};
