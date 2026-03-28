import createRouter from "@/helpers/create-router.js";

import * as handlers from "./user.handlers.js";
import * as routes from "./user.routes.js";

const { router: userRouter } = createRouter()
  .route(routes.signin, handlers.signin)
  .route(routes.register, handlers.register)
  .route(routes.updateOneById, handlers.updateOneById)
  .route(routes.deleteOneById, handlers.deleteOneById);

export default userRouter;
