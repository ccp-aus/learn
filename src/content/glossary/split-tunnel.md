---
slug: split-tunnel
term: split-tunnel VPN
aliases:
  - split tunnel
  - split-tunnelling
short: A VPN configuration that routes only some traffic through the VPN and the rest directly through the local network.
related:
  - dns-resolver
tags: [networking]
---

**Split-tunnel** VPNs route corporate-bound traffic over the VPN and everything else over the user's local network. The opposite, **full-tunnel**, sends all traffic through the VPN, including DNS.

For DNSFilter and similar protective-DNS products this matters because a full-tunnel VPN routes DNS through the VPN's resolvers, bypassing the local Roaming Client and any local filtering. The recommended pattern for compatibility is split-tunnel; if a customer's policy mandates full-tunnel, the workaround is to configure the VPN's DNS resolver to point at the loopback `127.0.0.2`, which keeps DNS flowing through the Roaming Client even with full-tunnel routing for everything else.
