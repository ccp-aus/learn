---
slug: dnssec
term: DNSSEC
aliases:
  - Domain Name System Security Extensions
short: Cryptographic signing of DNS answers so resolvers can detect tampering. Requires the DNS host to sign the zone, and the registrar to publish a DS record pointing at the signing key.
related:
  - dns
  - nameserver
tags: [security, dns]
---

**DNSSEC** signs every DNS record set with a private key, and publishes the matching public key plus a fingerprint (the **DS** record) into the parent zone. A validating resolver follows the chain from root, to TLD, to the customer's domain, verifying signatures at every step. If any step fails, the answer is treated as bogus and rejected.

Operationally, DNSSEC has two halves:

- **At the DNS host:** enable DNSSEC for the zone. The host generates keys, signs everything, and re-signs as records change.
- **At the registrar:** publish the DS record into the parent zone. This is what makes the chain validate; without it, resolvers can't tell whether the signatures they see are real.

Both halves are required. Modern managed DNS hosts (Cloudflare, Microsoft 365 DNS, Route 53) handle key generation, signing, and rotation automatically; the MSP's job is to copy the DS into the registrar and verify with `dig +dnssec`. Self-managed BIND deployments need more care: a botched key rotation can take a zone offline for hours.

DNSSEC alone doesn't prevent registrar-account takeover or cert-issuance abuse. It complements transfer lock, MFA, CAA, and CT monitoring as one layer of the hijack-defence stack.
