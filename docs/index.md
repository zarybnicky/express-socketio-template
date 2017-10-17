# Digipolis Payment engine

Main technologies used are ExpressJS, Socket.IO in ES6+.

## What's where?
- test/test.js - a simple working test
- router.js - the ExpressJS router
- server.js - creates a server, applies middleware (loggers, router, ...)
- index.js - the entrypoint, executes the server

## Commands

### Install:
```
git clone ..
npm i
```

### Running:
```
# runs on port 3000
npm start

# runs on the specified port
PORT=5555 npm start
```

### Auto-reload:
Using nodemon, this command restarts the server after every change.
```
npm run dev
```

### Tests:
We use Mocha and Should.js, so far there is one example test in test/test.js
```
npm test
```

### Code style:
We use eslint, configured for ES6+ with the eslint-preset-airbnb-base ruleset.
```
npm run lint
```

### Logging:
We use Winston over the many other JS loggers, as is is a stable library with
many supported backends, eg. syslog, MongoDB, Redis, ELK.

Currently use Console and File logging backends are set up. The File transports
log socket messages and REST requests separately, into different files.
