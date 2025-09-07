import type { LogoProps } from "./types";

// Light-mode friendly (black logo)
export function LogoLight({
  title = "Tide Info",
  width = 120,
  height = 32,
  ...props
}: LogoProps) {
  return (
    <svg
      aria-labelledby="logoLightTitle"
      height={height}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title id="logoLightTitle">{title}</title>
      <image height={height} href="/logo/noBgBlack.png" width={width} />
    </svg>
  );
}
