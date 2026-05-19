---
slug: registrar
term: registrar
aliases:
  - domain registrar
  - registrars
short: The company that sells and renews domain leases on behalf of a TLD's registry. Holds the customer-facing portal where domains are bought, configured, and transferred.
related:
  - registrant
  - nameserver
tags: [domains, registration]
---

A **registrar** is the retail layer of the domain system. The TLD's *registry* (Verisign for `.com`, PIR for `.org`, country-code-TLD operators for ccTLDs) operates the master database but doesn't sell to the public. Registrars do that, plus run the dashboard customers use to renew, change contacts, and update nameservers.

The registrar is **separate from the DNS host**. Registering a domain with one company and hosting DNS at another (Cloudflare, Microsoft, the customer's web host) is the most common setup. The registrar's account login is what you use for renewal, transfers, and ownership changes; the DNS host's panel is where individual records get edited.

Common registrars in MSP work: GoDaddy, Cloudflare Registrar, Namecheap, plus regional retail registrars in each country.
