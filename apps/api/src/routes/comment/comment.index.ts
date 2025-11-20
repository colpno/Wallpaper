import createRouter from "@/helpers/create-router";

import * as handlers from "./comment.handlers";
import * as routes from "./comment.routes";

const { router: commentRouter } = createRouter()
  .route(routes.getMany, handlers.getMany)
  .route(routes.add, handlers.add)
  .route(routes.updateOneById, handlers.updateOneById)
  .route(routes.deleteOneById, handlers.deleteOneById);

export default commentRouter;
