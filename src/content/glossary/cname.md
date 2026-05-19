---
slug: cname
term: CNAME
aliases:
  - CNAME record
  - canonical name
  - canonical name record
short: 'DNS record type that aliases one name to another. Cannot exist at a zone apex and cannot coexist with other record types on the same name.'
tags: [dns, records]
---

Resolvers that hit a CNAME follow it to the canonical name and re-query there. CNAMEs are common at subdomains for vendor-managed services. Two firm rules: a CNAME cannot exist at the zone apex (the apex must hold SOA and NS records), and a CNAME cannot share a name with any other record. Vendor workarounds for apex aliasing (ALIAS, ANAME, CNAME flattening) publish A/AAAA records at the apex by resolving the target server-side.