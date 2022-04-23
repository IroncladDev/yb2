import nc from 'next-connect';
import { Service } from '../../../scripts/server/mongo.js';
const app = nc();

app.get(async (req, res) => {
  const { results, gs, sort, search } = req.query;
  let orCriteria = (typeof search === "string" && search.length > 0) ? [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
    { tags: { $all: search.split(/[^a-z0-9]/) } },
  ] : [];
  let sortCriteria = { _id: -1 }
  if(sort === "oldest") sortCriteria = { _id: 1 };
  let searchCriteria = {
    $or: orCriteria,
    typeBool: gs === "goods" ? false : true,
  };
  if(!(typeof gs === "string" && gs.length > 0)) delete searchCriteria.typeBool;
  if(!(typeof search === "string" && search.length > 0)) delete searchCriteria.$or;
  res.json(
    await Service.find(searchCriteria).sort(sortCriteria).limit(results || 500)
  )
})

export default app;