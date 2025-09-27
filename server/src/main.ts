import app from "./app";
import env from "./lib/env";

let host = "localhost";

// Handle CLI arguments
for (const arg of process.argv) {
  if (arg.startsWith("--host=")) {
    const temp = arg.split("=")[1];
    if (temp) host = temp;
  }
}

app.listen(env.PORT, host, () => {
  console.log(`Express server is running on http://${host}:${env.PORT}.`);
});
