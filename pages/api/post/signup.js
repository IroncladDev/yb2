import nc from 'next-connect';
import { createPassword, sendEmail, vfEmail, bs4 } from '../../../scripts/server/util.js'
import { User } from '../../../scripts/server/mongo.js'
import { verify } from 'hcaptcha';

const app = nc();

app.post(async (req, res) => {
  let captchaValid = await verify(process.env.HC_SECRET, req.body['h-captcha-response']);
  console.log(captchaValid)
  if (captchaValid.success) {
    let password = createPassword(req.body.password);
    let newUser = new User({
      username: req.body.username,
      email: req.body.email,
      hash: password.hash,
      salt: password.salt,
      displayName: req.body.username,
      sid: bs4(req.body.username) + "." + Date.now().toString(36) + "." + Math.random().toString(36).slice(2)
    });
    newUser.save()
    await sendEmail(req.body.email, "YouBarter - Verify your account", vfEmail(req.headers.host + "/api/get/verify?sid=" + newUser.sid));
    res.setHeader('Set-Cookie', [`sid=${newUser.sid}; path=/; Max-Age=${1000 * 60 * 60 * 24 * 365 * 10}`, `verified=0; path=/; Max-Age=${1000 * 60 * 60 * 24 * 365 * 10}`]);
    res.redirect("/verify");
  } else {
    res.json({
      success: false,
      message: "Invalid Captcha.  Please try again."
    })
  }
})

export default app;