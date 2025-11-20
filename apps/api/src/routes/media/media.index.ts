import createRouter from "@/helpers/create-router";

import * as handlers from "./media.handlers";
import * as routes from "./media.routes";

const { router: mediaRouter } = createRouter().route(
  routes.deleteExpiredMedias,
  handlers.deleteExpiredMedias
);

export default mediaRouter;
