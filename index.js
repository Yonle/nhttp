const config = require("./config");
const cluster = require("cluster");
const os = require("os");

if (!process.env.NO_CLUSTERS && cluster.isPrimary) {
  const numClusters = process.env.CLUSTERS || config.clusters || (os.availableParallelism ? os.availableParallelism() : (os.cpus().length || 2))

  console.log(`Primary ${process.pid} is running. Will fork ${numClusters} clusters.`);

  // Fork workers.
  for (let i = 0; i < numClusters; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking another one....`);
    cluster.fork();
  });

  return true;
}

// only for loading websocket-polyfill and other.
// check app.js
import("websocket-polyfill").then(_ => require("./app.js"));

process.on('unhandledRejection', console.error);
