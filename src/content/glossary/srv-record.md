---
slug: srv-record
term: SRV record
aliases:
  - SRV records
short: 'DNS record locating a service at a host and port, used by M365/Teams federation, SIP/VoIP, and some mail autodiscover setups.'
tags: [dns, records]
---

Format combines a service.protocol.name on the left (with underscore-prefixed labels like _sip._tls.example.com) and priority + weight + port + target on the right. Like MX, the target must be a hostname with A/AAAA records, not a CNAME. Most often added from a vendor's setup wizard rather than authored from scratch.