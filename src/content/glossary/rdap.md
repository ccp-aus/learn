---
slug: rdap
term: RDAP
aliases:
  - Registration Data Access Protocol
short: 'HTTPS/JSON successor to WHOIS, with structured output and standardised redaction for individual registrant data.'
tags: [dns, registration]
---

Defined by RFC 7480+. Returns the same registration metadata as WHOIS (registrar, dates, status flags, nameservers) but as a JSON object served over HTTPS. Easier to parse, easier to authenticate, and handles GDPR-style redaction cleanly. Most registries publish RDAP services at predictable URLs that the IANA RDAP bootstrap registry maps to each TLD.