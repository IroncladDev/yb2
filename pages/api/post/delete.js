import nc from 'next-connect';
import { sendEmail, classicEmail, limiter } from '../../../scripts/server/util.js';
import { authUser } from '../../../scripts/server/auth.js';
import { Service } from '../../../scripts/server/mongo.js';

const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (user) => {
    const findService = await Service.findOne({ _id: req.body.id });
    if(findService.author.username === user.username || user.admin) {
      await findService.remove();
      res.json({
        success: true
      })
    }else{
      res.json({
        success: false,
        message: "You can't delete someone else's listing!"
      })
    }
  })
})

export default app;