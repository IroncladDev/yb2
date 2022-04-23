import nc from 'next-connect';
import { createPassword, sendEmail, vfEmail, limiter } from '../../../scripts/server/util.js'
import { User } from '../../../scripts/server/mongo.js'

const app = nc();

app.use(limiter(1000 * 60 * 15, 3, (req, res) => {
  res.status(429).json({
    success: false,
    message: "Too many email resends, please try again later.  Take note that emails can take up to half an hour to send."
  })
}))

app.post(async (req, res) => {
  if (req.cookies.sid && req.cookies.verified) {
    let findUser = await User.findOne({ sid: req.cookies.sid });
    if (findUser.verified) {
      res.json({
        success: false,
        message: "You're already verified!"
      })
    } else {
      let emailRes = await sendEmail(findUser.email, "YouBarter - Verify your account", await vfEmail(req.headers.host + "/api/get/verify?sid=" + findUser.sid));
      res.json({
        success: emailRes.success,
        message: emailRes.success ? "Email Sent" : "An error occured on our email server.  Please try again or contact us."
      })
    }
  }else if(req.cookies.sid && !req.cookies.verified){
    res.json({
      success: false,
      message: "It looks as though you are already verified."
    })
  }else{
    res.json({
      success: false,
      message: "Please make sure you've signed up before you try to verify your email."
    })
  }
})

export default app;