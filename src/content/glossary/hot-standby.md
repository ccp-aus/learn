---
slug: hot-standby
term: Hot Standby
aliases:
  - active-standby
  - HA pair
short: "A two-server resilience topology where a Primary handles production load and a Secondary continuously syncs its state, taking over automatically when the Primary fails a heartbeat check. Same-LAN; covers server-level failure, not site-level."
related:
  - cloud-pbx
  - pse
tags: [pbx, ha, resilience]
---

Hot Standby is the same-LAN high-availability pattern: two identical servers, a Primary in active state and a Secondary in standby state, sharing a virtual IP that always points to whichever is active. The Secondary continuously syncs configuration and (optionally) data from the Primary. When the Primary stops responding to heartbeats for longer than the configured dead-time, the Secondary takes over automatically.

On Yeastar PSE, the pair lives on the same LAN subnet (cross-VLAN is not supported). Both servers must run identical firmware. Failover is automatic; takeback (returning service to the Primary after repair) is manual via the Repair Completed -> Take Over flow on the Primary.

Hot Standby covers single-server failure (the machine crashes, the disk dies, the OS hangs). It does not cover site-level failure (the data centre loses power, the ISP outage takes both servers offline together). For site-level resilience, the equivalent feature is Disaster Recovery via Site-to-Site VPN or Yeastar SD-WAN PBX Networking, with a Working Server and a Redundancy Server in different regions.
