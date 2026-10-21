/**
 * Base path when the site is served from a sub-directory
 * (e.g. https://okhaimie-dev.github.io/sobajo-grill/ on GitHub Pages).
 * Set via NEXT_PUBLIC_BASE_PATH in the CI deployment workflow.
 */
export const BASE_PATH: string = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative asset path ("/hero.jpg") with the base path. */
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
