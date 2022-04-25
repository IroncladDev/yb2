import nc from 'next-connect';
import { authUser } from '../../../scripts/server/auth.js';
import { Service } from '../../../scripts/server/mongo.js';

const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (user) => {
    user.displayName = `${req.body.firstName} ${req.body.lastName}`;
    user.bio = req.body.bio;
    await Service.updateMany({ "author.username": user.username }, { $set: { "author.bio": req.body.bio, "author.displayName": `${req.body.firstName} ${req.body.lastName}` } });
    await user.save();
    res.json({ success: true });
  })
})

export default app;