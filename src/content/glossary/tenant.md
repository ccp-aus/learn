---
slug: tenant
term: tenant
aliases:
  - customer tenant
  - org
  - organization
short: A logically-isolated customer environment inside a multi-tenant SaaS, your DNSFilter org, the client's M365 tenant, the RMM customer object.
related:
  - msp
  - rbac
tags: [fundamentals, identity]
---

A **tenant** is the SaaS abstraction for "this customer's slice of the world." Microsoft 365 has tenants. Cloudflare has accounts. DNSFilter has orgs. NinjaOne has organizations. Each is a fully separated container with its own users, settings, billing, and audit log.

For an MSP this matters because your daily work spans many tenants:

- You need a way to **switch context quickly** (most consoles offer a tenant switcher)
- You should default to your **own internal tenant** for non-customer work
- **MFA, conditional access, and audit logging** all operate per-tenant, there's no single global setting
- **Delegated access** (GDAP in M365, partner-org assignment in DNSFilter) is the right way to admin a customer's tenant from your MSP tenant
