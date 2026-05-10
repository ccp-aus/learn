---
slug: edr
term: EDR
aliases:
  - Endpoint Detection and Response
short: Endpoint Detection and Response, agent-based security that watches process, file, and network behaviour for malicious patterns and gives a SOC the ability to isolate or roll back.
related:
  - mdr
  - rmm
tags: [security]
---

**EDR** is the next generation past traditional antivirus. Where AV matched files against signatures, EDR watches *behaviour*, what processes spawn what children, what registry keys change, what network connections happen, and ships that telemetry to a console where rules and ML flag malicious sequences.

Key capabilities:

- **Detection** of fileless malware, living-off-the-land, suspicious lateral movement
- **Containment**, network-isolate an infected endpoint with one click
- **Investigation timeline**, full process tree of what happened
- **Rollback**, reverse changes a ransomware encryptor made

Common products in the MSP space: SentinelOne, CrowdStrike Falcon, Microsoft Defender for Endpoint, Bitdefender GravityZone, Huntress, ThreatLocker (a different beast, application allowlisting).
