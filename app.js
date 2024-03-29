const express = require("express");
const compression = require("compression");
const NostrTools = require("nostr-tools");
const bodyParser = require("body-parser");

const app = express();
const pools = [];

const config = require("./config");

app.use(compression());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/req", async (req, res) => {
  const filter = req.query;
  const pool = getPool();
  filter.limit = parseInt(((filter.limit > config.req_limit) ? config.req_limit : filter.limit) || config.req_limit);
  filter.authors = filter?.authors?.split(",") || [];
  filter.kinds = filter?.kinds?.split(",")?.map(_ => parseInt(_)) || [];
  filter.ids = filter?.ids?.split(",") || [];
  filter.since = parseInt(filter.since);
  filter.until = parseInt(filter.until);

  for (i in filter) {
    if (i.startsWith("#")) {
      filter[i] = filter[i]?.split(",") || [];
    }

    if (!filter[i]?.length) delete filter[i];
  }

  try {
    const results = await pool.querySync(config.relays, filter);
    res.json({
      results,
      notice: null
    });
  } catch (err) {
    res.status(500).json.json({
      results: [],
      notice: "failed to fetch. try again."
    });
  }
});

app.post("/publish", async (req, res) => {
  if (!NostrTools.validateEvent(req.body) || !NostrTools.verifyEvent(req.body)) return res.status(400).json({ results, notice: "Invalid event" });
  const pool = getPool();
  // it does not guarantee.
  pool.publish(config.relays, req.body);
  res.json({ results: [], notice: null });
});

function getPool() {
  const pool = pools.shift();
  pools.push(pool);
  return pool;
}

const listener = app.listen(config.port, _ =>
  console.log(`Now listening on port ${listener.address().port}`));

Array.apply(0, Array(config.pools)).forEach(_ =>
  pools.push(new NostrTools.SimplePool()));
