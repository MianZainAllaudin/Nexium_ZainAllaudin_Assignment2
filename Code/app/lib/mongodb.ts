import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
let client: MongoClient | null = null;

async function getClient() {
  if (!client) {
    client = new MongoClient(uri); // No tls/ssl options!
    await client.connect();
  }
  return client;
}

export async function saveToMongo(url: string, text: string) {
  const client = await getClient();
  const db = client.db("blog_data");
  await db.collection("scraped_texts").insertOne({ url, text });
  // Do not close the client here; reuse it for future requests
}
