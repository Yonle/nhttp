## nhttp
Nostr over HTTP communication.

## Setting up
```
git clone https://github.com/Yonle/nhttp
cd nhttp
npm install
```

Copy `config.js.example` as `config.js`, Edit `config.js` and configure accordingly.

Running:
```
node index.js
```

## Endpoints
- `/req` for `REQ`. Fill the req filter into request query. As example, `/req?kinds=0,1&authors=abcd,1234,blah` (Some field may require commas)
- `/publish` for event publishing. Send event data in JSON format to this endpoint with POST request.

## Response
```json
{
  "results": [],
  "notice": null
}
```

Every JSON response has different HTTP status code:
- `200`: OK / Success
- `400`: Invalid Request
- `500`: Something went wrong in server.

`notice` will be a string when certain condition occured (eg. error, rejection, note of ratelimit)

## License
This software was licensed under **BSD-3-Clause**. However, the API or the spec that were mentioned in the [endpoints](#endpoints) section was **Public Licensed**.
