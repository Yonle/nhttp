
// only for loading websocket-polyfill and other.
// check app.js
import("websocket-polyfill").then(_ => require("./app.js"));

process.on('unhandledRejection', Function());
