import nc from 'next-connect';
import {User} from '../../../scripts/server/mongo.js';
const app = nc();

app.get(async (req, res) => {
  let userQuery = await User.findOne(req.query);
  if(userQuery){
    let userQSecured = userQuery.toObject();
    delete userQSecured.salt;
    delete userQSecured.hash;
    delete userQSecured.sid;
    delete userQSecured._id;
    res.json(userQSecured);
  }else{
    res.json(false)
  }
})

export default app;