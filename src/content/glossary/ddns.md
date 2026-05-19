---
slug: ddns
term: Dynamic DNS
aliases:
  - DDNS
  - dynamic DNS hostname
short: A service that maps a fixed hostname to an IP address that changes, typically used when a network's public IP isn't static.
related:
  - dns
tags: [networking]
---

**Dynamic DNS** (DDNS) keeps a hostname pointed at a moving target. The router or a small client at the site reports its current public IP to the DDNS provider whenever it changes, so the hostname always resolves to the right place.

For DNSFilter, DDNS is how you identify a Network Site whose public IP changes, common with residential-grade internet and small-office connections. Register the hostname as the Site identifier; DNSFilter rechecks the record automatically. Useful, but slightly less robust than a true static IP if the DDNS provider has an outage.
