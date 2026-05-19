---
slug: txt-record
term: TXT record
aliases:
  - TXT records
short: 'General-purpose DNS record carrying free-form text. Multiple TXT records on the same name are allowed and additive.'
tags: [dns, records]
---

Used for vendor verification strings, SPF, DKIM, DMARC, and miscellaneous metadata. Two rules helpdesk techs trip over: multiple TXT records on the same name are allowed and additive (unlike most record types), and a single TXT string is limited to 255 characters at the wire-format level; longer values are split into multiple strings the resolver concatenates. SPF adds a separate protocol rule on top: only one TXT starting with v=spf1 per domain.