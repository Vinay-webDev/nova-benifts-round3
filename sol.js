const fs = require("fs");
const { parser } = require("stream-json");
const { streamValues } = require("stream-json/streamers/StreamValues");

const key1 = "order_c9720673";
const key2 = "order_56b86582";
const key3 = "order_3cb1778c";

const getOrderData = function (key) {const pipeline = fs
  .createReadStream("output.json")
  .pipe(parser())
  .pipe(streamValues());

pipeline.on("data", ({ value }) => {
  if (value && value.hasOwnProperty(key)) {
    console.log("Orderid =>", key);
    console.log("Offers =>", value[key]);
    console.log("Total Offers =>", value[key].length);
    console.log("///////////////////////////////////");
    pipeline.destroy();
  }
});

pipeline.on("end", () => {
  console.log("Key not found.");
});}


getOrderData(key1);
getOrderData(key2);
getOrderData(key3);

/* 
//output//
Orderid => order_c9720673
Offers => [
  'offer_bf43a453', 'offer_fd523187',
  'offer_b6658b57', 'offer_1d11a557',
  'offer_3854dd37', 'offer_4b940606',
  'offer_7e639f67', 'offer_13c3fc42',
  'offer_8cfa0590', 'offer_1065e2d4',
  'offer_16decad0', 'offer_30eb2a5e',
  'offer_26871e9c', 'offer_e69b5f2f'
]
Total Offers => 14
///////////////////////////////////
Orderid => order_56b86582
Offers => [
  'offer_d2ddd61f',
  'offer_614ec7f1',
  'offer_c7816ffb',
  'offer_563c9db9',
  'offer_53d19d5e',
  'offer_d0e376b3',
  'offer_f1c16a1c',
  'offer_0815d5d2'
]
Total Offers => 8
///////////////////////////////////
Orderid => order_3cb1778c
Offers => [
  'offer_8c0d7a81', 'offer_c08c40f6',
  'offer_b70e43f1', 'offer_64ae1737',
  'offer_c9444e6e', 'offer_cd408750',
  'offer_37a1b3ba', 'offer_8db30782',
  'offer_601b6715', 'offer_88e6a9a2',
  'offer_27b8b175', 'offer_0b2aa534',
  'offer_fa0f8c31', 'offer_d3eda281',
  'offer_1a591387'
]
Total Offers => 15
///////////////////////////////////
*/

