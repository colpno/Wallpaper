import createApp from "./app";
import env from "./env";
import { errorHandler } from "./middlewares";
import router from "./routes";

const app = createApp();

app
  .use(router)
  .use(errorHandler)
  .listen(env.PORT, () => {
    console.log(`Express server listening on port ${env.PORT}`);
  });

export default app;
