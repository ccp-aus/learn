---
slug: ds-record
term: DS record
aliases:
  - DS records
  - Delegation Signer record
short: 'Record at the parent zone establishing the DNSSEC chain of trust into a child zone. Held at the registrar for a registered domain.'
tags: [dns, dnssec]
---

Contains a hash of the child zone's signing key. Validating resolvers fetch the parent's DS, fetch the child's DNSKEY, and verify the chain matches. Removing the DS records at the registrar is the first step of a DNSSEC safe-disable; the DS TTL is the mandatory wait before any nameserver change.