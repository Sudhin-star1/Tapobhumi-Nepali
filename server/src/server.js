import http from "http";
import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { configureCloudinary } from "./config/cloudinary.js";

async function start() {
  configureCloudinary();
  await connectDb();

  const server = http.createServer(app);
  server.listen(env.PORT, env.HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`[api] listening on http://${env.HOST}:${env.PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[api] failed to start", err);
  process.exit(1);
});

