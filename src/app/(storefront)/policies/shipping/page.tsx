import { PolicyPage, PolicyHeading, PolicyList } from "@/components/storefront/PolicyPage";

export default function ShippingPolicyPage() {
  return (
    <PolicyPage title="Shipping Policy">
      <p>
        Thank you for choosing Toolvo Drills. We&apos;re dedicated to getting your tools to you quickly and
        safely, without compromising on how carefully each order is packed. Below you&apos;ll find our delivery
        options and the logistics that govern shipments across the United Kingdom.
      </p>

      <PolicyHeading>Delivery options</PolicyHeading>
      <PolicyList>
        <li>
          <span className="font-medium text-foreground-strong">Standard delivery</span> — 2–4 working days, free
          on orders over £50 (otherwise £4.99).
        </li>
        <li>
          <span className="font-medium text-foreground-strong">Express delivery</span> — 1–2 working days, £7.99.
        </li>
        <li>
          <span className="font-medium text-foreground-strong">Next-day delivery</span> — order before 2pm for
          delivery the following working day, £12.99.
        </li>
      </PolicyList>
      <p>Your chosen delivery method and its cost are confirmed at checkout, based on your basket total.</p>

      <PolicyHeading>Tracking your order</PolicyHeading>
      <p>
        As soon as your order is dispatched, we&apos;ll send a tracking link to your registered email address, so
        you can follow its progress from our warehouse to your door. You can also check the status of any order
        at any time from your account, or via{" "}
        <a href="/account/orders/track" className="underline">
          Track Your Order
        </a>
        .
      </p>

      <PolicyHeading>Packaging</PolicyHeading>
      <p>
        Tools and batteries are securely boxed with protective packaging to withstand transit, so your order
        arrives in full working order.
      </p>

      <PolicyHeading>Address accuracy</PolicyHeading>
      <p>
        It&apos;s the customer&apos;s responsibility to provide a complete and accurate delivery address at
        checkout. Toolvo Drills is not responsible for packages that cannot be delivered due to missing details,
        such as an incorrect postcode or flat number.
      </p>

      <PolicyHeading>Need help with your delivery?</PolicyHeading>
      <p>
        If your tracking link hasn&apos;t updated or your order has exceeded the stated delivery window, our team
        is on hand to help — email{" "}
        <a href="mailto:support@toolvodrills.co.uk" className="underline">
          support@toolvodrills.co.uk
        </a>
        .
      </p>
    </PolicyPage>
  );
}
