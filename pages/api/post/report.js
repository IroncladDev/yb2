import nc from 'next-connect';
import { sendEmail } from '../../../scripts/server/util.js';
import { authUser } from '../../../scripts/server/auth.js';
import { Log } from '../../../scripts/server/mongo.js';

const app = nc();

app.use(limiter(1000 * 60 * 60, 5, (req, res) => {
  res.status(429).json({
    success: false,
    message: "You can only report up to five listings an hour."
  })
}))

app.post(async (req, res) => {
  authUser(req, res, async (user) => {
    await sendEmail(process.env.CONTACT, "User Report", `A user reported a good/service for this reason: "${req.body.reason}".\n\nLink to service: https://youbarter.us/home?srv=${req.body.id}`);
    let newLog = new Log({
      moderator: null,
      user: user.username,
      content: rea.body.reason,
      type: "report"
    });
    await newLog.save();
    res.json({
      success: true
    })
  })
})

export default app;