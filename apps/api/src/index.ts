import express from "express";

const app = express();

app
  .disable("x-powered-by")
  .use("/", (_req, res) => {
    res.send("Hello, World!");
  })
  .listen(3000, () => {
    console.log(`Express server listening on port ${3000}`);
  });

export default app;
