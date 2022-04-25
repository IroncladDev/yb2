import { User } from './mongo.js';
import { checkPassword } from './util.js'

export async function authUser(req, res, next) {
  let findUser = await User.findOne({ sid: req.cookies.sid }, { salt: 0, hash: 0, sid: 0, __v: 0, addr: 0 });
  if (findUser) {
    if (findUser.verified && !findUser.banned) {
      next(findUser);
    } else if (findUser.banned) {
      res.setHeader('Set-Cookie', [`sid=; path=/; Max-Age=${1}`, `verified=; path=/; Max-Age=${1}`]);
      res.json({
        success: false,
        message: "Due to abuse of YouBarter, your account has been banned.  If you would like to appeal, please contact us at contact@youbarter.us.  Thank you."
      })
    } else {
      res.status(401).json({
        message: "Please verify your email address",
        success: false
      })
    }
  } else {
    res.setHeader('Set-Cookie', [`sid=; path=/; Max-Age=${1}`, `verified=; path=/; Max-Age=${1}`]);
    res.status(404).json({
      message: "Hmmm, we couldn't verify that you exist in the database.  Please log in or sign up.",
      success: false
    })
  }
};

export async function authenticate(login, password) {
  let findUser = await User.findOne({ $or: [{ username: login }, { email: login }] }, { sid: 1 });
  return checkPassword(password, findUser.salt, findUser.hash) ? findUser.sid : false;
}

export async function clientAuth(req) {
  let findUser = await User.findOne({ sid: req.cookies.sid });
  if (findUser) {
    if (findUser.verified) {
      let userQSecured = findUser.toObject();
      delete userQSecured.salt;
      delete userQSecured.hash;
      delete userQSecured.sid;
      delete userQSecured.addr;
      delete userQSecured.banned;
      delete userQSecured.verified;
      delete userQSecured.__v;
      return userQSecured
    } else {
      return false;
    }
  } else {
    return false;
  }
}