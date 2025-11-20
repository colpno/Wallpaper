import createRouter from "@/helpers/create-router";

import * as handlers from "./post.handlers";
import * as routes from "./post.routes";

const { router: postRouter } = createRouter()
  .route(routes.getOneById, handlers.getOneById)
  .route(routes.getMany, handlers.getMany)
  .route(routes.add, handlers.add)
  .route(routes.updateOneById, handlers.updateOneById)
  .route(routes.removeOneById, handlers.removeOneById)
  .route(routes.removeMany, handlers.removeMany)
  .route(routes.search, handlers.search);

export default postRouter;
