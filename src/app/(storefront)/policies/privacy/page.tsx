import { PolicyPage, PolicyHeading, PolicyList } from "@/components/storefront/PolicyPage";

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy">
      <p>
        Toolvo Drills Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates this website and store,
        including all related information, content, features, tools, products and services, to provide you with
        a straightforward shopping experience (the &quot;Services&quot;). This Privacy Policy describes how we
        collect, use, and disclose your personal information when you visit, use, or make a purchase using the
        Services, or otherwise communicate with us. Where there is a conflict between our Terms of Service and
        this Privacy Policy, this Privacy Policy governs how your personal information is handled.
      </p>
      <p>
        Please read this Privacy Policy carefully. By using the Services, you acknowledge that you understand how
        your information is collected, used and disclosed as described below.
      </p>

      <PolicyHeading>Personal information we collect</PolicyHeading>
      <p>
        &quot;Personal information&quot; means information that identifies or can reasonably be linked to you.
        Depending on how you interact with the Services, we may collect:
      </p>
      <PolicyList>
        <li>Contact details, including your name, billing address, delivery address, phone number and email.</li>
        <li>
          Payment information, handled by our payment processor at checkout — we do not store full card details
          on our own systems.
        </li>
        <li>Account information, including your username, password and preferences.</li>
        <li>Order information, including items you view, add to your basket, or purchase, return or exchange.</li>
        <li>Communications you send us, for example customer support enquiries.</li>
        <li>Device and usage information, including your IP address, browser type, and how you use our site.</li>
      </PolicyList>

      <PolicyHeading>Where we get this information</PolicyHeading>
      <PolicyList>
        <li>Directly from you — when you create an account, place an order, or contact us.</li>
        <li>Automatically — through cookies and similar technologies as you browse the site.</li>
        <li>
          From service providers we engage to help run the Services, such as payment processing, hosting,
          delivery and analytics providers.
        </li>
      </PolicyList>

      <PolicyHeading>How we use your information</PolicyHeading>
      <PolicyList>
        <li>
          To provide the Services — process payments, fulfil and deliver orders, manage your account, arrange
          returns and exchanges, and let you leave product reviews.
        </li>
        <li>
          For marketing — with your consent, to send offers, restock alerts and product updates by email. You
          can opt out at any time.
        </li>
        <li>
          For security and fraud prevention — to authenticate accounts, secure payments, and detect fraudulent
          or unsafe activity.
        </li>
        <li>To respond to your enquiries and provide customer support.</li>
        <li>To comply with our legal obligations, such as tax and consumer protection law.</li>
      </PolicyList>

      <PolicyHeading>How we disclose information</PolicyHeading>
      <p>We may share personal information with:</p>
      <PolicyList>
        <li>
          Trusted third-party service providers who support our business, such as payment processing, delivery
          couriers, cloud hosting, and customer support tools.
        </li>
        <li>Professional advisers and authorities, where required to comply with the law.</li>
        <li>A buyer or successor, in the event of a merger, sale, or transfer of all or part of our business.</li>
      </PolicyList>
      <p>We do not sell your personal information to third parties.</p>

      <PolicyHeading>Children&apos;s data</PolicyHeading>
      <p>
        The Services are not intended for children, and we do not knowingly collect personal information from
        children. If you believe a child has provided us with personal information, please contact us using the
        details below so we can delete it.
      </p>

      <PolicyHeading>Security and retention</PolicyHeading>
      <p>
        We use appropriate technical and organisational measures to protect your personal information, although
        no method of transmission or storage is completely secure. We retain your information for as long as
        needed to provide the Services, comply with our legal obligations, resolve disputes, and enforce our
        agreements.
      </p>

      <PolicyHeading>Your rights</PolicyHeading>
      <p>
        If you are in the UK or the European Economic Area, subject to applicable law, you have the right to:
      </p>
      <PolicyList>
        <li>Access the personal information we hold about you.</li>
        <li>Correct inaccurate personal information.</li>
        <li>Request deletion of your personal information.</li>
        <li>Receive a copy of your personal information in a portable format.</li>
        <li>Object to, or ask us to restrict, certain processing of your personal information.</li>
        <li>Withdraw your consent at any time, where we rely on consent to process your information.</li>
      </PolicyList>
      <p>
        You can exercise these rights by contacting us using the details below. We may need to verify your
        identity before actioning your request. We will not discriminate against you for exercising your rights.
      </p>

      <PolicyHeading>Managing marketing preferences</PolicyHeading>
      <p>
        You can opt out of marketing emails at any time using the unsubscribe link included in those emails. We
        may still send you non-promotional emails, such as order and account updates.
      </p>

      <PolicyHeading>Complaints</PolicyHeading>
      <p>
        If you have concerns about how we handle your personal information, please contact us using the details
        below. You also have the right to lodge a complaint with the UK Information Commissioner&apos;s Office
        (ICO) at ico.org.uk.
      </p>

      <PolicyHeading>Changes to this policy</PolicyHeading>
      <p>
        We may update this Privacy Policy from time to time to reflect changes to our practices or for legal
        reasons. We will post the revised policy on this page.
      </p>

      <PolicyHeading>Contact</PolicyHeading>
      <p>
        For any questions about this Privacy Policy, or to exercise your rights, please contact us at{" "}
        <a href="mailto:privacy@toolvodrills.co.uk" className="underline">
          privacy@toolvodrills.co.uk
        </a>{" "}
        or write to us at 1 Example Street, London, EC1A 1AA, United Kingdom. Toolvo Drills Ltd is the data
        controller of your personal information.
      </p>
    </PolicyPage>
  );
}
