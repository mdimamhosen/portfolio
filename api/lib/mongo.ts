import { Collection, Db, MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'portfolio';
const visitorsCollectionName = process.env.MONGODB_VISITORS_COLLECTION || 'visitors';
const embeddingsCollectionName = process.env.MONGODB_EMBEDDINGS_COLLECTION || 'rag_embeddings';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

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

export function hasMongo(): boolean {
  return Boolean(uri);
}

export async function getDb(): Promise<Db> {
  const mongoClient = await getClient();
  return mongoClient.db(dbName);
}

export async function getVisitorsCollection(): Promise<Collection> {
  const db = await getDb();
  return db.collection(visitorsCollectionName);
}

export async function getEmbeddingsCollection(): Promise<Collection> {
  const db = await getDb();
  return db.collection(embeddingsCollectionName);
}
