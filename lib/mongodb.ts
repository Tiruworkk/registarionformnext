import { MongoClient } from "mongodb";
 
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn("MONGODB_URI is not set. Database operations will fail until it is configured.");
}

let client: MongoClient; 
let clientPromise: Promise<MongoClient>;

declare global {
  // Allow a global variable in development to preserve the client across module reloads
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  clientPromise = Promise.reject(new Error("MONGODB_URI not configured"));
} else {
  client = new MongoClient(uri);

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = client.connect();
  }
}

export default clientPromise;
