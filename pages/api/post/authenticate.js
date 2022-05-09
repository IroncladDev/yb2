import nc from 'next-connect';
import { authenticate } from '../../../scripts/server/auth.js'
import { limiter } from '../../../scripts/server/util.js'
const app = nc();

app.use(limiter(1000 * 60 * 60, 30, (req, res) => {
  res.status(429).json({
    success: false,
    message: "Too many login attempts"
  })
}))

app.post(async (req, res) => {
  try{
    let sid = await authenticate(req.body.login, req.body.password);
    res.json({
      success: !!sid
    })
  }catch(e){
    res.json({
      success: false,
    })
  }
})

export default app;