---
slug: dns-filtering
term: DNS filtering
aliases:
  - DNS filter
  - protective DNS
  - PDNS
short: Blocking risky or policy-violating domains at the DNS resolver layer, before a TCP connection is ever attempted.
related:
  - dns
  - dns-resolver
  - policy
tags: [security, networking]
---

**DNS filtering** intercepts every DNS query a device makes and returns either the real answer or a block (NXDOMAIN, a sinkhole IP, or a redirect to a "blocked by policy" page).

Why it's the cheapest, highest-leverage security control an MSP can deploy:

- **Pre-connection enforcement**, the user's browser never even tries to reach the malicious site
- **No client agent required** for many deployments (set the resolver IPs at the network edge)
- **Visibility everywhere**, every device, IoT included, hits DNS
- **Categorisation** by threat (malware, phishing, C2) and content (gambling, social, adult)

Common products: **DNSFilter**, Cisco Umbrella, Cloudflare Gateway, WebTitan. Some operate via on-network resolver IPs; others ship a lightweight roaming client for off-LAN coverage.
