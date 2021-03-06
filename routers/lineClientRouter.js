require('dotenv').config();
const { LineClient } = require('messaging-api-line');
const express = require('express');
const expressAsyncHandler = require("express-async-handler");
const fs = require('fs');

const lineClientRouter = express.Router();
const Student = require('../models/studentModel');

const connect_input_template = require('../template/connect-input-template.json');
const setting_tmeplate = require('../template/setting-tmeplate.json');

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
      const { type, message, postback, source, replyToken } = req.body.events[0];
      
      //-----訊息分類-----
      if(type == 'message'){

//#region -----連結設定-----
        if(message.text == '連結設定'){
        
          //取得template，以Json方式值轉換方式，可避免指向相同的記憶體位置
          let flexMessage = JSON.parse(JSON.stringify(connect_input_template));
          //傳送資料到特定id使用者
          await client.pushFlex(source.userId, '[connect_input_template]', flexMessage);

          //Wait for seconds
          await new Promise(resolve => setTimeout(resolve, 500));

          await client.pushText(source.userId, '姓名:\n學號:\n第幾宿舍:\n樓層:\n幾房:')
        }
//#endregion -----連結設定-----

//#region -----輸入初始資料-----
        //以正規式檢查資料傳入的是正確格式
        const rule = /姓名\:[\u4e00-\u9fa5_a-zA-Z0-9\s]+學號\:[\u4e00-\u9fa5_a-zA-Z0-9\s]+第幾宿舍\:[\u4e00-\u9fa5_a-zA-Z0-9\s]+樓層\:[\u4e00-\u9fa5_a-zA-Z0-9\s]+幾房\:/;
        if(rule.test(message.text)){

          //搜尋此帳號是否已經連結
          const existStudent = await Student.findOne({lineUID: source.userId});
          //此帳號已存在
          if(existStudent){

            //傳送錯誤資訊
            await client.pushText(source.userId, '此Line帳號已與下方資訊連結 \n如果對此沒印象或想更改 \n請洽輸入"設定" \n----- \n' + JSON.stringify({
              'name':existStudent.name,
              'userID':existStudent.userID,
            }));
            
            //結束
            res.sendStatus(200);
            return;
          }

          //用正規式將輸入拆開，例如"姓名:123\n學號:\n第幾宿舍:7" -> ["姓名", "123", "學號", "", "第幾宿舍", "7"]
          let input = message.text.split(/[\s,:]/);

          //記錄錯誤
          let errorMsg = '';
          //偵測是否有漏輸入的項目
          if(input[1] == '') errorMsg += '姓名  <-不可為空白\n';
          if(input[3] == '') errorMsg += '學號  <-不可為空白\n';
          if(input[5] == '') errorMsg += '宿舍  <-不可為空白\n';
          if(input[7] == '') errorMsg += '樓層  <-不可為空白\n';
          if(input[9] == '') errorMsg += '房號  <-不可為空白\n';

          //如果有錯誤訊息
          if(errorMsg != ''){

            //回傳錯誤訊息
            errorMsg += '-----\n 請重新輸入';
            await client.pushText(source.userId, errorMsg);
            
            //結束
            res.sendStatus(200);
            return;
          }

          //建立學生model物件
          const newStudent = new Student({
            lineUID: source.userId,
            name: input[1],
            userID: input[3],
            dormID: input[5],
            floorID: input[7],
            roomID: input[9]
          });

          //儲存學生資訊
          const createdStudent = await newStudent.save();
          
          //傳送成功資訊
          await client.pushText(source.userId, '連結成功');

          //結束
          res.sendStatus(200);
          return;
        }
//#endregion -----輸入初始資料-----

//#region -----設定-----
        if(message.text == '設定'){

          //取得template，以Json方式值轉換方式，可避免指向相同的記憶體位置
          let flexMessage = JSON.parse(JSON.stringify(setting_tmeplate));

          //搜尋此帳號是否已經連結
          const existStudent = await Student.findOne({lineUID: source.userId});
          //已經連結
          if(existStudent){

            flexMessage['body']['contents'][0]['text'] = '此帳號已經連結下方資訊\n\n' + JSON.stringify({
              '姓名':existStudent.name,
              '學號':existStudent.userID,
              '宿舍':existStudent.dormID,
              '樓層':existStudent.floorID,
              '房號':existStudent.roomID
            }) + '\n\n如需修改資訊\n斷開連結後\n輸入"設定"再次連結';

            //刪除用不到的按鈕
            flexMessage['footer']['contents'].splice(0, 1);
          }
          //尚未連接
          else{

            flexMessage['body']['contents'][0]['text'] = '此帳號尚未連接';

            //刪除用不到的按鈕
            flexMessage['footer']['contents'].splice(1, 1);
          }

          //傳送資料到特定id使用者
          await client.pushFlex(source.userId, '[setting_tmeplate]', flexMessage);
        }

        if(message.text == 'test') {
          await client.pushFlex(source.userId, '[setting_tmeplate]', require('../template/bubble-template.json'));
        }
//#endregion -----設定-----
      }


      //-----回傳指令類型-----
      else if(type == 'postback'){
        // let data = querystring.parse(event.postback.data);
        // if (data.action === 'url' && data.item === 'clarence') {
        //   return client.replyMessage(event.replyToken, {
        //     type: 'text',
        //     text: 'https://ithelp.ithome.com.tw/users/20117701/ironman/2634'
        //   });

//#region -----中斷連結-----
        if(postback.data == 'disconnect'){

          //搜尋此帳號資料並刪除
          await Student.findOneAndDelete({lineUID: source.userId});

          //傳送成功資訊
          await client.pushText(source.userId, '已中斷連結');
        }
//#endregion -----中斷連結-----   

      }

      //-----預料外的內容，開發監測-----
      else{
        console.log(req.body.events[0]);
      }

      //回傳
      res.sendStatus(200);
    })
  );

  module.exports = lineClientRouter;