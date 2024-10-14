import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  ResponseEvent,
} from "https://cdn.jsdelivr.net/npm/@worldcoin/minikit-js@0.0.38-internal-alpha/+esm";

const sendPayment = async () => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/initiate-payment`, {
    method: "POST",
  });

  const { id } = await res.json();

  console.log(id);

  const payload = {
    reference: id,
    to: "0x0c892815f0B058E69987920A23FBb33c834289cf", // Test address
    tokens: [
      {
        symbol: Tokens.WLD,
        token_amount: tokenToDecimals(0.5, Tokens.WLD).toString(),
      },
      {
        symbol: Tokens.USDCE,
        token_amount: tokenToDecimals(0.1, Tokens.USDCE).toString(),
      },
    ],
    description: "Watch this is a test",
  };

  if (MiniKit.isInstalled()) {
    MiniKit.commands.pay(payload);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  if (!MiniKit.isInstalled()) {
    console.error("MiniKit is not installed");
    return;
  }

  const handlePaymentResponse = async (response) => {
    if (response.status == "success") {
      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/confirm-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: response }),
        }
      );
      const payment = await res.json();
      if (payment.success) {
        // Congrats your payment was successful!
        console.log("SUCCESS!");
      } else {
        // Payment failed
        console.log("FAILED!");
      }
    }
  };

  MiniKit.subscribe(ResponseEvent.MiniAppPayment, handlePaymentResponse);

  window.addEventListener("unload", function () {
    MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
  });
});

document.querySelector("#test-pay").addEventListener("click", sendPayment);
