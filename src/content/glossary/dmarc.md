---
slug: dmarc
term: DMARC
aliases:
  - Domain-based Message Authentication, Reporting and Conformance
short: A TXT record at _dmarc.<domain> that tells receiving mail servers what to do with messages that fail SPF or DKIM, and where to send aggregate reports. Makes SPF and DKIM enforceable.
related:
  - spf
  - dkim
tags: [mail-auth, dns]
---

**DMARC** is the policy layer that turns SPF and DKIM from advisory checks into enforced outcomes. Published as a TXT record at `_dmarc.<domain>`, it tells receivers:

- What to do with mail that fails SPF/DKIM alignment: `p=none` (just report), `p=quarantine` (deliver to spam), `p=reject` (refuse).
- Where to send aggregate reports (`rua=mailto:...`) listing every sender and their authentication results.
- How strictly to require that the visible "From" header domain matches SPF / DKIM (`adkim=` / `aspf=`).

The right rollout: start at `p=none` to collect reports, read them for two weeks to find every legitimate sender that needs SPF or DKIM fixed, move to `p=quarantine`, watch reports, then move to `p=reject` once clean. Going straight to `p=reject` without the reporting stage typically breaks at least one legitimate mail flow the customer didn't know about.

DMARC reports are XML and noisy by default; most MSPs use a parser service (Postmark DMARC Digests, dmarcian, etc.) to read them.
