module.exports = async function App(context) {
  await context.sendText('Welcome to Bottender');

  // await context.sendButtonsTemplate('this is a buttons template', {
  //   thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
  //   title: 'Menu',
  //   text: 'Please select',
  //   actions: [
  //     {
  //       type: 'postback',
  //       label: 'Add to cart',
  //       data: 'action=add&itemid=123',
  //     },
  //     {
  //       type: 'uri',
  //       label: 'View detail',
  //       uri: 'http://example.com/page/123',
  //     },
  //   ],
  // })
  
  let flexMessage = (require('../template/bubbleTemplate.json'));
  flexMessage['footer']['contents'][0]['action']['label'] = '123';


  await context.sendFlex('This is an advanced flex', flexMessage);
};
