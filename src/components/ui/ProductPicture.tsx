import Image from "next/image";
import { ToolIllustration, type ToolIllustrationVariant } from "./ToolIllustration";

export function ProductPicture({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (src.startsWith("illustration:")) {
    const variant = src.replace("illustration:", "") as ToolIllustrationVariant;
    return <ToolIllustration variant={variant} className={className} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}
