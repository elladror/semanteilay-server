import { CorsOptions } from "cors";

const client = process.env.CLIENT_URL ?? "http://localhost:3000";

const whitelist = [client, client.replace("https", "http")];
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (whitelist.includes(origin as string)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

export default corsOptions;
