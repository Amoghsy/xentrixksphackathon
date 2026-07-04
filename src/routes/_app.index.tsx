import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {
  Send,
  Mic,
  ChevronDown,
  ChevronRight,
  Sparkles,
  History,
  FileDown,
  Bot,
  User as UserIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SEED_SESSION, HISTORY_SESSIONS, type ChatMessage, type RichData } from "@/mocks/chat";
import { askAssistant } from "@/services/assistant";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [{ title: "Chat Assistant — Crime Intelligence Assistant" }],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Show robbery cases in Bengaluru last 6 months",
  "Which accused have 3+ FIRs?",
  "Show network around Accused A12",
  "Crime trend for cybercrime this year",
  "Total open cases this month?",
];

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_SESSION.messages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: q,
      ts: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const reply = await askAssistant(q);
      setMessages((m) => [...m, reply]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <div className="flex h-full">
      {/* Main chat column */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between border-b border-border bg-card px-5 py-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h1 className="text-sm font-semibold">Chat Assistant</h1>
              <Badge variant="secondary" className="text-[10px] font-medium">
                Explainable NL → SQL
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Natural-language queries against the Karnataka SCRB crime records database.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistoryOpen((v) => !v)}
              className="gap-1.5"
            >
              <History className="h-3.5 w-3.5" /> History
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success("Export prepared", { description: "Print dialog opened for PDF export." });
                setTimeout(() => window.print(), 200);
              }}
              className="gap-1.5"
            >
              <FileDown className="h-3.5 w-3.5" /> Export PDF
            </Button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-6 space-y-5">
          {messages.map((m) => (
            <MessageRow key={m.id} m={m} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
              <Bot className="h-4 w-4" /> Assistant is analysing the request…
            </div>
          )}
        </div>

        <div className="border-t border-border bg-card px-5 py-3">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs rounded-full border border-border bg-background px-3 py-1 hover:border-primary hover:text-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={2}
                placeholder="Ask about FIRs, offenders, districts, or trends…"
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <button
                  onClick={() => setMicOn((v) => !v)}
                  className={cn(
                    "h-8 w-8 rounded flex items-center justify-center hover:bg-accent",
                    micOn && "bg-destructive/10 text-destructive",
                  )}
                  title="Voice input (mock)"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">
                  EN
                </span>
              </div>
            </div>
            <Button onClick={() => send(input)} disabled={loading || !input.trim()} className="h-11 px-4">
              <Send className="h-4 w-4 mr-1.5" /> Send
            </Button>
          </div>
          <div className="text-[11px] text-muted-foreground mt-2">
            Responses include the generated SQL and row count for explainability. Every query is audited.
          </div>
        </div>
      </div>

      {/* History drawer */}
      {historyOpen && (
        <aside className="w-72 border-l border-border bg-card overflow-y-auto scrollbar-thin animate-in slide-in-from-right duration-200">
          <div className="px-4 py-3 border-b border-border">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Conversation history
            </div>
          </div>
          <ul className="p-2 space-y-1">
            {HISTORY_SESSIONS.map((s) => (
              <li key={s.id}>
                <button className="w-full text-left rounded px-3 py-2 hover:bg-accent">
                  <div className="text-sm font-medium truncate">{s.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {format(new Date(s.updatedAt), "d MMM · HH:mm")}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}

function MessageRow({ m }: { m: ChatMessage }) {
  const [showSql, setShowSql] = useState(false);
  const isUser = m.role === "user";

  return (
    <div className={cn("flex gap-3 animate-in fade-in duration-300", isUser && "justify-end")}>
      {!isUser && (
        <div className="h-8 w-8 rounded flex items-center justify-center bg-primary/10 text-primary shrink-0">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div className={cn("max-w-[80%] min-w-0", isUser && "order-1")}>
        <div
          className={cn(
            "rounded-md px-4 py-3 text-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border-l-2 border-l-primary border border-border shadow-xs",
          )}
        >
          <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
          {m.data && (
            <div className="mt-3">
              <RichCard data={m.data} />
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground",
            isUser && "justify-end",
          )}
        >
          <span>{format(new Date(m.ts), "d MMM · HH:mm")}</span>
          {!isUser && m.sql && (
            <button
              onClick={() => setShowSql((v) => !v)}
              className="inline-flex items-center gap-0.5 hover:text-foreground"
            >
              {showSql ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Show reasoning · {m.rows} row{m.rows === 1 ? "" : "s"}
            </button>
          )}
        </div>

        {!isUser && showSql && m.sql && (
          <pre className="mt-2 rounded border border-border bg-muted/60 p-3 text-[11px] font-mono leading-relaxed overflow-x-auto text-foreground">
{m.sql}
          </pre>
        )}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function RichCard({ data }: { data: RichData }) {
  if (data.kind === "stat") {
    const up = (data.delta ?? 0) >= 0;
    return (
      <div className="rounded border border-border bg-background p-3 text-foreground">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{data.title}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">{data.value}</span>
          {data.unit && <span className="text-xs text-muted-foreground">{data.unit}</span>}
          {data.delta !== undefined && (
            <span className={cn("text-xs font-medium", up ? "text-success" : "text-destructive")}>
              {up ? "▲" : "▼"} {Math.abs(data.delta).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    );
  }

  if (data.kind === "table") {
    return (
      <div className="rounded border border-border bg-background text-foreground overflow-hidden">
        <div className="px-3 py-2 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
          {data.title}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                {data.columns?.map((c) => (
                  <th key={c} className="text-left px-3 py-2 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows?.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  {r.map((cell, j) => (
                    <td key={j} className="px-3 py-2 tabular-nums">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // chart
  const Comp = data.chartKind === "line" ? LineChart : BarChart;
  return (
    <div className="rounded border border-border bg-background p-3 text-foreground">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
        {data.title}
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <Comp data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid var(--color-border)",
                background: "var(--color-card)",
              }}
            />
            {data.chartKind === "line" ? (
              <Line dataKey="value" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }} />
            ) : (
              <Bar dataKey="value" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
            )}
          </Comp>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
