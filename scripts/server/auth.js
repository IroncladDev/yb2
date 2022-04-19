import { User } from './mongo.js';
import { checkPassword } from './util.js'

export async function authUser(req, res, next) {
  let findUser = await User.findOne({ sid: req.cookies.sid });
  if (findUser) {
    if (findUser.verified) {
      next(findUser);
    } else {
      res.status(401).json({
        message: "Please verify your email address",
        success: false
      })
    }
  } else {
    res.status(404).json({
      message: "Hmmm, we couldn't verify that you exist in the database.  Please log in or sign up.",
      success: false
    })
  }
};

export async function authenticate(login, password) {
  let findUser = await User.findOne({ $or: [{username: login}, {email: login}] });
  return checkPassword(password, findUser.salt, findUser.hash) ? findUser.sid : false;
}

export async function clientAuth(req){
  let findUser = await User.findOne({sid: req.cookies.sid});
  if(findUser){
    if(findUser.verified){
      return findUser
    }else{
      return false;
    }
  }else{
    return false;
  }
}