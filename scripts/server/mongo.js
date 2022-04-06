import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, index: true }, //username
  displayName: { type: String, index: true }, //nickname
  email: { type: String, index: true }, //email
  bio: { type: String, index: true, default: "" }, //bio
  address: { type: String, index: true }, //address
  phone: { type: Number, index: true }, //phone
  image: { type: String, index: true, default: "/images/user.png" }, //pfp url
  salt: { type: String, index: true }, //salt
  hash: { type: String, index: true }, //hash
  sid: { type: String, index: true }, //token (uuid)
  verified: { type: Boolean, index: true, default: false }, //verified
})
const serviceSchema = new mongoose.Schema({
  title: { type: String, index: true }, // Title
  category: { type: String, index: true }, // category
  typeBool: { type: Boolean, index: true, default: false }, // f = goods, t = services
  description: { type: String, index: true }, // description
  location: { type: Number, index: true, default: 0 }, // location.  0 = home address, 1 = discuss it with me, 2 = remote
  author: { type: String, index: true }, // author _id
  views: { type: Number, index: true, default: 0 }, // views
  rating: { type: Number, index: true, default: 0 }, // rating
  userimg: { type: String, index: true }, //user pfp
  location: { type: String, index: true } // Coordinates
})
const recordSchema = new mongoose.Schema({
  user: { type: String, index: true }, // username
  type: { type: Number, index: true }, // 0 view, 1 like, 2 offer, 3 report
  at: { type: String, index: true }, // id for a service, etc
  date: { type: String, index: true }, // day*year created
  content: { type: String, index: true } // content
})
const reviewSchema = new mongoose.Schema({ 
  username: { type: String, index: true }, // username
  userimg: { type: String, index: true }, // user pfp
  value: { type: Number, index: true }, // value (stars)
  title: { type: String, index: true }, // title
  body: { type: String, index: true }, // String
  verified: { type: Boolean, index: true, default: false },
  review: { type: String, index: true }, //id of REVIEW FOR
})

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);
const Record = mongoose.models.Record || mongoose.model("Record", recordSchema);
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

export { User, Service, Record, Review }