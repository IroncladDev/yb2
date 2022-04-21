import nc from 'next-connect';
import { Service } from '../../../scripts/server/mongo.js'
import { verify } from 'hcaptcha';
import { authUser } from '../../../scripts/server/auth.js';

const app = nc();

app.post(async (req, res) => {
  let captchaValid = await verify(process.env.HC_SECRET, req.body['h-captcha-response']);
  if (captchaValid.success) {
    authUser(req, res, async (user) => {
      const tags = req.body.tags.split`,`;
      const { title, description, coordinates, gs } = req.body;
      const srv = new Service({
        title,
        description,
        location: coordinates,
        typeBool: gs === "service" ? true : false,
        tags,
        author: {
          username: user.username,
          image: user.image
        }
      })
      await srv.save();
      res.redirect("/home?srv=" + srv._id)
    });
  } else {
    res.json({
      success: false,
      message: "Invalid Captcha.  Please try again."
    })
  }
})

export default app;