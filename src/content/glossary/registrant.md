---
slug: registrant
term: registrant
aliases:
  - registrant contact
  - domain owner
short: The legal entity named on the domain lease, the person or company that actually owns the domain. Distinct from the registrar (the company selling the lease) and the technical / billing contacts.
related:
  - registrar
tags: [domains, registration]
---

The **registrant** is the customer named on a domain's lease record. They are the legal owner. The registrar holds the lease on the registrant's behalf and runs the customer-facing portal, but the registrant's name in WHOIS / RDAP is the source of truth about who controls the domain.

Why this matters for an MSP: when onboarding a new customer, run a WHOIS lookup before doing any work. If the registrant still shows the previous IT provider or a long-departed employee, the customer does not actually control the domain yet. Update the registrant first; everything else (transfers, DNS changes, renewals) depends on it.

Most TLDs also distinguish administrative, technical, and billing contacts. The registrant is the only one who legally owns the domain.
