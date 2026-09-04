import OpenAI from 'openai';
import { getChunkText, KNOWLEDGE_CHUNKS, type KnowledgeChunk } from './knowledge';

const CHAT_MODEL =
  process.env.DEEPSEEK_CHAT_MODEL ||
  process.env.DEEPSEEK_COHOST_AGENT_MODEL ||
  'deepseek-chat';
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const TOP_K = 6;
const MIN_SCORE = 0.05;

export interface ScoredChunk {
  id: string;
  title: string;
  content: string;
  category: string;
  score: number;
}

function getDeepSeek(): OpenAI {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not set');
  }
  return new OpenAI({
    apiKey,
    baseURL: DEEPSEEK_BASE_URL,
  });
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-/@\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function scoreChunk(query: string, chunk: KnowledgeChunk): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;

  const titleTokens = new Set(tokenize(chunk.title));
  const contentTokens = tokenize(getChunkText(chunk));
  const contentSet = new Set(contentTokens);
  const categoryTokens = new Set(tokenize(chunk.category));

  let score = 0;
  for (const token of queryTokens) {
    if (titleTokens.has(token)) score += 3;
    if (categoryTokens.has(token)) score += 1.5;
    if (contentSet.has(token)) score += 1;

    // Partial / phrase-friendly boosts
    if (chunk.title.toLowerCase().includes(token)) score += 0.5;
    if (chunk.content.toLowerCase().includes(token)) score += 0.25;
  }

  // Normalize by query length so short queries aren't under-scored oddly
  return score / Math.sqrt(queryTokens.length);
}

function retrieveRelevantChunks(query: string): ScoredChunk[] {
  const scored = KNOWLEDGE_CHUNKS.map((chunk) => ({
    id: chunk.id,
    title: chunk.title,
    content: chunk.content,
    category: chunk.category,
    score: scoreChunk(query, chunk),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K)
    .filter((chunk) => chunk.score >= MIN_SCORE);

  // If nothing matched well but the question is portfolio-related, fall back to identity + contact
  if (scored.length === 0) {
    return KNOWLEDGE_CHUNKS.filter((c) => c.id === 'identity' || c.id === 'contact').map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      content: chunk.content,
      category: chunk.category,
      score: 0,
    }));
  }

  return scored;
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

  const retrieved = retrieveRelevantChunks(trimmed);

  const context = retrieved
    .map((chunk, i) => `[${i + 1}] ${chunk.title}\n${chunk.content}`)
    .join('\n\n');

  const deepseek = getDeepSeek();
  const recentHistory = history.slice(-6).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const completion = await deepseek.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.2,
    max_tokens: 800,
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

  const message = completion.choices[0]?.message as
    | { content?: string | null; reasoning_content?: string | null }
    | undefined;

  const answer =
    message?.content?.trim() ||
    message?.reasoning_content?.trim() ||
    "I couldn't generate an answer right now. Please try again or contact Imam directly.";

  return {
    answer,
    sources: retrieved.map((chunk) => chunk.title),
  };
}

export function listKnowledge(): KnowledgeChunk[] {
  return KNOWLEDGE_CHUNKS;
}

/** Kept for /api/ingest compatibility — DeepSeek has no embeddings API. */
export async function buildEmbeddings(_force = false) {
  return KNOWLEDGE_CHUNKS.map((chunk) => ({
    id: chunk.id,
    title: chunk.title,
    content: chunk.content,
    category: chunk.category,
  }));
}
