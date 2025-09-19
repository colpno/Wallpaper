type Callback = (match: string, ...routeParamNames: string[]) => string;

export default function openAPIToRoutePath(path: string, replaceValue: string): string;

export default function openAPIToRoutePath(path: string, callback: Callback): string;

export default function openAPIToRoutePath(
  path: string,
  replaceValueOrCallback: string | Callback
) {
  return path.replace(/{(.*?)}/g, (match, ...groups) => {
    if (typeof replaceValueOrCallback === "function") {
      return replaceValueOrCallback(match, ...groups);
    }
    return replaceValueOrCallback;
  });
}
