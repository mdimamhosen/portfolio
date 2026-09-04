import OpenAI from 'openai';
import { getEmbeddingsCollection, hasMongo } from './mongo';
import { getChunkText, KNOWLEDGE_CHUNKS, type KnowledgeChunk } from './knowledge';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';
const TOP_K = 5;
const MIN_SIMILARITY = 0.25;

export interface EmbeddedChunk {
  id: string;
  title: string;
  content: string;
  category: string;
  embedding: number[];
}

let memoryStore: EmbeddedChunk[] | null = null;

function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return new OpenAI({ apiKey });
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embedTexts(texts: string[]): Promise<number[][]> {
  const openai = getOpenAI();
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}

export async function buildEmbeddings(force = false): Promise<EmbeddedChunk[]> {
  if (!force && memoryStore?.length) {
    return memoryStore;
  }

  if (!force && hasMongo()) {
    try {
      const collection = await getEmbeddingsCollection();
      const docs = await collection.find({}).toArray();
      if (docs.length >= KNOWLEDGE_CHUNKS.length) {
        memoryStore = docs.map((doc) => ({
          id: String(doc.id),
          title: String(doc.title),
          content: String(doc.content),
          category: String(doc.category),
          embedding: doc.embedding as number[],
        }));
        return memoryStore;
      }
    } catch (error) {
      console.warn('Failed to load embeddings from MongoDB', error);
    }
  }

  const texts = KNOWLEDGE_CHUNKS.map(getChunkText);
  const embeddings = await embedTexts(texts);

  const store: EmbeddedChunk[] = KNOWLEDGE_CHUNKS.map((chunk, index) => ({
    id: chunk.id,
    title: chunk.title,
    content: chunk.content,
    category: chunk.category,
    embedding: embeddings[index],
  }));

  memoryStore = store;

  if (hasMongo()) {
    try {
      const collection = await getEmbeddingsCollection();
      await collection.deleteMany({});
      await collection.insertMany(
        store.map((item) => ({
          ...item,
          updated_at: new Date().toISOString(),
        })),
      );
    } catch (error) {
      console.warn('Failed to persist embeddings to MongoDB', error);
    }
  }

  return store;
}

async function retrieveRelevantChunks(query: string): Promise<Array<EmbeddedChunk & { score: number }>> {
  const store = await buildEmbeddings(false);
  const [queryEmbedding] = await embedTexts([query]);

  return store
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K)
    .filter((chunk) => chunk.score >= MIN_SIMILARITY);
}

const SYSTEM_PROMPT = `You are the portfolio assistant for Md. Imam Hosen, a Software Engineer.

STRICT RULES:
1. Answer ONLY using the provided context about Md. Imam Hosen, his skills, experience, projects, venture (CoHost), and contact details.
2. If the answer is not in the context, say you don't have that information in this portfolio and suggest contacting him.
3. Never invent projects, employers, dates, skills, or personal details.
4. Never answer general knowledge, coding homework, news, or unrelated questions unless they clearly relate to Imam's portfolio context.
5. Be concise, professional, and friendly.
6. When relevant, mention contact email mimam22.cse@bu.ac.bd or WhatsApp +8801733570761.`;

export async function answerWithRag(
  question: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
): Promise<{ answer: string; sources: string[] }> {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      answer: 'Please ask a question about Md. Imam Hosen, his skills, experience, or projects.',
      sources: [],
    };
  }

  const retrieved = await retrieveRelevantChunks(trimmed);

  if (retrieved.length === 0) {
    return {
      answer:
        "I can only answer questions about Md. Imam Hosen based on his portfolio. I don't have enough matching information for that question. Try asking about his experience, skills, projects, CoHost, or how to contact him.",
      sources: [],
    };
  }

  const context = retrieved
    .map((chunk, i) => `[${i + 1}] ${chunk.title}\n${chunk.content}`)
    .join('\n\n');

  const openai = getOpenAI();
  const recentHistory = history.slice(-6).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.2,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'system',
        content: `PORTFOLIO CONTEXT (use only this):\n\n${context}`,
      },
      ...recentHistory,
      { role: 'user', content: trimmed },
    ],
  });

  const answer =
    completion.choices[0]?.message?.content?.trim() ||
    "I couldn't generate an answer right now. Please try again or contact Imam directly.";

  return {
    answer,
    sources: retrieved.map((chunk) => chunk.title),
  };
}

export function listKnowledge(): KnowledgeChunk[] {
  return KNOWLEDGE_CHUNKS;
}
