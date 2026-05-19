---
slug: application-allowlisting
term: Application allowlisting
aliases:
  - allowlisting
  - whitelisting
  - application whitelisting
short: A default-deny posture where only explicitly approved binaries are allowed to execute. Anything else (script, installer, dropped DLL) is blocked at the kernel before it runs.
related:
  - ringfencing
  - edr
tags: [security, zero-trust]
---

**Application allowlisting** flips the conventional security model. Instead of trying to recognise everything bad and block it (the antivirus thesis), the agent maintains a list of everything *good* and blocks the rest. The unknown installer a user just downloaded is denied by default, regardless of whether anyone has seen it before.

The advantage: a brand-new ransomware strain still has to be on the allowlist to run, and it isn't. The cost: legitimate software the allowlist hasn't met yet also gets blocked, so the platform needs a fast approval workflow (or a managed service like ThreatLocker's Cyber Hero) to keep the helpdesk afloat. ThreatLocker is the canonical product in this category for MSPs; competitors include Airlock Digital and AppLocker (Microsoft, far less polished).
