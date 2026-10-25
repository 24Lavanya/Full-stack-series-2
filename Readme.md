# Node.js and Express.js: Backend Fundamentals

This README introduces the basics of Node.js and Express.js, setting up a Node project, understanding project files, creating a server, using middleware and routes, testing APIs with Postman, and handling errors.

## 1. What is Node.js?

**Node.js** is a JavaScript runtime that lets you execute JavaScript outside a web browser. It is commonly used to build backend applications, HTTP servers, APIs, command-line tools, and real-time applications.

Browsers provide APIs such as the DOM for working with web pages. Node.js provides server-side capabilities, including file-system access, operating-system interaction, and networking APIs.

## 2. What is Express.js?

**Express.js** is a lightweight web framework that runs on Node.js. It makes it easier to build web servers and APIs by providing convenient routing, middleware support, and request/response helpers.

- **Node.js** runs JavaScript and provides the underlying runtime.
- **Express.js** runs on Node.js and makes common web-server tasks simpler.
- You can create an HTTP server using Node.js alone. Express is optional, but useful as an application grows.

## 3. Initialise a Node.js project

Install Node.js from the official website: <https://nodejs.org/>.

Check that Node.js and npm are installed:

```bash
node --version
npm --version
```

Create a project folder and initialise it:

```bash
mkdir node-express-basics
cd node-express-basics
npm init -y
```

Install Express:

```bash
npm install express
```

Create a file named `server.js`. To run it:

```bash
node server.js
```

For automatic restarts during development, you can install Nodemon:

```bash
npm install --save-dev nodemon
```

Add scripts to `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Then run:

```bash
npm run dev
```

## 4. Understand the project files

A typical project may look like this:

```text
node-express-basics/
├── node_modules/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

### `package.json`

`package.json` is the project's manifest. It contains information such as the project name, scripts, and dependencies.

Example:

```json
{
  "name": "node-express-basics",
  "version": "1.0.0",
  "description": "Learning Node.js and Express.js",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^5.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

The version numbers above are illustrative. Your installed versions may differ.

- `scripts`: Commands you can run using `npm run <script>`; `npm start` is a common shortcut for the `start` script.
- `dependencies`: Packages required for the application to run.
- `devDependencies`: Packages mainly needed during development, such as Nodemon or test tools.
- `main`: A package entry-point field. It does not automatically start your server.

### `package-lock.json`

The lock file records the resolved dependency versions and related information for the dependency tree. It helps different installations use consistent package versions.

- Commit `package-lock.json` to Git for an application.
- When installing dependencies in a project that has a lock file, npm uses it to reproduce the resolved dependency tree where possible.
- Update it through npm commands rather than editing it manually.

### `node_modules/`

This folder contains the packages installed for the project, including Express and its dependencies.

- Do not manually edit installed package files.
- Usually, do not commit this folder to Git. It can be recreated by running `npm install` using the project's package files.
- It can become large, so excluding it keeps the repository smaller.

### `.env`

A `.env` file stores environment-specific configuration, often including ports, database connection strings, and API keys.

Example:

```dotenv
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
API_KEY=replace_with_your_secret
```

Do not commit real secrets to source control. Add `.env` to `.gitignore`. Share a safe `.env.example` file with placeholder values so teammates know which variables are required.

Node.js versions with built-in environment-file support can load a file using `node --env-file=.env server.js`. Alternatively, projects often use the `dotenv` package. The examples later in this README use `process.env.PORT` and can be run with `node --env-file=.env server.js` on a compatible Node.js version.

Environment variables are configuration, not a replacement for secret management. Never send secrets to the frontend or log them.

### `.gitignore`

`.gitignore` tells Git which untracked files and folders it should ignore.

Example:

```gitignore
node_modules/
.env
.env.*
!.env.example
coverage/
.DS_Store
```

Why it matters:
- Prevents installed packages from cluttering the repository.
- Helps avoid accidentally committing credentials.
- Excludes generated or machine-specific files.

Important: `.gitignore` does not remove a file that Git is already tracking. If a secret was committed, remove it from the repository history as appropriate and rotate the secret.

## 5. Create a server with Node.js alone

Node.js includes the built-in `http` module. No Express installation is needed for this example.

Create `node-server.js`:

```javascript
const http = require('node:http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Hello from a Node.js HTTP server!');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Route not found');
});

