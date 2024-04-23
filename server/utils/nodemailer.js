const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 25,
  secure: false,
  auth: {
    user: '1c7832a60b277a',
    pass: '1ae3790a9ceb9b',
  },
});

// async..await is not allowed in global scope, must use a wrapper
const mail = async function main(userInfo) {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Bookworm Team 👻" <bookworm@gmail.com>', // sender address
      to: userInfo.mailId, // list of receivers
      subject: 'Subscription', // Subject line
      text: 'You are now subscribed to the bookworm monthly updates. Thanks for choosing Booksworm.', // plain text body
      html: '<b>Team Bookworm</b>', // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  } catch (err) {
    console.error(err);
  }
};

module.exports = { mail };
