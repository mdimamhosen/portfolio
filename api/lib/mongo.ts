import { Collection, Db, MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'cinema_depth_flow';
const collectionName = process.env.MONGODB_VISITORS_COLLECTION || 'visitors';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Reuse the Mongo client across invocations to avoid cold-start penalties.
async function getClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  if (client) return client;
  if (!clientPromise) {
    clientPromise = MongoClient.connect(uri, {
      maxPoolSize: 5,
    });
  }
  client = await clientPromise;
  return client;
}

export async function getVisitorsCollection(): Promise<Collection> {
  const mongoClient = await getClient();
  const db: Db = mongoClient.db(dbName);
  return db.collection(collectionName);
}
