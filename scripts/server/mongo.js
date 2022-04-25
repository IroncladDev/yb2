import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, index: true }, //username
  displayName: { type: String, index: true }, //nickname
  email: { type: String, index: true }, //email
  bio: { type: String, index: true, default: "" }, //bio
  image: { type: String, index: true, default: "/images/user.png" }, //pfp url
  salt: { type: String, index: true }, //salt
  hash: { type: String, index: true }, //hash
  sid: { type: String, index: true }, //token (uuid)
  verified: { type: Boolean, index: true, default: false }, //verified
  admin: { type: Boolean, index: true, default: false },
  addr: { type: String, index: true }, //address
  banned: { type: Boolean, index: true, default: false }
})
const serviceSchema = new mongoose.Schema({
  title: { type: String, index: true }, // Title
  tags: { type: Array, index: true }, // category
  typeBool: { type: Boolean, index: true, default: false }, // f = goods, t = services
  description: { type: String, index: true }, // description
  location: { type: String, index: true }, // location
  author: { type: Object, index: true }, // author info (full name, contact info, avatar)
})

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

export { User, Service }