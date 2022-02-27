require('dotenv').config();
const { LineClient } = require('messaging-api-line');
const bodyParser = require('body-parser');
const express = require('express');

//載入 API Routers
const userRouter = require("./routers/userRouter");

//建立 Server
const server = express();
server.use(bodyParser.json());

// get accessToken and channelSecret from LINE developers website
const client = new LineClient({
  accessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
});

//設定 API Router 路徑
server.use("/", userRouter);

//Server 監聽 PORT 設定
const port = Number(process.env.PORT) || 5000;
server.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});