import nc from 'next-connect';
import { limiter, sendEmail, fgEmail } from '../../../scripts/server/util.js'
import { User } from '../../../scripts/server/mongo.js'
const app = nc();

app.use(limiter(1000 * 60 * 60, 5, (req, res) => {
  res.status(429).json({
    success: false,
    message: "Too many password reset attempts"
  })
}))

app.post(async (req, res) => {
  let findUser = await User.findOne({email: req.body.email});
  if(findUser){
    let emailResponse = await sendEmail(req.body.email, "Reset your YouBarter Password", await fgEmail(req.headers.host + "/reset?sid=" + findUser.sid));
    if(emailResponse.success){
      res.json({
        success: true,
      });
    }else{
      res.status(500).json({
        success: false,
        message: "Whoops, our email server encountered an error.  Please try again in a few minutes or contact us."
      })
    }
  }else{
    res.status(404).json({
      success: false,
      message: "We couldn't find a user with that email.  Please check your spelling and make sure you got the right email."
    })
  }
})

export default app;