import Stripe from "stripe";

let client: Stripe | undefined;

/** Initialize only when a request actually needs Stripe, never during route discovery. */
export function getStripe(): Stripe {
  if (client) return client;
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) throw new Error("Stripe is niet geconfigureerd (STRIPE_SECRET_KEY ontbreekt).");
  client = new Stripe(apiKey);
  return client;
}
