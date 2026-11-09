import 'server-only';
import { Collection, Db, GridFSBucket, MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'portfolio';
const visitorsCollectionName = process.env.MONGODB_VISITORS_COLLECTION || 'visitors';
const embeddingsCollectionName = process.env.MONGODB_EMBEDDINGS_COLLECTION || 'rag_embeddings';

// Cached on globalThis so dev hot reloads and warm serverless invocations reuse one pool.
const cache = globalThis as unknown as { _mongo?: Promise<MongoClient>; _mongoIndexes?: Promise<unknown> };

async function getClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  cache._mongo ??= MongoClient.connect(uri, { maxPoolSize: 5 }).catch((error) => {
    cache._mongo = undefined;
    throw error;
  });
  return cache._mongo;
}

export function hasMongo(): boolean {
  return Boolean(uri);
}

export async function getDb(): Promise<Db> {
  const db = (await getClient()).db(dbName);
  cache._mongoIndexes ??= ensureIndexes(db).catch((error) => {
    cache._mongoIndexes = undefined;
    console.error('Mongo index setup failed', error);
  });
  return db;
}

// Idempotent; runs once per cold start.
function ensureIndexes(db: Db) {
  return Promise.all([
    db.collection('blog_articles').createIndex({ slug: 1 }, { unique: true }),
    db.collection('blog_articles').createIndex({ id: 1 }, { unique: true }),
    db.collection('blog_articles').createIndex({ status: 1, published_at: -1 }),
    db.collection('blog_login_attempts').createIndex({ attempted_at: 1 }, { expireAfterSeconds: 15 * 60 }),
    db.collection('peer_presence').createIndex({ peer_id: 1 }, { unique: true }),
    db.collection('peer_presence').createIndex({ updated_at: 1 }, { expireAfterSeconds: 120 }),
    db.collection('rate_limits').createIndex({ at: 1 }, { expireAfterSeconds: 60 }),
    db.collection('shared_files').createIndex({ created_at: -1 }),
    db.collection('shared_file_chunks').createIndex({ file_id: 1, n: 1 }, { unique: true }),
  ]);
}

export async function getVisitorsCollection(): Promise<Collection> {
  const db = await getDb();
  return db.collection(visitorsCollectionName);
}

export async function getEmbeddingsCollection(): Promise<Collection> {
  const db = await getDb();
  return db.collection(embeddingsCollectionName);
}

export const bucket = async (name: 'images') => new GridFSBucket(await getDb(), { bucketName: name });
