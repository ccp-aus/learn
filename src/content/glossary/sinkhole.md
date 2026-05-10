---
slug: sinkhole
term: sinkhole
aliases:
  - DNS sinkhole
short: Returning a deliberately wrong answer (or a controlled IP) for a DNS query so the client never reaches the real (malicious) destination.
related:
  - dns-filtering
  - dns-resolver
tags: [security, networking]
---

When a protective DNS resolver decides to **block** a query, it doesn't just refuse, it returns a controlled answer. That answer is the **sinkhole**. Common patterns:

- Return `NXDOMAIN`, the client thinks the domain doesn't exist
- Return a vendor-controlled IP that hosts a "blocked by policy" landing page
- Return `0.0.0.0` or another null route

For investigations, the sinkhole IP becomes a beacon, every endpoint that "tried to talk to evil.example" lights up in your access logs as a hit on the sinkhole IP, and you can pivot from there to identify infected hosts.
