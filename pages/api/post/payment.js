import nc from 'next-connect';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SK);
const app = nc();

app.post(async (req, res) => {
  const { product } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.amount * 100,
        },
        quantity: product.quantity,
      },
    ],
    mode: "payment",
    success_url: `${req.headers.host.includes('http') ? req.headers.host : "http://" + req.headers.host}/`,
    cancel_url: `${req.headers.host.includes('http') ? req.headers.host : "http://" + req.headers.host}/`,
  });

  res.json({ id: session.id });
})

export default app;