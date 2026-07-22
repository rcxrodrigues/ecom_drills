import { PolicyPage, PolicyHeading } from "@/components/storefront/PolicyPage";

export default function TermsOfServicePage() {
  return (
    <PolicyPage title="Terms of Service">
      <p>
        Welcome to Toolvo Drills (toolvodrills.co.uk). These Terms of Service govern your use of our website and
        the purchase of our cordless drills, screwdrivers, hammer drills and accessories. By accessing our store
        and placing an order, you agree to comply with and be bound by the following terms and conditions.
      </p>

      <PolicyHeading>1. Eligibility and coverage</PolicyHeading>
      <p>
        By agreeing to these Terms of Service, you represent that you are at least 18 years old. Our store
        currently ships to addresses within the United Kingdom.
      </p>

      <PolicyHeading>2. Product specifications</PolicyHeading>
      <p>
        We make every effort to display accurate specifications, images and pricing for our tools. Minor
        variations in product colour or finish may occur due to display settings.
      </p>
      <p>
        Disclaimer: battery-powered tools and batteries are matched to specific voltage platforms (for example
        18V or 20V). It is the customer&apos;s responsibility to check compatibility before purchasing
        accessories or spare batteries for an existing tool.
      </p>

      <PolicyHeading>3. Accuracy of billing and account information</PolicyHeading>
      <p>
        We reserve the right to refuse or limit any order placed with us. This may include orders placed under
        the same customer account, the same payment card, or the same delivery address. If we modify or cancel
        an order, we will notify you by email using the address provided at checkout.
      </p>

      <PolicyHeading>4. Delivery</PolicyHeading>
      <p>
        Standard delivery typically takes 2–4 working days across the UK, with express and next-day options
        available at checkout. Delivery windows are estimates, and Toolvo Drills is not responsible for delays
        caused by circumstances outside our control, such as severe weather or courier disruption.
      </p>

      <PolicyHeading>5. Intellectual property</PolicyHeading>
      <p>
        All content on this site — including text, graphics, logos, product photography and marketing copy — is
        the property of Toolvo Drills. Unauthorised reproduction, modification or distribution of our brand
        materials is not permitted.
      </p>

      <PolicyHeading>6. Safe use of tools</PolicyHeading>
      <p>
        You agree to indemnify and hold harmless Toolvo Drills from any claims, damages or liabilities arising
        from misuse of our tools. Power tools involve inherent risks, and it is the user&apos;s responsibility to
        read the included instructions and follow appropriate safety practices, including the use of protective
        equipment where required.
      </p>

      <PolicyHeading>7. Governing law</PolicyHeading>
      <p>
        These Terms of Service are governed by and construed in accordance with the laws of England and Wales.
      </p>

      <PolicyHeading>8. Contact</PolicyHeading>
      <p>
        Questions about our products, orders, or these Terms of Service should be directed to{" "}
        <a href="mailto:support@toolvodrills.co.uk" className="underline">
          support@toolvodrills.co.uk
        </a>
        .
      </p>
    </PolicyPage>
  );
}
