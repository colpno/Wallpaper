import createApp from "./app";
import env from "./env";
import { connectDB } from "./services/mongo.service";

connectDB();

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Express server listening on port ${env.PORT}`);
});

export default app;
