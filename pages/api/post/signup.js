import nc from 'next-connect';
import { createPassword, sendEmail, vfEmail, bs4 } from '../../../scripts/server/util.js'
import { User } from '../../../scripts/server/mongo.js'
import { verify } from 'hcaptcha';
import requestIp from 'request-ip';
import md5 from 'md5';

const app = nc();

app.post(async (req, res) => {
  console.log(requestIp.getClientIp(req))
  let captchaValid = await verify(process.env.HC_SECRET, req.body['h-captcha-response']);
  if (captchaValid.success) {
    let findUserBanned = await User.findOne({ addr: md5(requestIp.getClientIp(req)), banned: true });
    console.log(findUserBanned)
    if (findUserBanned) {
      res.json({
        success: false,
        message: "It seems as though you have been banned from YouBarter in the past.  Creating an account for ban evasion is not allowed.  If you would like to appeal, please contact us at contact@youbarter.us.  Thank you."
      })
    } else {
      let password = createPassword(req.body.password);
      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        hash: password.hash,
        salt: password.salt,
        displayName: req.body.username,
        sid: bs4(req.body.username) + "." + Date.now().toString(36) + "." + Math.random().toString(36).slice(2),
        addr: md5(requestIp.getClientIp(req)),
      });
      newUser.save()
      await sendEmail(req.body.email, "YouBarter - Verify your account", await vfEmail(req.headers.host + "/api/get/verify?sid=" + newUser.sid));
      res.setHeader('Set-Cookie', [`sid=${newUser.sid}; path=/; Max-Age=${1000 * 60 * 60 * 24 * 365 * 10}`, `verified=0; path=/; Max-Age=${1000 * 60 * 60 * 24 * 365 * 10}`]);
      res.redirect("/verify");
    }
  } else {
    res.json({
      success: false,
      message: "Invalid Captcha.  Please try again."
    })
  }
})

export default app;