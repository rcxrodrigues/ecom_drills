const VIEWBOX = "0 0 240 240";

type Variant =
  | "cordless-drill"
  | "impact-driver"
  | "hammer-drill"
  | "bench-drill"
  | "screwdriver"
  | "battery"
  | "drill-bits"
  | "case"
  | "charger";

const bodyStroke = { stroke: "#121212", strokeWidth: 3, fill: "none" } as const;

function CordlessDrill() {
  return (
    <g {...bodyStroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M55 95 L165 95 L182 108 L182 122 L55 122 Z" />
      <path d="M182 112 L210 112 L210 118 L182 118" />
      <path d="M95 122 L82 200 L112 200 L118 122" />
      <rect x="82" y="196" width="30" height="14" rx="2" />
      <circle cx="145" cy="108" r="5" fill="#121212" stroke="none" />
      <path d="M55 100 L40 100 L40 117 L55 117" />
    </g>
  );
}

function ImpactDriver() {
  return (
    <g {...bodyStroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 100 L150 100 L164 112 L164 124 L60 124 Z" />
      <path d="M164 114 L195 114 L195 120 L164 120" />
      <path d="M92 124 L82 195 L108 195 L112 124" />
      <rect x="82" y="191" width="26" height="13" rx="2" />
    </g>
  );
}

function HammerDrill() {
  return (
    <g {...bodyStroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 90 L170 90 L170 128 L50 128 Z" />
      <path d="M170 100 L204 100 L204 118 L170 118" />
      <path d="M95 128 L84 200 L118 200 L124 128" />
      <rect x="84" y="196" width="34" height="14" rx="2" />
      <path d="M50 96 L34 96 L34 122 L50 122" />
      <circle cx="140" cy="109" r="5" fill="#121212" stroke="none" />
    </g>
  );
}

function BenchDrill() {
  return (
    <g {...bodyStroke} strokeLinecap="round" strokeLinejoin="round">
      <rect x="60" y="200" width="120" height="10" rx="2" />
      <path d="M90 200 L90 60" />
      <rect x="76" y="40" width="60" height="24" rx="3" />
      <path d="M136 70 L170 70 L170 90 L136 90" />
      <circle cx="106" cy="128" r="26" />
      <path d="M106 152 L106 174" />
      <path d="M84 174 L128 174" />
    </g>
  );
}

function Screwdriver() {
  return (
    <g {...bodyStroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M120 40 L134 54 L100 150 L86 136 Z" />
      <path d="M86 136 L60 190" />
      <rect x="44" y="182" width="34" height="16" rx="4" transform="rotate(-25 61 190)" />
    </g>
  );
}

function Battery() {
  return (
    <g {...bodyStroke} strokeLinecap="round" strokeLinejoin="round">
      <rect x="60" y="80" width="120" height="80" rx="8" />
      <rect x="86" y="64" width="68" height="16" rx="3" />
      <path d="M80 100 L110 100 L98 120 L120 120 L88 150 L96 122 L80 122 Z" fill="#121212" stroke="none" />
      <path d="M132 100 L160 100" />
      <path d="M132 118 L160 118" />
      <path d="M132 136 L160 136" />
    </g>
  );
}

function DrillBits() {
  return (
    <g {...bodyStroke} strokeLinecap="round" strokeLinejoin="round">
      <rect x="46" y="150" width="148" height="30" rx="4" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${64 + i * 22} 150 L${64 + i * 22} 70`} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={`t${i}`} d={`M${64 + i * 22} 70 L${58 + i * 22} 56 L${70 + i * 22} 56 Z`} />
      ))}
    </g>
  );
}

function Case() {
  return (
    <g {...bodyStroke} strokeLinecap="round" strokeLinejoin="round">
      <rect x="40" y="90" width="160" height="100" rx="8" />
      <path d="M96 90 L96 70 L144 70 L144 90" />
      <path d="M40 130 L200 130" />
      <rect x="108" y="108" width="24" height="10" rx="2" fill="#121212" stroke="none" />
    </g>
  );
}

function Charger() {
  return (
    <g {...bodyStroke} strokeLinecap="round" strokeLinejoin="round">
      <rect x="70" y="70" width="100" height="110" rx="10" />
      <rect x="90" y="90" width="60" height="50" rx="6" />
      <path d="M100 160 L140 160" />
      <path d="M112 175 L128 175" />
    </g>
  );
}

const map: Record<Variant, () => React.JSX.Element> = {
  "cordless-drill": CordlessDrill,
  "impact-driver": ImpactDriver,
  "hammer-drill": HammerDrill,
  "bench-drill": BenchDrill,
  screwdriver: Screwdriver,
  battery: Battery,
  "drill-bits": DrillBits,
  case: Case,
  charger: Charger,
};

export function ToolIllustration({
  variant,
  className,
  background = true,
}: {
  variant: Variant;
  className?: string;
  background?: boolean;
}) {
  const Shape = map[variant] ?? CordlessDrill;
  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={variant.replace("-", " ")}
    >
      {background && <rect x="0" y="0" width="240" height="240" fill="#F5F5F3" />}
      <Shape />
    </svg>
  );
}

export type { Variant as ToolIllustrationVariant };
