---
slug: blocklist
term: blocklist
aliases:
  - blacklist
  - block list
  - denylist
short: An explicit list of domains, IPs, applications, or senders that should always be blocked regardless of broader category rules.
related:
  - allowlist
  - policy
tags: [security, configuration]
---

The **blocklist** is the deliberate-deny list. Use it for things you've decided to refuse for reasons your category filters won't catch on their own, a competing tool the client doesn't want used, an internal lookalike phishing domain you've spotted, a known abused legitimate service.

Keep blocklists **per-client** rather than global wherever possible. One client's rejected-by-policy is another client's daily workflow.
