import nc from 'next-connect';
import { sendEmail, classicEmail, limiter } from '../../../scripts/server/util.js';
import { authUser } from '../../../scripts/server/auth.js';
import { User, Service } from '../../../scripts/server/mongo.js';

const app = nc();

app.use(limiter(1000 * 60 * 60 * 3, 5, (req, res) => {
  res.status(429).json({
    success: false,
    message: "You're making offers too quickly!  Please wait a few hours before trying again."
  })
}))

app.post(async (req, res) => {
  authUser(req, res, async (user) => {
    const findService = await Service.findOne({ _id: req.body.id });
    const serviceAuthor = await User.findOne({ username: findService.author.username });

    await sendEmail(serviceAuthor.email, `YouBarter - ${user.displayName} made an offer`, await classicEmail(`It's bartering time!`, `<p>${user.displayName} (<a href="${user.email}">${user.email}</a>) has made an offer on your service titled "${findService.title}":</p>
    
<p>"${req.body.value}"</p>

<p>If you would like to get in touch with them, shoot them an email at <a href="mailto:${user.email}">${user.email}</a>.</p>

<hr/>

<p>If this was someone who was not taking or using YouBarter seriously, please send us a <em>detailed</em> report at <a href="mailto:contact@youbarter.us">contact@youbarter.us</a> concerning their email, what they said, and a screenshot of the email.</p>`));
    res.json({
      success: true,
      email: serviceAuthor.email
    })
  })
})

export default app;