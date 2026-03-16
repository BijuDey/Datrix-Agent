You are an expert Node.js backend and networking engineer.

Build a **Local API Agent CLI** that allows a web application to send HTTP requests through a locally running service so the browser can test **localhost APIs and bypass CORS restrictions**.

The agent will be published as an **NPM package** and installed globally.

### Main Goal

Create a CLI tool called **datrix-agent** that runs a local HTTP server which receives request instructions from a web app and executes the real HTTP request locally.

### Installation

The package must support:

```
npm install -g datrix-agent
```

Running:

```
datrix-agent
```

should start the agent.

### Required Tech Stack

Use:

- Node.js
- Express
- Axios (or undici)
- CORS
- Commander (for CLI)
- Chalk (for CLI logs)

### Required Features

1. **Local Server**
   Start a local server on:

```
http://localhost:4590
```

2. **Health Check Endpoint**

```
GET /health
```

Returns:

```
{
  "status": "running"
}
```

3. **API Request Endpoint**

```
POST /request
```

Request body format:

```
{
  "url": "http://localhost:5000/api/users",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer token"
  },
  "body": {}
}
```

The agent must perform the HTTP request and return:

```
{
  "status": 200,
  "headers": {},
  "data": {}
}
```

4. **Supported HTTP Methods**

Support all common methods:

- GET
- POST
- PUT
- PATCH
- DELETE
- OPTIONS

5. **Streaming Support**
   Responses must support large payloads without crashing.

6. **CORS Support**
   Allow requests only from configurable domains such as:

```
http://localhost:3000
https://yourwebapp.com
```

7. **Security Rules**

The agent must block dangerous requests:

Block these hosts:

```
169.254.*
0.0.0.0
```

Add a request timeout of:

```
30 seconds
```

Add response size limit:

```
10MB
```

8. **CLI Output**

When running the agent it should print:

```
Datrix Local Agent running
Port: 4590
Ready to receive requests
```

9. **Project Structure**

```
datrix-agent/
 ├─ src/
 │   ├─ server.js
 │   ├─ requestHandler.js
 │   └─ security.js
 ├─ bin/
 │   └─ cli.js
 ├─ package.json
 └─ README.md
```

10. **bin Configuration**

Ensure the CLI command works globally using:

```
"bin": {
  "datrix-agent": "./bin/cli.js"
}
```

11. **Frontend Usage Example**

The agent must support requests like this:

```
fetch("http://localhost:4590/request", {
  method: "POST",
  body: JSON.stringify({
    url: "http://localhost:5000/users",
    method: "GET"
  })
})
```

12. **Code Quality**

- Modular code
- Proper error handling
- Logging
- Async/await
- Type-safe patterns if possible

13. **README**

Generate a README explaining:

- installation
- running the agent
- API endpoints
- example usage

### Output Requirements

Provide:

1. Full project code
2. Folder structure
3. package.json
4. CLI implementation
5. server implementation
6. request proxy implementation
7. README

The result must be ready to publish to npm.

Also include instructions for publishing:

```
npm login
npm publish
```
