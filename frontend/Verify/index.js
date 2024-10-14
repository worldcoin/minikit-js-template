import {
  MiniKit,
  VerificationLevel,
} from "https://cdn.jsdelivr.net/npm/@worldcoin/minikit-js@0.0.38-internal-alpha/+esm";

const test_verifyPayload = {
  action: "test-action", // This is your action ID from the Developer Portal
  signal: "",
  verification_level: VerificationLevel.Orb, // Orb | Device
};

document.addEventListener("DOMContentLoaded", function () {
  if (!MiniKit.isInstalled()) {
    return;
  }

  const handleResponse = async (response) => {
    if (response.status === "error") {
      return console.log("Error payload", response);
    }

    // Verify the proof in the backend
    const verifyResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: response, // Parses only the fields we need to verify
          action: test_verifyPayload.action,
          signal: test_verifyPayload.signal, // Optional
        }),
      }
    );

    // TODO: Handle Success!
    const verifyResponseJson = await verifyResponse.json();
    if (verifyResponseJson.status === 200) {
      console.log("Verification success!");
    }
  };

  MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, handleResponse);

  window.addEventListener("unload", function () {
    MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
  });
});

const triggerVerify = () => {
  MiniKit.commands.verify(test_verifyPayload);
};

document.querySelector("#test-verify").addEventListener("click", triggerVerify);
