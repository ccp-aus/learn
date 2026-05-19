---
slug: aaaa-record
term: AAAA record
aliases:
  - AAAA records
  - quad-A record
short: 'DNS record mapping a name to an IPv6 address. The IPv6 equivalent of an A record.'
tags: [dns, records, ipv6]
---

Pronounced quad-A. Modern operating systems and browsers prefer IPv6 when both A and AAAA are published, falling back to IPv4 if IPv6 fails. Managed hosts (Cloudflare, M365, AWS managed services) usually publish AAAA records automatically. Mismatched A/AAAA targets on a migration are a common failure mode: IPv6-capable users see one server and IPv4-only users see another.