---
slug: audit-mode
term: audit mode
aliases:
  - audit-only
  - log-only mode
  - monitor mode
short: A configuration mode where rules are evaluated and logged but NOT enforced. Lets you see what would happen before turning enforcement on.
related:
  - policy
tags: [security, configuration]
---

**Audit mode** is the safest way to roll out a new rule. The system evaluates the rule against live traffic and records every match, but no user is actually blocked. After a few days you read the logs, find your false positives, build the necessary allowlist, then flip enforcement on.

Many mature MSP products support some form of audit mode:

- **Microsoft Defender for Endpoint**: ASR rules in audit
- **Conditional Access** in Entra. Report-only policies
- **Application allowlisting** (ThreatLocker, AppLocker), learning mode

Not every protective DNS product has a category-level audit mode. DNSFilter, for instance, doesn't expose one. Where the feature isn't available, the substitute is a phased rollout using test domains plus a single-device test. Either way, skipping the safer rollout is the fastest way to ticket your own helpdesk into oblivion.
