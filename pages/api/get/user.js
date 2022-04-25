import nc from 'next-connect';
import { User } from '../../../scripts/server/mongo.js';
const app = nc();

app.get(async (req, res) => {
  let userQuery = await User.findOne(req.query);
  if (userQuery) {
    let userQSecured = userQuery.toObject();
    delete userQSecured.salt;
    delete userQSecured.hash;
    delete userQSecured.sid;
    delete userQSecured.addr;
    delete userQSecured.banned;
    delete userQSecured.admin;
    delete userQSecured.verified;
    delete userQSecured.email;
    delete userQSecured.__v;
    res.json(userQSecured);
  } else {
    res.json(false)
  }
})

export default app;