import { verifyWebhookSignature} from "../auth/webhooksignature.js";

describe("Webhook Signature", () => {

 test("should reject invalid signature format", () => {
    const body = JSON.stringify({message: "hello"});
    const secret = "test-secret";

  expect(() => {

    verifyWebhookSignature(
      "abc123",
      body,
      secret
    );

  }).toThrow(
    "Invalid signature format"
  );

})
});

import { createHmac } from "crypto";

test("should accept valid signature", () => {

  const body = JSON.stringify({
    message: "hello"
  });

  const secret = "test-webhook-secret";

  const signature =
    "sha256=" +
    createHmac("sha256", secret)
      .update(body)
      .digest("hex");

  expect(() => {

    verifyWebhookSignature(
      signature,
      body,
      secret
    );

  }).not.toThrow();

});