server.listen(3000, () => {
  console.log('Node.js server running at http://localhost:3000');
});
```

Run it:

```bash
node node-server.js
```

Open <http://localhost:3000> in your browser.

Here, you manually inspect the HTTP method and URL, set response headers and status codes, and end the response.

## 6. Create a server with Express.js

Create `server.js`:

```javascript
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from an Express server!');
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
```

Run it:

```bash
node server.js
```

Open <http://localhost:3000>.

### Node.js HTTP server vs Express server

| Node.js built-in HTTP | Express.js |
|---|---|
| Uses the built-in `http` module. | Installed as a package and runs on Node.js. |
| Routes are commonly handled by checking `req.method` and `req.url`. | Routes can be declared with `app.get()`, `app.post()`, and other methods. |
| Headers and responses are managed more manually. | Helpers such as `res.status()` and `res.json()` make common tasks easier. |
| No framework dependency is required. | Provides routing and middleware patterns for larger APIs. |

Express does not replace Node.js. Express uses Node.js underneath.

## 7. What is middleware?

**Middleware** is a function that runs during the request-response cycle. It can inspect or modify the request and response, end the response, or pass control to the next middleware using `next()`.

A middleware function commonly has this shape:

```javascript
(req, res, next) => {
  // Do something with the request or response.
  next();
}
```

Examples of middleware tasks include logging, parsing JSON, authentication, and request validation.

### Create a logger middleware

Create `middleware/logger.js`:

```javascript
function logger(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = logger;
```

Use it in `server.js`:

```javascript
const express = require('express');
const logger = require('./middleware/logger');

const app = express();

app.use(logger);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

`app.use(logger)` registers the middleware. Since it is registered before the route, it logs requests that reach the application after that point. `next()` allows processing to continue. If middleware neither sends a response nor calls `next()`, the request may hang.

## 8. Create routes and understand HTTP methods

A **route** defines how the server responds to a particular HTTP method and URL.

Common methods for CRUD APIs:

| Method | Typical purpose | Example |
|---|---|---|
| `GET` | Read data | `GET /users` |
| `POST` | Create a resource | `POST /users` |
| `PUT` | Replace a resource representation | `PUT /users/1` |
| `PATCH` | Partially update a resource | `PATCH /users/1` |
| `DELETE` | Delete a resource | `DELETE /users/1` |

Here is a small in-memory CRUD example. Add these routes to a server that has `app.use(express.json())` registered before them:

```javascript
let users = [
  { id: 1, name: 'Lavanya' },
  { id: 2, name: 'Rahul' }
];
let nextId = 3;

// Read all users
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// Read one user
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
});

// Create a user
app.post('/users', (req, res) => {
  const { name } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ message: 'A valid name is required' });
  }

  const user = { id: nextId++, name: name.trim() };
  users.push(user);

  res.status(201).json(user);
});

// Partially update a user
app.patch('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (typeof req.body.name !== 'string' || !req.body.name.trim()) {
    return res.status(400).json({ message: 'A valid name is required' });
  }

  user.name = req.body.name.trim();
  res.status(200).json(user);
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(index, 1);
  res.status(204).end();
});
```

This example keeps data in memory, so changes are lost when the server restarts. A real application generally uses a database. The `PUT` method is not included in this short example; when implementing it, define whether it replaces the full resource and validate all required fields.

### `req.params`, `req.query`, and `req.body`

- `req.params`: Values captured from route placeholders. For `/users/5`, a route `/users/:id` reads `req.params.id` as `"5"`.
- `req.query`: Query-string values. For `/users?role=admin`, read `req.query.role`.
- `req.body`: Data sent in the request body. With JSON requests, `app.use(express.json())` parses the body so it is available as `req.body`.

## 9. Test APIs with Postman

Postman lets you send HTTP requests and inspect responses without needing to build a frontend.

1. Start your server using `node server.js`.
2. Open Postman and create an HTTP request.
3. Choose the HTTP method, such as `GET` or `POST`.
4. Enter the URL, such as `http://localhost:3000/users`.
5. For a POST or PATCH request, open **Body → raw → JSON** and enter JSON data.
6. Click **Send**.
7. Inspect the status code, response body, headers, and response time.

Example requests for the CRUD routes above:

| Action | Method | URL |
|---|---|---|
| List users | GET | `http://localhost:3000/users` |
| Get user 1 | GET | `http://localhost:3000/users/1` |
| Create user | POST | `http://localhost:3000/users` |
| Update user 1 | PATCH | `http://localhost:3000/users/1` |
| Delete user 1 | DELETE | `http://localhost:3000/users/1` |

For POST, select **Body → raw → JSON** and send:

```json
{
  "name": "Priya"
}
```

For PATCH, send:

```json
{
  "name": "Priya Sharma"
}
```

A successful POST should return `201 Created`. A successful GET typically returns `200 OK`. A successful DELETE in this example returns `204 No Content` with no response body.

## 10. Error handling in Express

Errors can occur because a resource does not exist, input is invalid, a database fails, or unexpected code throws an exception.

### Handle expected errors in a route

For example, if a user is not found, return a `404` response:

```javascript
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});
```

Use `return` after sending an error response so the handler does not continue and attempt to send another response.

### Add a 404 handler for unknown routes

Register this after all valid routes:

```javascript
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
```

This handles requests for URLs that do not match any registered route.

### Add centralized error-handling middleware

Register this after your routes and 404 handler:

```javascript
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    message: err.status && err.status < 500
      ? err.message
      : 'Internal server error'
  });
});
```

Error-handling middleware has **four parameters**: `(err, req, res, next)`. Express identifies it by this signature.

In Express 5, rejected promises returned by asynchronous route handlers are forwarded to error handling automatically. In Express 4, asynchronous handlers generally need to catch errors and call `next(err)`, or use a suitable wrapper.

Never expose stack traces, database details, passwords, or secrets in production error responses. Log useful diagnostic details on the server instead.

## 11. Quick reference

- **Node.js:** Runs JavaScript outside the browser.
- **Express.js:** Simplifies HTTP server and API development on Node.js.
- **`npm init -y`:** Creates a default `package.json`.
- **`package.json`:** Describes the project, scripts, and dependencies.
- **`package-lock.json`:** Records resolved dependency versions.
- **`node_modules/`:** Contains installed packages.
- **`.env`:** Stores local configuration and secrets; keep it out of Git.
- **`.gitignore`:** Excludes selected untracked files from Git.
- **Middleware:** Runs during request processing.
- **Routes:** Connect HTTP methods and URLs to handlers.
- **Postman:** Tests requests and responses.
- **Error middleware:** Centralizes unexpected error handling.

## Suggested practice

1. Create and run both the native Node.js server and the Express server.
2. Add a logger middleware and observe the terminal when sending requests.
3. Implement the CRUD routes and test each one in Postman.
4. Test invalid input and an unknown URL to see the error responses.
5. Replace the in-memory array with a database when you're ready.
