import { signEvent, getEventHash, relayInit } from "nostr-tools";
import "websocket-polyfill";

const PUBLIC_KEY =
  "e0131db0689078f518710ad970a2b37f7e1af28769238a447cf95455df72eb4a";
const PRIVATE_KEY =
  "d95b1aff5480ce7733915feca9180192c6b198d4737ab9cfee12b9ba47e085ae";
const RELAY_SERVER_URL = "wss://relay.nekolicio.us/";

const relay = relayInit(RELAY_SERVER_URL);
relay.on("connect", () => {
  console.log(`connected to ${relay.url}`);
});
relay.on("error", () => {
  console.log(`failed to connect to ${relay.url}`);
});

await relay.connect();

let event = {
  kind: 1,
  pubkey: PUBLIC_KEY,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: "hello from heidi",
};

event.id = getEventHash(event);
event.sig = signEvent(event, PRIVATE_KEY);

let pub = relay.publish(event);

pub.on("ok", () => {
  console.log(`${relay.url} has accepted our event`);
});

pub.on("failed", (reason) => {
  console.log(`failed to publish to ${relay.url}: ${reason}`);
});

setTimeout(() => {
  relay.close();
  console.log("connection closed");
}, 5000);
