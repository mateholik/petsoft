import prisma from "@/lib/db";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json(
      { error: "Missing stripe signature" },
      { status: 400 },
    );
  }
  if (!process.env.STRIPE_WEB_HOOK_SECRET) {
    return Response.json({ error: "Missing stripe secret" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEB_HOOK_SECRET,
    );
  } catch (error) {
    console.log("Webhook verification failed", error);

    return Response.json(null, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await prisma.user.update({
        where: {
          email: event.data.object.customer_email!,
        },
        data: {
          hasAccess: true,
        },
      });
      break;
    default:
      console.log(`unhandled event type ${event.type}`);
  }

  return Response.json(null, { status: 200 });
}
