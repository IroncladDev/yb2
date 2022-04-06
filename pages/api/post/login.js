import nc from 'next-connect';
import { authenticate } from '../../../scripts/server/auth.js'
import { User } from '../../../scripts/server/mongo.js'
const app = nc();

app.post(async (req, res) => {
  let findUser = (await User.findOne({username: req.body.username}) ?? await User.findOne({email: req.body.username})) || false;
  if (findUser) {
    let passwordCorrect = await authenticate(findUser.username, req.body.password);
    if (passwordCorrect) {
      if (findUser.verified) {
        res.setHeader('Set-Cookie', [`sid=${findUser.sid}; path=/; Max-Age=${1000 * 60 * 60 * 24 * 365 * 10}`]);
        res.redirect("/dashboard");
      } else {
        res.setHeader('Set-Cookie', [`sid=${findUser.sid}; path=/; Max-Age=${1000 * 60 * 60 * 24 * 365 * 10}`, `verified=0;path=/;Max-Age=${1000 * 60 * 60 * 24 * 365 * 10}`]);
        res.redirect("/verify");
      }
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/signup")
  }
})

export default app;