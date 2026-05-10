---
slug: elevation-control
term: Elevation Control
aliases:
  - elevation
short: Per-application local-admin elevation that lets a standard user run a specific approved app with admin rights, without giving the user admin rights generally.
related:
  - application-allowlisting
  - ringfencing
tags: [threatlocker, security]
---

**Elevation Control** replaces the all-or-nothing UAC posture with per-application elevation. Instead of giving a finance user local-admin rights so they can install QuickBooks updates, you elevate just QuickBooks (and only when it's running, with a ringfence around what it can spawn).

The tray app gives the user a "request elevation" path; the technician approves it once, the policy stands until the configured expiration. Combined with Ringfencing, an elevated app is also constrained, so even if it's compromised it can't pivot to PowerShell or rewrite the registry. That combination is the practical answer to "I need this user to install software occasionally" without handing them admin.
