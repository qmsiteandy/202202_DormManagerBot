require('dotenv').config();
const { LineClient } = require('messaging-api-line');
const express = require('express');
const expressAsyncHandler = require("express-async-handler");

const lineClientRouter = express.Router();
const Student = require('../models/studentModel');

// get accessToken and channelSecret from LINE developers website
const client = new LineClient({
    accessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
  });


lineClientRouter.post(
    "/",
    expressAsyncHandler(async (req, res) => {
      //取得Request內容
      const { message, source, replyToken } = req.body.events[0];
    
      if(message.text == "初始設定"){
        const newStudent = new Student({
          name: "ABC",
          userID: "110011",
          roomID: "1234",
          lineUID: source.userId
        });
        const createdStudent = await newStudent.save();
        console.log(createdStudent);
      }

      

      // 取得template
      let flexMessage = (require('../template/bubbleTemplate.json'));
    
      //傳送資料到特定id使用者
      await client.pushFlex(source.userId, 'this is a template', flexMessage);

      //回傳
      res.sendStatus(200);
    })
  );

  module.exports = lineClientRouter;