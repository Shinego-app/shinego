import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {

  const { amount, email,bookingId } = await request.json();

console.log("Stripe ontvangt:", { amount, email });

const session = await stripe.checkout.sessions.create({
  mode: "payment",
  customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "ShineGo glazenwassen",
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
   metadata: { bookingId: String(bookingId) }, 
    success_url: "http://localhost:3000?betaling/succes",
    cancel_url: "http://localhost:3000?betaling=geannuleerd",
  });

  return Response.json({ url: session.url });
}