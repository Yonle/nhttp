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
- `/req` for `REQ`. Fill the req filter into request query. As example, `/req?kinds=0,1&authors=abcd,1234,` (Some field may require commas)
- `/publish` for event publishing. Send event data in JSON format to this endpoint with POST request.

## Response
```json
{
  "status": 0,
  "events": [],
  "error": null
}
```

Every JSON response including `status` code:
- `0`: OK / Success
- `1`: Invalid Request
- `2`: Something went wrong in server.

When error occured, `error` will return string value.

## License
This software was licensed under **BSD-3-Clause**. However, the API or the spec that were mentioned in the [endpoints](#endpoints) section was **Public Licensed**.
