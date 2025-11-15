/**
 * Converts an OpenAPI path template to an Express route path.
 * @param path The OpenAPI path template.
 * @param callback The callback to generate replacement values.
 * @returns The converted Express route path.
 */
export default function openApiToExpressRoute(
  path: string,
  callback?: (match: string, ...slugNames: string[]) => string
) {
  return path.replace(
    /{(.*?)}/g,
    (match, ...groups) => callback?.(match, ...groups) ?? `:${groups[0]}`
  );
}
