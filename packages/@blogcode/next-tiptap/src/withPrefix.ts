import { BLOGCODE_CSS_PREFIX } from "./constants";

export function withPrefix(className: string, ...classes: string[]): string {
  return [className, ...classes]
    .join(" ")
    .split(" ")
    .filter((cls) => !!cls)
    .map((cls) => `${BLOGCODE_CSS_PREFIX}${cls}`)
    .join(" ");
}
