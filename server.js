require('dotenv').config();
const { LineClient } = require('messaging-api-line');
const bodyParser = require('body-parser');
const express = require('express');

//載入 API Routers
const lineClientRouter = require("./routers/lineClientRouter");

//建立 Server
const server = express();
server.use(bodyParser.json());

//設定 API Router 路徑
server.use("/api/lineClient", lineClientRouter);

//Server 監聽 PORT 設定
const port = Number(process.env.PORT) || 5000;
server.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});