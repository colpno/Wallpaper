type Callback = (match: string, ...routeParamNames: string[]) => string;

/**
 * Converts an OpenAPI path template to an Express route path.
 * @param path The OpenAPI path template.
 * @param replaceValue The value to replace.
 * @returns The converted Express route path.
 */

export default function openApiToExpressRoute(path: string, replaceValue: string): string;

/**
 * Converts an OpenAPI path template to an Express route path.
 * @param path The OpenAPI path template.
 * @param callback The callback to generate replacement values.
 * @returns The converted Express route path.
 */

export default function openApiToExpressRoute(path: string, callback: Callback): string;

export default function openApiToExpressRoute(path: string, value: string | Callback) {
  return path.replace(/{(.*?)}/g, (match, ...groups) =>
    typeof value === "function" ? value(match, ...groups) : value
  );
}
