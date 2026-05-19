---
slug: anycast
term: anycast
aliases:
  - anycast routing
short: A routing technique where the same IP address is announced from many physical locations, and the network sends each user to the nearest one.
related:
  - dns-resolver
tags: [networking]
---

**Anycast** is how a single IP can serve users globally with low latency. Resolvers like 1.1.1.1, 8.8.8.8, and DNSFilter's anycast endpoints all use it. From any user's perspective they're just talking to "the server at that IP"; under the hood the internet's BGP routing delivers them to the closest of dozens of points of presence (PoPs).

For an MSP this matters because **the resolver IP doesn't change** when a roaming user travels, they automatically get the nearest PoP without reconfiguration.
