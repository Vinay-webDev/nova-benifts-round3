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

const url = "https://public-r2.novabenefits.com/seq.ndjson";

//so this function waits for us to read data line by line and chunk after chunck (no re fetch);
async function streamNDJSON(url, onLine) {
  const res = await fetch(url);
  const decoder = new TextDecoder();
  const reader = res.body.getReader();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    let lines = buffer.split('\n');

    buffer = lines.pop();
    for (let line of lines) {
      if (!line.trim()) continue;
      try {
        const obj = JSON.parse(line);
        await onLine(obj);
      } catch (e) {
        console.error("Invalid JSON line:", line);
      }
    }
  }

  if (buffer.trim()) {
    try {
      const obj = JSON.parse(buffer);
      await onLine(obj);
    } catch (e) {
      console.error("Final line invalid:", buffer);
    }
  }
}

async function processOffersStream() {
  const idToEvent = new Map();     
  const orderToOffers = new Map(); 

  const seenOfferIds = new Set();

  function tryResolveChain(offer) {
    const chain = [];

    let current = offer;
    while (current) {
      if (current.type === 'order') {
        const orderId = current.id;
        if (!orderToOffers.has(orderId)) {
          orderToOffers.set(orderId, []);
        }

        const offers = orderToOffers.get(orderId);
        for (let i = chain.length - 1; i >= 0; i--) {
          const offer = chain[i];
          if (!seenOfferIds.has(offer.id)) {
            offers.push(offer);
            seenOfferIds.add(offer.id);
          }
          idToEvent.delete(offer.id);
        }
        idToEvent.delete(orderId);
        break;
      }

      if (current.type === 'offer') {
        chain.push(current);
        current = idToEvent.get(current.parent);
      } else {
        break;
      }
    }
  }

  await streamNDJSON(url, async (event) => {
    idToEvent.set(event.id, event);

    if (event.type === 'offer') {
      tryResolveChain(event);
    }
  });

  for (let [orderId, offers] of orderToOffers.entries()) {
    console.log(orderId, "=>", offers.map(o => o.id));
  }
}

processOffersStream();



// I took AI help to code this














