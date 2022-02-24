// 此程式負責 Line Bottender 功能
module.exports = async function App(context) {
    //傳送訊息
    await context.sendText('Welcome to Bottender');
    
    //取得template
    let flexMessage = (require('./template/bubbleTemplate.json'));
    //修改template內容
    flexMessage['footer']['contents'][0]['action']['label'] = '123';
  
    //傳送
    await context.sendFlex('This is an advanced flex', flexMessage);
  };
  