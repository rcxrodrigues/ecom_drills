import { PolicyPage, PolicyHeading, PolicyList } from "@/components/storefront/PolicyPage";

export default function ReturnsPolicyPage() {
  return (
    <PolicyPage title="Returns & Refund Policy">
      <p>
        At Toolvo Drills, we stand behind the quality of every tool we sell. If you are not completely satisfied
        with your purchase, please review our policy below to understand how we can help.
      </p>

      <PolicyHeading>1. 30-day money-back guarantee</PolicyHeading>
      <p>
        You have 30 days from the date you receive your order to start a return or refund request. Requests made
        after this 30-day window are not eligible for a refund.
      </p>

      <PolicyHeading>2. Eligibility conditions</PolicyHeading>
      <p>Returns and refunds are accepted under the following conditions:</p>
      <PolicyList>
        <li>Product defect: the tool arrives faulty or with a manufacturing flaw.</li>
        <li>Wrong item: you received a different product or variant than the one you ordered.</li>
        <li>Change of mind: the tool is unused, in its original packaging, with all accessories included.</li>
      </PolicyList>

      <PolicyHeading>3. Minor cosmetic issues</PolicyHeading>
      <p>
        To avoid unnecessary return shipping, if a tool has a minor cosmetic mark that doesn&apos;t affect how it
        works, we may offer a partial refund of 50% of the purchase price instead of a full return, so you can
        keep using the tool straight away.
      </p>

      <PolicyHeading>4. How to start a request</PolicyHeading>
      <p>
        All claims must be submitted by email to{" "}
        <a href="mailto:support@toolvodrills.co.uk" className="underline">
          support@toolvodrills.co.uk
        </a>
        . To help us resolve your request quickly, please include:
      </p>
      <PolicyList>
        <li>Your order number.</li>
        <li>Clear photographs of the tool showing the issue.</li>
        <li>Clear photographs of the packaging it arrived in.</li>
      </PolicyList>
      <p>Our support team will review your request and respond within 24 working hours.</p>

      <PolicyHeading>5. Final notes</PolicyHeading>
      <p>
        Items must be returned in their original condition (aside from any reported defect). We reserve the
        right to decline refund requests if the supporting documentation is insufficient or the product shows
        signs of misuse.
      </p>
    </PolicyPage>
  );
}
