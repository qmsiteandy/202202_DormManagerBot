// 主程式：負責API Server、設定Bottender的Handler

const bodyParser = require('body-parser');
const express = require('express');
const { bottender } = require('bottender');
const path = require('path');

const apiRouter = require("./routers/apiRouter");

//----------設定 bottender----------
const app = bottender({
  dev: process.env.NODE_ENV !== 'production',
});

const port = Number(process.env.PORT) || 5000;

// the request handler of the bottender app
const handle = app.getRequestHandler();

//----------設定 App Server----------

app.prepare().then(() => {
  const server = express();

  server.use(
    bodyParser.json({
      verify: (req, _, buf) => {
        req.rawBody = buf.toString();
      },
    })
  );

  // your custom route
  server.get('/', (req, res) => {
    res.send('Hello World!');
  });

  // API Routers
  server.use("/api", apiRouter);

  // route for webhook request
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  //監聽PORT
  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});