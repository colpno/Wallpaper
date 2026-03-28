import createRouter from "@/helpers/create-router.js";

import * as handlers from "./media.handlers.js";
import * as routes from "./media.routes.js";

const { router: mediaRouter } = createRouter().route(
  routes.deleteExpiredMedias,
  handlers.deleteExpiredMedias
);

export default mediaRouter;
