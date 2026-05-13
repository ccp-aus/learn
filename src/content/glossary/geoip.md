---
slug: geoip
term: GeoIP
aliases:
  - geolocation IP
  - country IP filter
  - Allowed Country IPs
short: "A firewall pattern that maps source IP addresses to countries / regions and applies allow/deny rules at country granularity. Coarse but cheap; kills the bulk of opportunistic internet scanner traffic for a customer who only operates in a handful of countries."
related:
  - sip
tags: [security, networking]
---

GeoIP filtering uses a database (maintained by Yeastar, MaxMind, etc.) that maps IPv4 / IPv6 ranges to the country in which they're registered. A firewall rule like "only allow inbound traffic from Australia and New Zealand" becomes a lookup-then-allow against that database; everything from elsewhere is dropped.

The technique is coarse: a customer with a remote employee on holiday in another country may need an exception. It's also cheap and effective: the majority of opportunistic SIP scanners and credential-stuffing bots originate from a small set of source countries, and a customer that operates only domestically loses nothing by rejecting traffic from those source countries.

On Yeastar PSE, the feature is `Security -> Security Rules -> Allowed Country IPs`. Enabling it requires you to first allow your own current country (or you'll lock yourself out); PSE adds a confirmation prompt for that case. Static Defense rules layer underneath GeoIP for per-IP exceptions (allow a specific carrier's signalling IP even when the carrier's country isn't on the list).
