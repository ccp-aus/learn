---
slug: dns
term: DNS
aliases:
  - Domain Name System
short: Domain Name System, the internet's phonebook. Translates human-readable names like "example.com" into IP addresses computers actually connect to.
related:
  - dns-filtering
  - dns-resolver
tags: [networking, fundamentals]
---

**DNS** turns names into numbers. When a user opens `example.com`, the operating system asks a *DNS resolver* "what IP do I send packets to?" The resolver walks the DNS hierarchy (root → TLD → authoritative nameserver) and returns an answer. The browser then connects to that IP.

Why an MSP cares: every web request, every cloud login, every Microsoft 365 sync starts with a DNS lookup. Owning the DNS resolver path means you can:

- **Block malicious domains** before any TCP connection happens (the basis of [DNS filtering](/glossary/dns-filtering/))
- **Filter inappropriate content** by category
- **See what's actually being accessed** across an entire fleet without installing endpoint agents
- **Speed up resolution** with anycast resolvers near the user

Common managed-DNS-resolver products in the MSP world: DNSFilter, Cisco Umbrella, Cloudflare Gateway, Webroot DNS Protection.
