const express = require("express");
const NostrTools = require("nostr-tools");
const bodyParser = require("body-parser");

const app = express();
const pool = new NostrTools.SimplePool();

const config = require("./config");

app.use(bodyParser.json());

app.get("/req", async (req, res) => {
  const filter = req.query;
  filter.limit = parseInt(((filter.limit > config.req_limit) ? config.req_limit : filter.limit) || config.req_limit);
  filter.authors = filter?.authors?.split(",") || [];
  filter.kinds = filter?.kinds?.split(",")?.map(parseInt) || [];
  filter.ids = filter?.ids?.split(",")?.map(parseInt) || [];

  for (i in filter) {
    if (i.startsWith("#")) {
      filter[i] = filter[i]?.split(",") || [];
    }

    if (!filter[i]?.length) delete filter[i];
  }

  try {
    const events = await pool.querySync(config.relays, filter);
    res.json({
      status: 0,
      events,
      error: null
    });
  } catch (err) {
    res.status(500).json.json({
      status: 2,
      events: [],
      error: "failed to fetch. try again."
    });
  }
});

app.post("/publish", async (req, res) => {
  if (!NostrTools.validateEvent(req.body) || !NostrTools.verifySignature(req.body)) return res.status(400).json({ status: 1, error: "Invalid event" });
  // it does not guarantee.
  pool.publish(config.relays, req.body);

  res.json({ status: 0, error: null });
});

app.listen(3000);
