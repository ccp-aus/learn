---
slug: threatlocker-detect
term: ThreatLocker Detect
aliases:
  - detect
short: ThreatLocker's telemetry-driven detection module. Rules evaluate event-log, network, and policy signals to fire alerts or automated responses when defined conditions appear.
related:
  - unified-audit
  - edr
tags: [threatlocker, detection]
---

**ThreatLocker Detect** is the validation layer on top of the prevention stack. Allowlisting blocks unknown execution; Detect watches the telemetry the rest of the stack generates and flags conditions that suggest something compromised slipped past, or that policy hygiene is drifting.

Conditions span Windows Event Log fields, file paths, certificates, destination IPs and ports, threat-level thresholds, encryption status, and "policy action" combinations like "this binary tried to ringfence-escape twice in five minutes." The module is the closest ThreatLocker comes to an EDR detection engine, but always pairs detection with the existing prevention scaffolding rather than replacing it.
