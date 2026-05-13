---
slug: siteinfo
term: siteinfo
aliases:
  - siteinfo service
short: The ApisCP service class that holds an account's identity fields. Primary domain, admin username, contact email, the plan name. One siteinfo entry per account.
related:
  - apiscp-plan
  - apiscp
tags: [apiscp, account-model]
---

**siteinfo** is the identity service in ApisCP's per-account service model. Where other services configure features (`mysql`, `mail`, `ssh`), siteinfo configures *what the account is*: which domain it serves, which user logs in as admin, where contact mail goes, which plan its other services inherit from.

In `AddDomain` flags, siteinfo shows up as `-c siteinfo,domain=ablemoose.example`, `-c siteinfo,admin_user=ablemoose-au`, `-c siteinfo,email=admin@ablemoose.example`, `-c siteinfo,plan=agency`. The three fields `domain` / `admin_user` / `plan` are the load-bearing identifiers; everything else about the account either lives in other services or falls out of the plan.
