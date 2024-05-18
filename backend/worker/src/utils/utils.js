const nodemailer = require("nodemailer");
const { MAIL_SERVICE, GMAIL, GMAIL_APP_PASS } = require("../config");
const { List } = require("../db/mongoose");

const transporter = nodemailer.createTransport({
  service: MAIL_SERVICE,
  port: 465,
  secure: true,
  auth: {
    user: GMAIL,
    pass: GMAIL_APP_PASS,
  },
});

const sendEmail = async (listId, emailBody, subject) => {
  try {
    const list = await List.findById(listId).populate("users");
    if (!list) return;

    //todo: distribute this by sending offsets to the consumer
    for (const user of list.users) {
      if (!user.subscribe) return;

      const userProperties = {
        ...user.properties,
        name: user.name,
        email: user.email,
      };

      const userEmailBody = emailBody.replace(
        /\[([^[\]]*)\]/g,
        (match, prop) => userProperties[prop] || "",
      );

      const mailOptions = {
        from: GMAIL,
        to: user.email,
        subject,
        text: userEmailBody,
      };

      await transporter.sendMail(mailOptions);
    }
    return;
  } catch (e) {
    console.log(e);
    return;
  }
};

module.exports = {
  sendEmail,
};
