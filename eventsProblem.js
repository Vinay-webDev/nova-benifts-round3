//problems
/* 
1. events list is huge and deeply nested
2. can't able to load all events in memory to work with!!
3. events are not returned in order by API!!!
*/
//so I need to make a program that I can group all different offers events that are linked and are from one parent. 
//so I need to create a map so that I can make 
/* 
{
    order1: [offers1, offers2, offer3,....],
    order2: [offers1, offers2, offer3,....]
}
*/
// so my brute force approach is to go line by line without re-fetching the nd.json data
// re-fetching not good because it gives data in different order next time
// so I need to go like line by line without actually loading full data 
// so I need to wait for chunk then proceed with another chunk up until I get the parent;
//so should wait for us to read data line by line and chunk after chunck (no re fetch);

const https = require("https");
const readline = require("readline");

const url = "https://public-r2.novabenefits.com/seq.ndjson";

https.get(url, (res) => {
  const rl = readline.createInterface({ input: res });

  const offers = new Map();
  const orderOffers = new Map();
  const parents = new Map();

  rl.on("line", (line) => {
    let obj;
    try {
      obj = JSON.parse(line);
    } catch (e) {
      return;
    }

    if (obj.type === "order") {
      orderOffers.set(obj.id, []);
      if (offers.has(obj.id)) {
        orderOffers.get(obj.id).push(...offers.get(obj.id));
        offers.delete(obj.id);
      }
    } else if (obj.type === "offer") {
      parents.set(obj.id, obj.parent);

      let root = obj.parent;
      while (parents.has(root)) {
        root = parents.get(root);
      }

      if (orderOffers.has(root)) {
        orderOffers.get(root).push(obj.id);
      } else {
        if (!offers.has(root)) offers.set(root, []);
        offers.get(root).push(obj.id);
      }
    }
  });

  rl.on("close", () => {
    for (const [order, offerList] of orderOffers.entries()) {
      console.log(order + " =>", offerList);
    }
  });
});


// I took full AI help to code this














