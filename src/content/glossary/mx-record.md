---
slug: mx-record
term: MX record
aliases:
  - MX records
  - Mail eXchanger record
short: 'DNS record telling sending mail servers where to deliver mail for a domain. Lower priority value is preferred.'
tags: [dns, records, mail]
---

Format is priority + target hostname. Lower priority numbers are tried first; backups with higher numbers are tried only when the primary fails. MX targets must be hostnames with A or AAAA records, never CNAMEs and never bare IP addresses; both are spec violations. When mail providers change, the MX record set is the primary change; SPF and DKIM updates usually follow.