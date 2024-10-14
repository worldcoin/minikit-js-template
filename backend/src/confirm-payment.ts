import fetch from "node-fetch";
import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";
import { RequestHandler } from "express";

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload;
}

export const confirmPaymentHandler: RequestHandler = async (req, res) => {
  const { payload } = req.body as IRequestPayload;

  // IMPORTANT: Here we should fetch the reference you created in /initiate-payment to ensure the transaction we are verifying is the same one we initiated
  // const reference = getReferenceFromDB();
  const reference = req.cookies["payment-nonce"];

  if (!reference) {
    res.json({ success: false });
    return;
  }

  // 1. Check that the transaction we received from the mini app is the same one we sent
  if (payload.reference === reference) {
    const response = await fetch(
      `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.APP_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
        },
      }
    );

    // TODO - missing types
    const transaction = (await response.json()) as any;
    // 2. Here we optimistically confirm the transaction.
    // Otherwise, you can poll until the status == mined
    if (transaction.reference == reference && transaction.status != "failed") {
      res.json({ success: true });
      return;
    } else {
      res.json({ success: false });
      return;
    }
  } else {
    res.json({ success: false });
    return;
  }
};
