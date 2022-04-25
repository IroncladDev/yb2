import nc from 'next-connect';
import { authUser } from '../../../scripts/server/auth.js';
import { Service } from '../../../scripts/server/mongo.js';
import {v2 as cloudinary} from 'cloudinary';

const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (user) => {
    cloudinary.uploader.upload(req.body.image, {
      resource_type: "image",
      width: 100,
      height: 100,
      crop: "limit",
      fetch_format: "auto"
    })
      .then(async data => {
        user.image = data.secure_url;
        await Service.updateMany({ "author.username": user.username }, { $set: { "author.image": data.secure_url } });
        await user.save();
        res.json({
          success: true
        })
      })
      .catch(() => {
        res.status(500).json({
          success: false,
          message: 'There was an error uploading your image'
        })
      })
  })
})

export const config = { api: { bodyParser: { sizeLimit: '200mb' } } };
export default app;