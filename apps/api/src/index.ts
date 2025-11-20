import createApp from "./app";
import env from "./env";
import errorHandler from "./middlewares/error-handler.middleware";
import router from "./routes";
import { connectDB } from "./services/mongo.service";

connectDB();

const app = createApp();

app
  .use(router)
  .use(errorHandler)
  .listen(env.PORT, () => {
    console.log(`Express server listening on port ${env.PORT}`);
  });

export default app;
