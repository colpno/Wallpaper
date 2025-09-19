import { connectDB } from "./db";
import { createApp } from "./helpers";
import { errorHandler } from "./middlewares";
import router from "./routes";

connectDB();

const app = createApp();

app.use(router);

app.use(errorHandler);

export default app;
