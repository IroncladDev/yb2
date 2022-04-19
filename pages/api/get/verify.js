import nc from 'next-connect';
import {User} from '../../../scripts/server/mongo.js';
const app = nc();

app.get(async (req, res) => {
  let sid = req.query.sid;
  let findUser = await User.findOne({sid});
  if(findUser){
    findUser.verified = true;
    findUser.save();
    res.status(200);
    res.setHeader('Set-Cookie', [`verified=; path=/; Max-Age=${1}`]);
    res.redirect("/home")
  }else{
    res.status(404).redirect("/signup")
  }
})

export default app;