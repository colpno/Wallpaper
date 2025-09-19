import { useEffect, useState } from 'react';
import { matchPath, useLocation, useSearchParams } from 'react-router-dom';

interface UseRouteMatchReturn {
  fullPath: string;
  pattern: string;
  index: number;
}

type UseRouteMatch = (
  patterns: readonly string[],
  includeParams?: boolean
) => UseRouteMatchReturn | null;

const useRouteMatch: UseRouteMatch = (patterns, includeParams) => {
  const [result, setResult] = useState<ReturnType<UseRouteMatch>>(null);
  const { pathname, search } = useLocation();
  const [searchParams] = useSearchParams();
  const fullPath = pathname + search;

  useEffect(() => {
    for (let i = 0; i < patterns.length; i += 1) {
      const pattern = patterns[i];
      const pathMatch = matchPath(pattern, pathname);
      const matchPathname = pathMatch !== null;

      if (matchPathname) {
        if (includeParams && pattern.includes('?')) {
          const patternParams = pattern.split('?')[1]?.split('&') ?? [];
          const containParams = patternParams.every((param) =>
            searchParams.has(param.split('=')[0])
          );
          if (containParams) {
            setResult({
              pattern: pathMatch!.pattern.path,
              fullPath,
              index: i,
            });
            break;
          }
        } else {
          setResult({
            pattern: pathMatch!.pattern.path,
            fullPath,
            index: i,
          });
          break;
        }
      }
    }
  }, [patterns, pathname]);

  return result;
};

export default useRouteMatch;
