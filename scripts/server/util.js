import requestIp from 'request-ip'
import rateLimit from 'express-rate-limit'
import { User } from './mongo.js';
import crypto from 'crypto'
import inlineCss from 'inline-css';

export function createPassword(password) {
  let salt = crypto.randomBytes(16).toString('hex');
  return {
    salt: salt,
    hash: crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha256').toString('hex'),
  }
}
export function checkPassword(password, salt, hash1) {
  var hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha256').toString('hex');
  return hash1 === hash;
};

export function bs4(string) {
  return Buffer.from(string).toString('base64')
}

export async function sendEmail(to, subject, body) {
  return await fetch("https://api.gmass.co/api/transactional", {
    headers: {
      "Content-Type": "application/json",
      "X-apikey": process.env.GMASS_KEY,
      accept: "*/*"
    },
    method: "POST",
    body: JSON.stringify({
      "transactionalEmailId": Math.random().toString(36).slice(2),
      "fromEmail": process.env.EMAIL,
      "fromName": "YouBarter",
      "to": to,
      "cc": "",
      "bcc": "",
      "subject": subject,
      "message": body
    })
  }).then(r => r.json())
}
export async function classicEmail(title, html) {
  return await inlineCss(`<!DOCTYPE html>
  <html lang="en">
    <head>
    <meta charset="UTF-8">
      <style>
        body{
          background: #a7c4bc;
          margin: 0;
          padding: 50px 0;
          box-sizing: border-box;
          font-family: Bookman Old Style, sans, sans-serif;
        }
        #title{
          font-family: "trebuchet ms", "Arial", sans-serif;
          font-weight: bold;
          text-align: center;
          color: #2f5d62;
          font-size: 3em;
          margin: 0;
          margin-bottom: 30px;
        }
        #body{
          width: 100%;
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 20px;
          min-height: 400px;
        }
        p{
          font-size: 18px;
          color: #555;
          line-height: 30px;
          max-width: 90%;
          position: relative;
          margin: 20px auto;
        }
        .link-btn{
          width: 90%;
          margin-top: 20px;
          margin-bottom: 20px;
          background: #5e8b7e;
          padding: 15px;
          font-size: 25px;
          color: white;
          border-radius: 5px;
          border: none;
          margin-left: 5%;
          
        }
        hr{
          margin: 20px 5%;
          width: 90%;
          border-bottom: none;
          border-top: solid rgb(235,235,235) 1px;
        }
        .center{
          text-align: center;
          color: rgb(180,180,180);
          margin: 10px;
        }
        a{
          color: #5e8b7e !important;
        }
        .block-image{
          width: 90%;
          margin: 5%;
          margin-bottom: 10px;
          border-radius: 5px;
        }
        h2{
          text-align: left;
          margin-top: 20px;
          margin-bottom: 0;
          margin-left: 5%;
          font-size: 30px;
          color: rgb(75, 75, 75);
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div id="body">
        <h1 id="title">${title}</h1>
        ${html}
        <hr>
        <div class="center">&copy; YouBarter® 2022, All Rights Reserved</div>
        <div class="center"><a href="mailto:contact@youbarter.us">contact@youbarter.us</a></div>
      </div>
    </body>
  </html>`, { url: "https://youbarter.us" })
}
export async function vfEmail(link) {
  return await inlineCss(`<!DOCTYPE html>
  <html lang="en">
    <head>
    <meta charset="UTF-8">
      <style>
        body{
          background: #a7c4bc;
          margin: 0;
          padding: 50px 0;
          box-sizing: border-box;
          font-family: Bookman Old Style, sans, sans-serif;
        }
        #title{
          font-family: "trebuchet ms", "Arial", sans-serif;
          font-weight: bold;
          text-align: center;
          color: #2f5d62;
          font-size: 3em;
          margin: 0;
          margin-bottom: 30px;
        }
        #body{
          width: 100%;
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 20px;
          min-height: 400px;
        }
        p{
          font-size: 18px;
          color: #555;
          line-height: 30px;
          max-width: 90%;
          position: relative;
          margin: auto;
        }
        .link-btn{
          width: 90%;
          margin-top: 20px;
          margin-bottom: 20px;
          background: #5e8b7e;
          padding: 15px;
          font-size: 25px;
          color: white;
          border-radius: 5px;
          border: none;
          margin-left: 5%;
          
        }
        hr{
          margin: 20px 5%;
          width: 90%;
          border-bottom: none;
          border-top: solid rgb(235,235,235) 1px;
        }
        .center{
          text-align: center;
          color: rgb(180,180,180);
          margin: 10px;
        }
        a{
          color: #5e8b7e;
        }
        .block-image{
          width: 90%;
          margin: 5%;
          margin-bottom: 10px;
          border-radius: 5px;
        }
        h2{
          text-align: left;
          margin-top: 20px;
          margin-bottom: 0;
          margin-left: 5%;
          font-size: 30px;
          color: rgb(75, 75, 75);
          font-weight: bold;
        }
        a:hover{
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div id="body">
        <h1 id="title">One Step Away!</h1>
        <p>You're almost ready to start Bartering.  Click this link to get started:</p>
        <a href="http://${link}">
          <button class="link-btn">Verify Account</button>
        </a>
        <p>In case the link didn't work, try <a href="http://${link}">http://${link}</a></p>
        <hr>
        <div class="center">&copy; YouBarter® 2022, All Rights Reserved</div>
        <div class="center"><a href="mailto:contact@youbarter.us">contact@youbarter.us</a></div>
      </div>
    </body>
  </html>`, { url: "https://youbarter.us" })
}
export async function fgEmail(link) {
  return await inlineCss(`<!DOCTYPE html>
  <html lang="en">
    <head>
    <meta charset="UTF-8">
      <style>
        body{
          background: #a7c4bc;
          margin: 0;
          padding: 50px 0;
          box-sizing: border-box;
          font-family: Bookman Old Style, sans, sans-serif;
        }
        #title{
          font-family: "trebuchet ms", "Arial", sans-serif;
          font-weight: bold;
          text-align: center;
          color: #2f5d62;
          font-size: 3em;
          margin: 0;
          margin-bottom: 30px;
        }
        #body{
          width: 100%;
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 20px;
          min-height: 400px;
        }
        p{
          font-size: 18px;
          color: #555;
          line-height: 30px;
          max-width: 90%;
          position: relative;
          margin: auto;
        }
        .link-btn{
          width: 90%;
          margin-top: 20px;
          margin-bottom: 20px;
          background: #5e8b7e;
          padding: 15px;
          font-size: 25px;
          color: white;
          border-radius: 5px;
          border: none;
          margin-left: 5%;
          
        }
        hr{
          margin: 20px 5%;
          width: 90%;
          border-bottom: none;
          border-top: solid rgb(235,235,235) 1px;
        }
        .center{
          text-align: center;
          color: rgb(180,180,180);
          margin: 10px;
        }
        a{
          color: #5e8b7e;
        }
        .block-image{
          width: 90%;
          margin: 5%;
          margin-bottom: 10px;
          border-radius: 5px;
        }
        h2{
          text-align: left;
          margin-top: 20px;
          margin-bottom: 0;
          margin-left: 5%;
          font-size: 30px;
          color: rgb(75, 75, 75);
          font-weight: bold;
        }
        a:hover{
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div id="body">
        <h1 id="title">Reset Password</h1>
        <p>Worry not!  We haven't forgotten you.  Click this link to reset your password and you'll be on your way:</p>
        <a href="http://${link}">
          <button class="link-btn">Reset Password</button>
        </a>
        <p>In case the link didn't work, try <a href="http://${link}">http://${link}</a></p>
        <hr>
        <div class="center">&copy; YouBarter® 2022, All Rights Reserved</div>
        <div class="center"><a href="mailto:contact@youbarter.us">contact@youbarter.us</a></div>
      </div>
    </body>
  </html>`, { url: "https://youbarter.us" })
}

export const limiter = (time, max, handler) => {
  return rateLimit({
    windowMs: time,
    max: max,
    handler: handler || function (req, res, /*next*/) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts.  Please try again later.'
      })
    },
    keyGenerator: function (req, res) {
      return requestIp.getClientIp(req);
    }
  })
};

