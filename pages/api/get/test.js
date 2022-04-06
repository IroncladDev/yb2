import nc from 'next-connect';
const app = nc();

app.get((req, res) => {
  res.json({})
})

export default app;