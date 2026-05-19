---
slug: allowlist
term: allowlist
aliases:
  - whitelist
  - allow list
short: An explicit list of domains, IPs, applications, or senders that should be permitted even when broader rules would block them.
related:
  - blocklist
  - policy
tags: [security, configuration]
---

The **allowlist** is the override hatch. When a category-based block catches something legitimate (a vendor portal categorised as "uncategorised", a client's own bespoke SaaS), you allowlist the specific domain rather than weakening the broader category.

Two anti-patterns to avoid:

1. **Blanket allowing a category** because one site in it broke, usually you want a single domain entry instead.
2. **Forgetting to scope it**, allowlist a domain at the per-client policy when only that client needs it; not at the global level.
