import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Bot, Loader2, MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.status}`);
      }

      const data = await response.json();
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
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry — the assistant is temporarily unavailable. You can email mimam22.cse@bu.ac.bd instead.',
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
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="glass-card-glow w-[min(92vw,380px)] h-[min(70vh,520px)] flex flex-col overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.06)] animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Ask about Imam</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Portfolio RAG · DeepSeek
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-white text-black rounded-br-md'
                      : 'bg-white/5 border border-white/10 text-foreground rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.sources && message.sources.length > 0 && (
                    <p className="mt-2 text-[10px] text-muted-foreground border-t border-white/10 pt-2">
                      Sources: {message.sources.slice(0, 3).join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
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
                    className="text-[11px] px-2.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground hover:border-white/25 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={onSubmit} className="p-3 border-t border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, projects…"
                className="flex-1 h-10 rounded-full bg-white/5 border border-white/10 px-4 text-sm outline-none focus:border-white/30 transition-colors"
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
        className="h-12 w-12 rounded-full bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center hover:scale-105 transition-transform"
        aria-label={open ? 'Close portfolio chat' : 'Open portfolio chat'}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PortfolioChat;
