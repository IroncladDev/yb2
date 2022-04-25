import nc from 'next-connect';
import { authUser, authenticate } from '../../../scripts/server/auth.js';
import { Service } from '../../../scripts/server/mongo.js';

const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (user) => {
    let passwordCorrect = await authenticate(user.username, req.body.password);
    if (passwordCorrect) {
      await Service.deleteMany({ "author.username": user.username });
      await user.remove();
      res.setHeader('Set-Cookie', [`sid=; path=/; Max-Age=${1}`, `verified=;path=/;Max-Age=${1}`]);
      res.redirect("/");
    }else{
      res.redirect("/home/settings")
    }


  })
})

export default app;