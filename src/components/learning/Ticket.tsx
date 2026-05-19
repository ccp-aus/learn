import * as React from "react";
import { Paperclip, AtSign, Phone, MessageSquare, MailOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type Channel = "email" | "phone" | "chat" | "portal";
type Priority = "P1" | "P2" | "P3" | "P4";

interface Attachment {
  name: string;
  /** Optional size label, e.g. "12 KB". Cosmetic only. */
  size?: string;
}

interface Props {
  id: string;
  subject: string;
  customer: string;
  contact: string;
  channel?: Channel;
  priority?: Priority;
  /** Body as a single string with \n line breaks. Rendered as plain text. */
  body: string;
  attachments?: Attachment[];
  /** Optional received-at label, e.g. "2 minutes ago" or "2026-03-05 09:12". */
  received?: string;
  className?: string;
}

const channelIcons: Record<Channel, React.ComponentType<{ className?: string }>> = {
  email: MailOpen,
  phone: Phone,
  chat: MessageSquare,
  portal: AtSign,
};

const priorityClasses: Record<Priority, string> = {
  P1: "bg-rose-500/15 text-rose-500 border-rose-500/40",
  P2: "bg-amber-500/15 text-amber-500 border-amber-500/40",
  P3: "bg-sky-500/15 text-sky-500 border-sky-500/40",
  P4: "bg-muted text-muted-foreground border-border",
};

/**
 * Ticket — render a fake support ticket for scenario lessons. Pure
 * presentation. Pair with a DecisionTree, Console, or Checkpoint that
 * asks the learner what their next move is, so the cognitive load of
 * reading a real ticket *is* part of the exercise.
 *
 * Vendor styling is intentionally generic (no Halo/Autotask/ConnectWise
 * branding) so the same component renders across vendors.
 */
export function Ticket({
  id,
  subject,
  customer,
  contact,
  channel = "email",
  priority,
  body,
  attachments = [],
  received,
  className,
}: Props) {
  const ChannelIcon = channelIcons[channel];
  return (
    <article
      className={cn(
        "my-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm",
        className,
      )}
      aria-label={`Ticket ${id}: ${subject}`}
    >
      <header className="border-b border-border bg-muted/40 px-5 py-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-xs text-muted-foreground">{id}</span>
          {priority && (
            <span
              className={cn(
                "rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
                priorityClasses[priority],
              )}
            >
              {priority}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            <ChannelIcon className="h-3 w-3" />
            {channel}
          </span>
          {received && (
            <span className="ml-auto text-[11px] text-muted-foreground">
              {received}
            </span>
          )}
        </div>
        <h3 className="mt-1 text-base font-semibold tracking-tight">
          {subject}
        </h3>
      </header>
      <div className="grid gap-1 border-b border-border bg-background/40 px-5 py-3 text-xs text-muted-foreground sm:grid-cols-2">
        <div>
          <span className="text-foreground/60">Customer:</span>{" "}
          <span className="text-foreground/90">{customer}</span>
        </div>
        <div>
          <span className="text-foreground/60">Contact:</span>{" "}
          <span className="text-foreground/90">{contact}</span>
        </div>
      </div>
      <div className="whitespace-pre-wrap px-5 py-4 text-sm leading-relaxed text-foreground/90">
        {body}
      </div>
      {attachments.length > 0 && (
        <footer className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/30 px-5 py-3 text-xs">
          <span className="text-muted-foreground">Attachments:</span>
          {attachments.map((a) => (
            <span
              key={a.name}
              className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-0.5 font-mono"
            >
              <Paperclip className="h-3 w-3 text-muted-foreground" />
              {a.name}
              {a.size && (
                <span className="text-muted-foreground/70">· {a.size}</span>
              )}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}

export default Ticket;
