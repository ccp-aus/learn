---
slug: universal-list
term: Universal Allow / Block list
aliases:
  - Universal Allow
  - Universal Block
short: In DNSFilter, an organisation-wide allow or block list whose entries apply to every Filtering Policy in that organisation.
related:
  - allowlist
  - blocklist
  - policy
tags: [dnsfilter, policy]
---

**Universal lists** are DNSFilter's per-organisation Allow and Block lists. An entry on a Universal Allow overrides every other block path, category, threat feed, per-policy block list, for every policy in the org. An entry on a Universal Block does the same in reverse: blocked everywhere regardless of any per-policy Allow.

Universal lists hold up to **1,000 domains each**, considerably smaller than per-policy lists (which hold up to 15,000). The smaller cap is deliberate. Universal isn't a place for ticket-driven churn; it's the shortlist of rules that genuinely apply across every policy.

That makes Universal lists useful for org-wide rules, the MSP wants every customer in this org to allow this internal tooling domain, or to block this known-compromised supplier, and dangerous when misused. A misplaced Universal Allow is the classic "one ticket became an organisation-wide hole" mistake. Default to per-policy lists; reach for Universal only when the rule genuinely needs to apply everywhere.
