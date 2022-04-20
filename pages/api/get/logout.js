import nc from 'next-connect';
const app = nc();

app.get(async (req, res) => {
  res.setHeader('Set-Cookie', [`sid=; path=/; Max-Age=${1}`, `verified=;path=/;Max-Age=${1}`]);
  res.redirect("/login");
})

export default app;