---
slug: spf
term: SPF
aliases:
  - Sender Policy Framework
short: A TXT record at the apex of a domain that lists which mail servers are authorised to send mail claiming that domain. Receivers check it to detect spoofing.
related:
  - dkim
  - dmarc
tags: [mail-auth, dns]
---

**SPF** (Sender Policy Framework) is one TXT record at the apex of a domain, starting `v=spf1`, that names every IP and service authorised to send mail "from" that domain. Receiving mail servers fetch it and reject mail from senders not on the list, depending on the policy qualifier (`-all` hard fail, `~all` soft fail).

The single most common SPF mistake: **only one SPF record is allowed per domain.** When a customer adds Microsoft 365 *and* a CRM that both want their own SPF record, the answer is to merge into one record using multiple `include:` directives, not to publish two records.

The second most common mistake: SPF allows at most 10 DNS lookups during evaluation, including everything inside the `include:` references' own SPF records. Customers who add too many senders quietly cross this limit and start failing for legitimate mail.

SPF on its own only verifies the sending IP. To bind that to the visible "From" header, pair it with DKIM and enforce alignment with DMARC.
