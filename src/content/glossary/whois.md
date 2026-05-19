---
slug: whois
term: WHOIS
aliases:
  - whois
short: 'Legacy protocol for querying domain registration data: registrar, creation/expiry dates, status flags, nameservers, and (often-redacted) registrant contacts.'
tags: [dns, registration]
---

WHOIS dates from the 1980s. Most modern toolchains query the registry over the WHOIS protocol on port 43 and parse the free-text response. Since GDPR, individual registrant contact data on common gTLDs is redacted in the response; the structured registration metadata (registrar, dates, status flags, nameservers) is still visible. RDAP is the protocol-level successor.