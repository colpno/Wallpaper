import createRouter from "@/helpers/create-router";

import * as handlers from "./user.handlers";
import * as routes from "./user.routes";

const { router: userRouter } = createRouter()
  .route(routes.signin, handlers.signin)
  .route(routes.register, handlers.register)
  .route(routes.updateOneById, handlers.updateOneById)
  .route(routes.deleteOneById, handlers.deleteOneById);

export default userRouter;
