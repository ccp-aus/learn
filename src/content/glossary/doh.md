---
slug: doh
term: DNS over HTTPS
aliases:
  - DoH
short: A DNS transport that wraps queries inside HTTPS, encrypting them and making them indistinguishable from normal web traffic.
related:
  - dns
  - dns-resolver
tags: [networking, security]
---

**DNS over HTTPS** (DoH) tunnels DNS queries through HTTPS to a remote resolver. From a privacy point of view this is good: nobody on the path can see what you're resolving. From a network filtering point of view it's a problem: traditional network-edge DNS forwarding can't see DoH traffic, so a browser or app that resolves via DoH bypasses any DNS filter set at the network level.

Modern browsers (Chrome, Edge, Firefox) all support DoH and may use it by default depending on configuration. iCloud Private Relay tunnels DNS for Apple traffic. The fix for a managed environment is typically a combination of: configure the browser via group policy to use the network's resolver, block known third-party DoH endpoints at the firewall, and where possible use the protective-DNS product's own DoH endpoint so the queries are encrypted *and* filtered.
