import { RouteObject } from 'react-router-dom';

import { ROUTE_HOME, ROUTE_VISUAL_SEARCH } from '~/constants/routeConstants.ts';
import { HomePage, VisualSearch } from '~/pages/index.ts';

const publicRoutes: RouteObject = {
  children: [
    {
      path: ROUTE_HOME,
      Component: HomePage,
    },
    {
      path: ROUTE_VISUAL_SEARCH,
      Component: VisualSearch,
    },
  ],
};

export default publicRoutes;
