import { confirm3DSIfNeeded } from "@/utils/stripeClient";
import type { CheckoutAction } from "@/apiHooks.ts/billing/billingGateway.types";

/**
 * Completes a checkout the way the gateway needs:
 * - form_post: auto-submit a hidden form to the gateway page (PayFast)
 * - redirect:  send the browser to the gateway page
 * - stripe_confirm: run 3D Secure in place if Stripe asks for it
 * - none: nothing to do
 * Returns true when the browser is leaving the page.
 */
export async function runCheckoutAction(action: CheckoutAction): Promise<boolean> {
  switch (action.type) {
    case "form_post": {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = action.action;
      form.style.display = "none";
      // Values are set as DOM properties (no HTML string building), so the
      // browser escapes them and form-encodes them exactly once.
      for (const [name, value] of Object.entries(action.fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
      return true;
    }
    case "redirect":
      window.location.assign(action.url);
      return true;
    case "stripe_confirm":
      await confirm3DSIfNeeded(action);
      return false;
    default:
      return false;
  }
}
