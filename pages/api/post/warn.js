import nc from 'next-connect';
import { sendEmail, classicEmail } from '../../../scripts/server/util.js';
import { authUser } from '../../../scripts/server/auth.js';
import { User, Log } from '../../../scripts/server/mongo.js';

const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (user) => {
    if (user.admin) {
      const userToBeWarned = await User.findOne({ username: req.body.user });
      let emailCont = await classicEmail(`You Got a Warning`, `<p>An administrator at YouBarter sent you a warning:</p>
    
      <p>"${req.body.reason}"</p>
      
      <p>Please follow the rules on our site, ignoring any moderator warning will result in the permanent suspension of your youBarter account.</p>
      
      <p>Thank you for being a part of our community.  Have a good day.</p>`);
      await sendEmail(userToBeWarned.email, "A Warning from YouBarter", emailCont);
      let newLog = new Log({
        moderator: user.username,
        user: req.body.username,
        content: req.body.reason,
        type: "admin-warning"
      });
      await newLog.save();
      res.json({
        success: true
      })
    } else {
      res.json({
        success: false,
        message: 'You are not an admin!'
      })
    }
  })
})

export default app;