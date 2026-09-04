import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Loader2, MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

const SUGGESTIONS = [
  'Who is Md. Imam Hosen?',
  'What projects has he built?',
  'What is his experience?',
  'How can I contact him?',
];

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => (
    <em className="italic text-white/90">{children}</em>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="my-2 list-disc space-y-1 pl-4">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="my-2 list-decimal space-y-1.5 pl-4">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 text-white hover:text-white/80"
    >
      {children}
    </a>
  ),
  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded bg-white/10 px-1 py-0.5 text-[0.85em] font-mono">{children}</code>
  ),
};

const PortfolioChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi — I'm Imam's portfolio assistant. Ask about his skills, experience, projects, CoHost, or how to reach him. I only answer from his portfolio.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const endpoint = import.meta.env.VITE_CHAT_API_URL || '/api/chat';
      const history = nextMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(0, -1)
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail =
          typeof data?.error === 'string'
            ? data.error
            : `Chat failed (${response.status})`;
        throw new Error(detail);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer || 'No answer returned.',
          sources: Array.isArray(data.sources) ? data.sources : [],
        },
      ]);
    } catch (error) {
      console.error(error);
      const detail = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry — the assistant is temporarily unavailable (${detail}). You can email mimam22.cse@bu.ac.bd instead.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">
      {open && (
        <div className="pointer-events-auto glass-card-glow w-[min(92vw,380px)] h-[min(70vh,520px)] flex flex-col overflow-hidden border border-white/15 shadow-[0_0_80px_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Ask about Imam</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">
                  Portfolio RAG · DeepSeek
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-black/50 backdrop-blur-md">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'bg-white text-black rounded-br-md whitespace-pre-wrap'
                      : 'bg-white/10 border border-white/10 text-white/90 rounded-bl-md',
                  )}
                >
                  {message.role === 'assistant' ? (
                    <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
                  ) : (
                    message.content
                  )}
                  {message.sources && message.sources.length > 0 && (
                    <p className="mt-2 text-[10px] text-white/45 border-t border-white/10 pt-2">
                      Sources: {message.sources.slice(0, 3).join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-md px-3 py-2 text-sm text-white/70 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Retrieving portfolio context…
                </div>
              </div>
            )}

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => void sendMessage(suggestion)}
                    className="text-[11px] px-2.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white hover:border-white/30 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={onSubmit}
            className="p-3 border-t border-white/10 bg-black/40 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, projects…"
                className="flex-1 h-10 rounded-full bg-white/10 border border-white/15 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                className="rounded-full h-10 w-10 bg-white text-black hover:bg-white/90"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="pointer-events-auto h-14 w-14 rounded-full bg-white text-black border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.35)] flex items-center justify-center hover:scale-105 transition-transform"
        aria-label={open ? 'Close portfolio chat' : 'Open portfolio chat'}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PortfolioChat;
