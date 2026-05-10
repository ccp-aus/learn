---
slug: policy
term: policy
aliases:
  - filtering policy
  - policy set
short: A reusable bundle of rules, what to block, what to allow, what to log, applied to one or more groups of users, devices, or sites.
related:
  - dns-filtering
  - allowlist
  - blocklist
tags: [security, configuration]
---

In MSP tooling (DNSFilter, Cisco Umbrella, EDR consoles, MDM, RMM), a **policy** is the unit of configuration you assign to a target. A policy says: *for the things bound to me, here are the categories I block, the domains I allow, the alerting thresholds, and the report routing.*

Working with policies well means:

- **Inherit don't duplicate**, start from a baseline policy and override per client only where they actually differ
- **Test in audit mode first**, most products let you log what *would* be blocked without enforcing
- **Document the why**, a one-line note on each block rule will save your future self from a 2 AM whodunit
