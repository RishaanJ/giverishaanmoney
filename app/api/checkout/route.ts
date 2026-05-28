import Stripe from "stripe";
import { NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const { amount, name } = await request.json();

  if (!amount || typeof amount !== "number" || amount < 1 || amount > 10000) {
    return Response.json({ error: "Invalid amount" }, { status: 400 });
  }

  const donorName = typeof name === "string" && name.trim()
    ? name.trim().slice(0, 40)
    : "Anonymous";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Give Rishaan Money",
            description: "A noble cause.",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: { donor_name: donorName },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  });

  return Response.json({ url: session.url });
}
