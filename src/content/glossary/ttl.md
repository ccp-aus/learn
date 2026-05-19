---
slug: ttl
term: TTL
aliases:
  - time to live
  - time-to-live
short: Time To Live, the number of seconds a DNS resolver may cache a record before re-querying. Shorter TTLs make changes propagate faster but increase query load on the authoritative nameserver.
related:
  - dns
  - dns-resolver
tags: [dns, fundamentals]
---

**TTL** is how long a resolver is allowed to keep an answer in cache before re-asking the authoritative nameserver. Set on every DNS record, in seconds. Common values: `300` (5 minutes), `3600` (1 hour), `86400` (1 day).

Short TTL: changes show up everywhere within a few minutes; more queries hit the nameserver. Long TTL: changes take longer to propagate; less load. The trade-off is mostly invisible until a cutover, when "wait the TTL" is the answer to "when will the change be live".

For planned migrations, the standard pattern is **pre-stage**: drop the TTL to 300 seconds 24 hours ahead of the change, save, then make the change at the planned window. After verifying stable, restore the TTL to its original value. This means the actual cutover and any rollback both take five minutes instead of an hour.

A TTL the customer sets today affects how fast their *next* change propagates, not the current one.
