const router = require('express').Router();
const auth = require('../middleware/auth');
const { mail } = require('../utils/nodemailer');

router.route('/mail').post(auth, async (req, res) => {
  const mailTo = req.body.mailTo;
  console.log(mailTo);
  await mail({ mailId: mailTo });
  return res.status(200).json({
    msg: 'Mail sent successfully!',
  });
});

module.exports = router;
