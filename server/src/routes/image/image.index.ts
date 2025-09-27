import { createRouter } from "@/helpers";

import * as handlers from "./image.handlers";
import * as routes from "./image.routes";

const { router: imageRouter } = createRouter()
  .route(routes.getMany, handlers.getMany)
  .route(routes.add, handlers.add)
  .route(routes.updateOneById, handlers.updateOneById)
  .route(routes.deleteOneById, handlers.deleteOneById)
  .route(routes.deleteMany, handlers.deleteMany);

export default imageRouter;
