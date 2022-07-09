console.log(process.env.REDISCLOUD_URL);
import { Client } from "redis-om";

const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDISCLOUD_URL ?? process.env.REDIS_URL);
  }
}

connect().then(async () => {
  console.log("db connected");
});

export default client;
