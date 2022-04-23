import nc from 'next-connect';
import { Service } from '../../../scripts/server/mongo.js';
const app = nc();

app.get(async (req, res) => {
  let srvQuery = await Service.find(req.query);
  if (srvQuery) {
    res.json(srvQuery);
  } else {
    res.json(false)
  }
})

export default app;