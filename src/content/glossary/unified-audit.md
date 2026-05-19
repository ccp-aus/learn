---
slug: unified-audit
term: Unified Audit
short: ThreatLocker's central activity log. Every policy match across every module (Application Control, Storage, Network, Elevation) lands here with a Permit, Deny, or Ringfenced verdict.
related:
  - application-allowlisting
  - ringfencing
tags: [threatlocker, audit]
---

**Unified Audit** is the single timeline a ThreatLocker technician reaches for when a user reports something blocked. It indexes execution, install, network, registry, read, write, move, delete, and elevation events with action types, hostnames, paths, hashes, and the policy that matched.

The filter set is wide: action type, full path, hostname, user, time window, "True" denies vs "simulated" denies (would-have-blocked-if-secured), plus the noise filter that removes well-known white-noise denies you'd otherwise wade through. Group-by lets you collapse on application, computer, or path to spot patterns. Triage starts here for almost every ThreatLocker ticket.
