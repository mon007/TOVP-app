const development = "https://gentle-reef-30804.herokuapp.com/"; //"http://192.168.1.9:4000/"; //localhost
// const aws = "http://18.188.247.99:4000/";
const production = "https://tovpadmin.com/api/"; //Nextra One
// const heroku = "https://tovp-api.herokuapp.com/";

//  modified on 23 april 2020
//  Release Note :
//   "Support for Email and phone number updation.",
//   "New Yagya Section now available",
//   "View your completed Pledges",
//   "Major Bug Fixes",
const appVersion = 16;
const androidAppVersionName = 2.5;
const iosAppVersionName = 1.7;

const razorpayKeyLive = "rzp_live_YIBYjDxMnTajbk";
const razorpayKey_secretLive = "BmvjceB6OPMQkLmfdc3uCZF3";

const razorpayKeyTest = "rzp_test_k9Sb2Jf6pfTMXr";
const razorpayKey_secretTest = "zpnYGwfAyBjGDFt3IyPsyUaT";

const razorpayKey = razorpayKeyLive;
const razorpayKey_secret = razorpayKey_secretLive;

//Change this to switch servers
const activeUrl = production;

//don't touch this
const apiUrl = activeUrl;
const paypalApiUrl = `${activeUrl}paypal/pay`;
const notificationUrl = `${activeUrl}user/notification`;
const notificationUrlSetToken = `${activeUrl}user/registration-token`;

//custom color
const primaryColor = "#42aec2";
const titleColor = "rgba(0,0,0,0.7)"; //"#454545";
const paraColor = "#454545"; //"#9f8c90";

export {
  apiUrl,
  paypalApiUrl,
  appVersion,
  razorpayKey,
  razorpayKey_secret,
  androidAppVersionName,
  iosAppVersionName,
  notificationUrl,
  notificationUrlSetToken,
  primaryColor,
  titleColor,
  paraColor,
};
