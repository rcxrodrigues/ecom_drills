function IconChip({ children, bg = "#fff" }: { children: React.ReactNode; bg?: string }) {
  return (
    <span
      className="flex h-7 w-11 shrink-0 items-center justify-center rounded-[4px] border border-border-subtle"
      style={{ background: bg }}
    >
      {children}
    </span>
  );
}

function Visa() {
  return (
    <IconChip>
      <svg viewBox="0 0 40 14" className="h-3.5 w-9" xmlns="http://www.w3.org/2000/svg">
        <text x="20" y="11" textAnchor="middle" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="700" fontSize="11" fill="#1A1F71">
          VISA
        </text>
      </svg>
    </IconChip>
  );
}

function Mastercard() {
  return (
    <IconChip>
      <svg viewBox="0 0 40 24" className="h-5 w-9" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="12" r="8" fill="#EB001B" />
        <circle cx="24" cy="12" r="8" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    </IconChip>
  );
}

function Amex() {
  return (
    <IconChip bg="#2E77BC">
      <svg viewBox="0 0 40 14" className="h-3.5 w-9" xmlns="http://www.w3.org/2000/svg">
        <text x="20" y="11" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="8" fill="white">
          AMEX
        </text>
      </svg>
    </IconChip>
  );
}

function Maestro() {
  return (
    <IconChip>
      <svg viewBox="0 0 40 24" className="h-5 w-9" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="12" r="8" fill="#0099DF" />
        <circle cx="24" cy="12" r="8" fill="#ED0006" fillOpacity="0.9" />
      </svg>
    </IconChip>
  );
}

function ApplePay() {
  return (
    <IconChip bg="#000">
      <svg viewBox="0 0 24 14" className="h-3.5 w-6" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.5 3.6c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.7.9-.4.4-.7 1.1-.6 1.8.7.1 1.3-.3 1.7-.8z" />
        <path d="M7.4 4c-.9-.1-1.7.5-2.1.5-.4 0-1.1-.5-1.9-.5-1 0-1.9.6-2.4 1.5-1 1.8-.3 4.4.7 5.9.5.7 1.1 1.5 1.9 1.5.7 0 1-.5 1.9-.5s1.1.5 1.9.5c.8 0 1.3-.7 1.8-1.5.6-.8.8-1.6.8-1.7 0 0-1.5-.6-1.6-2.3 0-1.4 1.1-2 1.2-2.1-.6-.9-1.6-1.1-2-1.1z" />
        <text x="10" y="10" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="7">
          Pay
        </text>
      </svg>
    </IconChip>
  );
}

function GooglePay() {
  return (
    <IconChip>
      <svg viewBox="0 0 40 14" className="h-3.5 w-9" xmlns="http://www.w3.org/2000/svg">
        <text x="20" y="11" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="500" fontSize="8" fill="#5F6368">
          <tspan fill="#4285F4">G</tspan>
          <tspan fill="#EA4335">o</tspan>
          <tspan fill="#FBBC05">o</tspan>
          <tspan fill="#4285F4">g</tspan>
          <tspan fill="#34A853">l</tspan>
          <tspan fill="#EA4335">e</tspan> Pay
        </text>
      </svg>
    </IconChip>
  );
}

function ShopPay() {
  return (
    <IconChip bg="#5A31F4">
      <svg viewBox="0 0 40 14" className="h-3.5 w-9" xmlns="http://www.w3.org/2000/svg">
        <text x="20" y="11" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="7.5" fill="white">
          shop Pay
        </text>
      </svg>
    </IconChip>
  );
}

function PayPal() {
  return (
    <IconChip>
      <svg viewBox="0 0 40 14" className="h-3.5 w-9" xmlns="http://www.w3.org/2000/svg">
        <text x="20" y="11" textAnchor="middle" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="700" fontSize="8" fill="#003087">
          Pay<tspan fill="#009cde">Pal</tspan>
        </text>
      </svg>
    </IconChip>
  );
}

export function PaymentIcons() {
  return (
    <div className="flex flex-wrap gap-2">
      <Visa />
      <Mastercard />
      <Amex />
      <Maestro />
      <ApplePay />
      <GooglePay />
      <ShopPay />
      <PayPal />
    </div>
  );
}
