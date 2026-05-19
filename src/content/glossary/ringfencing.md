---
slug: ringfencing
term: Ringfencing
aliases:
  - ringfence
short: Constraining what an allowed application can do. ThreatLocker's term for application-level boundaries on file access, network reach, registry, and child processes.
related:
  - application-allowlisting
tags: [security, zero-trust]
---

**Ringfencing** is the second half of ThreatLocker's thesis. Allowlisting decides *what runs*; ringfencing decides *what a running app can touch*. Office is allowed, but Word doesn't need to spawn PowerShell, write to system32, or talk to a foreign IP. A ringfence around Word says so.

ThreatLocker breaks ringfencing into four levers, each toggleable per-policy: Application (which child processes the app can launch), File (which paths it can read or write), Network (which destinations it can reach), and Registry (which keys it can read or modify). The pattern that pays off most often is restricting Office and browsers from spawning interpreters, the move that catches the macro-and-script payloads ransomware operators rely on.
