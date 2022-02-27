require('dotenv').config();
const { LineClient } = require('messaging-api-line');
const express = require('express');
const expressAsyncHandler = require("express-async-handler");

// get accessToken and channelSecret from LINE developers website
const client = new LineClient({
    accessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
  });

const userRouter = express.Router();

userRouter.post(
    "/",
    expressAsyncHandler(async (req, res) => {
        //取得Request內容
        const { message, source, replyToken } = req.body.events[0];
      
        // 取得template
        let flexMessage = (require('../template/bubbleTemplate.json'));
        //修改template內容
        flexMessage['footer']['contents'][0]['action']['label'] = '123';
      
        //傳送資料到特定id使用者
        await client.pushFlex(source.userId, 'this is a template', flexMessage);

        //回傳
        res.sendStatus(200);
    })
  );

  module.exports = userRouter;