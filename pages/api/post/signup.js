import nc from 'next-connect';
import { createPassword, sendEmail, vfEmail, bs4, limiter } from '../../../scripts/server/util.js'
import { User } from '../../../scripts/server/mongo.js'
import { verify } from 'hcaptcha';
import requestIp from 'request-ip';
import md5 from 'md5';

const app = nc();

app.use(limiter(1000 * 60 * 60 * 6, 5, (req, res) => {
  res.status(429).json({
    success: false,
    message: "Too many signups, please try again later."
  })
}))

app.post(async (req, res) => {
  let captchaValid = await verify(process.env.HC_SECRET, req.body['h-captcha-response']);
  if (captchaValid.success) {
    let findUserBanned = await User.findOne({ addr: md5(requestIp.getClientIp(req)), banned: true });
    if (findUserBanned) {
      res.json({
        success: false,
        message: "It seems as though you have been banned from YouBarter in the past.  Creating an account for ban evasion is not allowed.  If you would like to appeal, please contact us at contact@youbarter.us.  Thank you."
      })
    } else {
      let userExists = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
      if (userExists) {
        res.json({
          success: false,
          message: "Username or email already exists."
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
    }
  } else {
    res.json({
      success: false,
      message: "Invalid Captcha.  Please try again."
    })
  }
})

export default app;