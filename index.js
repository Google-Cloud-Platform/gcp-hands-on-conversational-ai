const {
  dialogflow,
  Suggestions,
  Permission,
  Carousel,
  Image,
  Table,
  List,
} = require('actions-on-google');

require('dotenv').config()

const GoogleMap = require('./processors/GoogleMap.js');
const functions = require('firebase-functions');
const app = dialogflow();

app.intent('RequestTaxi', async (conv, params) => {
  console.log('====>Request Taxi');
  console.log(JSON.stringify(conv));
  const config = {
      //projectId: process.env.PROJECT_ID, 
      //location: process.env.LOCATION,
      key: process.env.MAP_KEY,
      date: params.date ? new Date(params.date) : null,
      time: params.time ? new Date(params.time) : null,
      location: params.location['street-address'] ? 
                              params.location['street-address'] : 
                              params.location['business-name'],
      keyFile: 'keys/service-account-key.json'
  };  
  console.log(`You want to got to ${config.location} at ${config.time}`);
  const map = new GoogleMap(config);
  const coordinates = await map.getGeoCoordinates(config.location);
  conv.ask(`你要到 ${config.location}，座標:${JSON.stringify(coordinates)} 在 ${config.time}`);
});

app.intent('Default Welcome Intent', (conv) => {
  const permissions = ['NAME'];
  // https://developers.google.com/actions/assistant/guest-users
  if (conv.user.verification === 'VERIFIED') {
    // Could use DEVICE_COARSE_LOCATION instead for city, zip code
    permissions.push('DEVICE_PRECISE_LOCATION');
  }
  let context = '';
  const options = {
    context,
    permissions,
  };
  conv.ask(new Permission(options));
});

app.intent('Default Welcome Intent - yes', (conv, params, confirmationGranted) => {
  //  ** This Event handler is triggered by Event setting in an Intent
  console.log(JSON.stringify(conv));
  const {location} = conv.device;
  const {name} = conv.user;
  if (confirmationGranted && name && location) {
    conv.ask(`好的， ${name.display}, 我將您的上車地點設定為 ` +
      `${location.formattedAddress}`);
  } else {
    conv.ask(`很抱歉，我需要您的地址才能為您服務`);
    conv.close();
  }
});

exports.agent = app;