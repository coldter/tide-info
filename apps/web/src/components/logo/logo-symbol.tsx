import type { LogoProps } from "./types";

export function LogoSymbol({
  title = "Tide Info",
  width = 32,
  height = 32,
  ...props
}: LogoProps) {
  return (
    <svg
      aria-labelledby="logoSymbolTitle"
      height={height}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title id="logoSymbolTitle">{title}</title>
      <image height={height} href="/logo/logo-symbol.svg" width={width} />
    </svg>
  );
}
