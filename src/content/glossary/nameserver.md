---
slug: nameserver
term: nameserver
aliases:
  - nameservers
  - authoritative nameserver
  - authoritative nameservers
short: The server that holds and answers DNS queries for a zone. The "DNS host" for a domain is whoever runs its nameservers, identified by the NS delegation at the registrar.
related:
  - dns
  - dns-resolver
tags: [dns, fundamentals]
---

A **nameserver** is the authoritative source for a zone's DNS records. When a recursive resolver walks the DNS hierarchy looking up `example.com`, the final step is asking that domain's nameservers, and the answer they give is what gets cached and returned to the user.

Domains have at least two nameservers for redundancy. The registrar stores a small **NS delegation** record at the registry pointing at them. Resolvers follow that delegation; the records on those nameservers are what the world reads.

Most MSP-managed domains have nameservers run by a managed DNS host (Cloudflare, Microsoft 365 DNS, AWS Route 53, the registrar's own DNS service, or the customer's web host). When a customer says "DNS isn't working", the first sanity check is `nslookup -type=ns <domain>`, then comparing the result against the panel you were about to edit.
