---
slug: dns-resolver
term: DNS resolver
aliases:
  - resolver
  - recursive resolver
short: The DNS server a device asks for name-to-IP lookups. Whoever controls the resolver controls (and sees) everything.
related:
  - dns
  - dns-filtering
tags: [networking]
---

A **DNS resolver** is the server an endpoint sends its DNS queries to. Out of the box, devices use whatever resolver DHCP hands them, usually the ISP's. An MSP-managed environment changes this so queries flow through a *protective resolver* that can log, filter, and block.

Resolvers can be set:

- At the **router/firewall** (DHCP option 6), easiest, applies to every device on the LAN
- Per **device** via local DNS settings or a roaming client agent (DNSFilter Roaming Client, Cloudflare WARP, etc.)
- Per **profile** in mobile MDM
- Via **Encrypted DNS** (DoH/DoT), same idea, but the queries can't be intercepted on the path

The roaming-client option matters because it keeps protection on when users leave the office network.
