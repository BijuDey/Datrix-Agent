# datrix-agent

`datrix-agent` is a local API proxy service for Datrix API Studio. It allows a browser app to trigger local HTTP requests (including localhost APIs) through a trusted local agent.

This package now ships as a TypeScript library plus CLI:

- CLI: run `datrix-agent` globally
- Library: import helpers in Node.js projects with full `.d.ts` types

## Features

- Local server on `http://localhost:4590`
- Health endpoint: `GET /health`
- Request execution endpoint: `POST /request`
- Supported methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`
- Streaming-safe response handling with 10MB cap
- 30-second request timeout
- CORS allowlist for approved web app origins
- Security host blocking for risky targets

## Installation

```bash
npm install -g datrix-agent
```

For library usage in another project:

```bash
npm install datrix-agent
```

## Build (for contributors)

```bash
npm install
npm run build
```

Build output is generated under `dist/`.

## Run

```bash
datrix-agent
```

Optional flags:

```bash
datrix-agent --port 4590 --origins "http://localhost:3000,https://yourwebapp.com"
```

When running, the agent prints:

- Datrix Local Agent running
- Port: 4590
- Ready to receive requests

## Library Usage

```ts
import { createServer, resolveAllowedOrigins, executeRequest } from "datrix-agent";

const allowedOrigins = resolveAllowedOrigins("http://localhost:3000,https://yourwebapp.com");
createServer({ port: 4590, allowedOrigins });

const result = await executeRequest({
  url: "http://localhost:5000/api/users",
  method: "GET",
});

console.log(result.statusCode, result.body);
```

## API Endpoints

### Health

`GET /health`

Response:

```json
{
  "status": "running"
}
```

### Proxy Request

`POST /request`

Request body:

```json
{
  "url": "http://localhost:5000/api/users",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer token"
  },
  "body": {}
}
```

Success response:

```json
{
  "status": 200,
  "headers": {},
  "data": {}
}
```

## Frontend Example

```javascript
fetch("http://localhost:4590/request", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "http://localhost:5000/users",
    method: "GET"
  })
});
```

## Security Rules

Blocked hosts:

- `169.254.*`
- `0.0.0.0`

Limits:

- Timeout: 30 seconds
- Max response size: 10MB

## Publish to npm

```bash
npm login
npm run build
npm pack
npm publish
```

Recommended first publish checklist:

1. Ensure package name availability: `npm view datrix-agent`
2. Verify files being published: `npm pack --dry-run`
3. Bump version before each release:
  - `npm version patch` for fixes
  - `npm version minor` for features
  - `npm version major` for breaking changes
4. Publish with public access (first publish for scoped packages): `npm publish --access public`
