---
slug: caa-record
term: CAA record
aliases:
  - Certification Authority Authorization
  - CAA records
short: A DNS record at the apex listing which Certificate Authorities are allowed to issue TLS certificates for the domain. CAs check it before issuing; competing CAs refuse.
related:
  - dnssec
tags: [security, dns]
---

A **CAA** (Certification Authority Authorization) record at the apex of a zone tells Certificate Authorities which of them are authorised to issue certificates for the domain. CAs are required to check CAA before issuing a public TLS cert. If the CAA doesn't list them, they refuse.

Format:

```
example.com.   3600   IN   CAA   0 issue "letsencrypt.org"
example.com.   3600   IN   CAA   0 issue "digicert.com"
example.com.   3600   IN   CAA   0 iodef "mailto:security@example.com"
```

`issue` lists allowed CAs; `issuewild` lists CAs allowed to issue wildcard certs; `iodef` is where to email violation reports.

CAA prevents an attacker (who has DNS or web-validation control) from quietly obtaining a cert from a CA the customer doesn't use. Combined with **DNSSEC** (so the CAA itself can't be tampered with) and **certificate transparency log monitoring** (so issuance attempts are visible), CAA is the third layer of the cert-side defence stack.
