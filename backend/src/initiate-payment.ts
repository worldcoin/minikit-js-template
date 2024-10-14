import { RequestHandler } from "express";
import crypto from "crypto";

export const initiatePaymentHandler: RequestHandler = (_req, res) => {
  const uuid = crypto.randomUUID().replace(/-/g, "");

  // TODO: Store the ID field in your database so you can verify the payment later
  res.cookie("payment-nonce", uuid, { httpOnly: true });

  console.log(uuid);

  res.json({ id: uuid });
};
