import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/modals/Order";
import { buffer } from "micro";

const stripe = require("stripe")(process.env.STRIPE_SK);

const endpointSecret =
  "whsec_109928f4264ccd1ac8ae9b4e2581f4cee604da6563deef089c157c7fc4d78ce5";

export default async function handler(req, res) {
  await mongooseConnect();
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  console.log('event.type=>',event.type)
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const data = event.data.object;
      const orderId = data.metadata.orderId;
      const paid = data.payment_status === "paid";
      // console.log("paymentIntentSucceeded", data);
      
      if (orderId && paid) {
        await Order.findByIdAndUpdate(orderId, {
          paid: true,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.status(200).send("ok");
}

export const config = {
  api: {
    bodyParser: false,
  },
};
//quiet-faster-cure-humane
//acct_1NYLesE7jnvJjhGv
