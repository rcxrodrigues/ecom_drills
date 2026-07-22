import { PolicyPage, PolicyHeading } from "@/components/storefront/PolicyPage";

export default function ContactPage() {
  return (
    <PolicyPage title="Contact Information">
      <p>
        If you have any questions regarding your order, technical product specifications, or delivery, feel free
        to reach out to our team. Below you will find our official company details.
      </p>

      <PolicyHeading>1. Company details</PolicyHeading>
      <p>
        Trade name: Toolvo Drills
        <br />
        Registered address: 1 Example Street, London, EC1A 1AA, United Kingdom
      </p>

      <PolicyHeading>2. Customer support</PolicyHeading>
      <p>
        Customer support email:{" "}
        <a href="mailto:support@toolvodrills.co.uk" className="underline">
          support@toolvodrills.co.uk
        </a>
        <br />
        Opening hours: Monday–Friday, 9am–5.30pm (UK time)
        <br />
        Response window: our team typically responds to enquiries within 24 working hours.
      </p>

      <PolicyHeading>3. Regulatory information</PolicyHeading>
      <p>
        Toolvo Drills operates in accordance with UK consumer protection and distance selling regulations. All
        payments are processed securely by our payment providers, and full details of our legal entity are
        available on request from the address above.
      </p>
    </PolicyPage>
  );
}
