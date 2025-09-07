import type { LogoProps } from "./types";

// Dark-mode friendly (white logo)
export function LogoDark({
  title = "Tide Info",
  width = 120,
  height = 32,
  ...props
}: LogoProps) {
  return (
    <svg
      aria-labelledby="logoDarkTitle"
      height={height}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title id="logoDarkTitle">{title}</title>
      <image height={height} href="/logo/noBgWhite.png" width={width} />
    </svg>
  );
}
