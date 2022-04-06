import nc from 'next-connect';
import { limiter, createPassword } from '../../../scripts/server/util.js'
import { User } from '../../../scripts/server/mongo.js'
const app = nc();

app.use(limiter(1000 * 60 * 60, 5, (req, res) => {
  res.status(429).json({
    success: false,
    message: "Too many password reset attempts"
  })
}))

app.post(async (req, res) => {
  let user = await User.findOne({sid: req.body.token});
  if(user){
    let newpsw = createPassword(req.body.password);
    user.salt = newpsw.salt;
    user.hash = newpsw.hash;
    user.save();
    res.json({
      success: true
    })
  }else{
    res.json({
      success: false,
      message: "Please make sure you have the correct confirmation link - no user was found."
    })
  }
})

export default app;