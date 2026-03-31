/**
 * Converts an OpenAPI path to Express path.
 * @param path An OpenAPI path.
 * @param replacer A callback for replacer if provided.
 * @returns An Express path.
 */
export default function openApiToExpressPath(
  path: string,
  replacer?: (match: string, ...slugNames: string[]) => string
) {
  return path.replace(
    /{(.*?)}/g,
    (match, ...groups) => replacer?.(match, ...groups) ?? `:${groups[0]}`
  );
}
