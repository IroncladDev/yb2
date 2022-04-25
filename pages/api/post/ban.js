import nc from 'next-connect';
import { sendEmail, classicEmail } from '../../../scripts/server/util.js';
import { authUser } from '../../../scripts/server/auth.js';
import { User } from '../../../scripts/server/mongo.js';

const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (user) => {
    if (user.admin) {
      const userToBeWarned = await User.findOne({ username: req.body.user });
      userToBeWarned.banned = true;
      await userToBeWarned.save();
      let emailCont = await classicEmail(`You Have been Banned`, `<p>An administrator has banned you from YouBarter:</p>
    
      <p>"${req.body.reason}"</p>
      
      <p>Unfortunately, our decision was final and your offense was too much for us to let you continue using the site.</p>`);
      await sendEmail(userToBeWarned.email, "YouBarter - You've been banned", emailCont);
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