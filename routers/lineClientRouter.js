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

// Line使用者傳送的訊息都會進入這個Router
lineClientRouter.post(
    "/",
    expressAsyncHandler(async (req, res) => {
      //取得Request內容
      const { type, message, source, replyToken } = req.body.events[0];
      
      //-----訊息分類-----
      if(type == "message"){

        //-----初始設定-----
        if(message.text == "初始設定"){
        
          // 取得template
          let flexMessage = (require('../template/join-input-template.json'));
          //傳送資料到特定id使用者
          await client.pushFlex(source.userId, 'join-input-template', flexMessage);

          client.pushText(source.userId, '姓名:\n學號:\n第幾宿舍:\n樓層:\n幾房:')
          // const newStudent = new Student({
          //   name: "ABC",
          //   userID: "110011",
          //   dormID: "1",
          //   floorID: "2",
          //   roomID: "34",
          //   lineUID: source.userId
          // });
          // const createdStudent = await newStudent.save();
          // console.log(createdStudent);
        }
      }

      //-----回傳指令類型-----
      else if(type == "postback"){
        let data = querystring.parse(event.postback.data);
        if (data.action === 'url' && data.item === 'clarence') {
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'https://ithelp.ithome.com.tw/users/20117701/ironman/2634'
          });
        }
      }

      //-----預料外的內容，開發監測-----
      else{
        console.log(req.body.events);
      }

      //回傳
      res.sendStatus(200);
    })
  );

  module.exports = lineClientRouter;