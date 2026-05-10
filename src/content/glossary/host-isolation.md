---
slug: host-isolation
term: Host Isolation
aliases:
  - endpoint isolation
  - network containment
short: An EDR containment action that cuts a compromised endpoint off from partner networks while keeping it reachable for SOC investigation. Limits an attacker's ability to spread laterally without losing forensic visibility.
related:
  - edr
  - soc
tags: [security, incident-response]
---

**Host Isolation** is the lever an EDR uses to contain a compromised endpoint without removing the SOC's visibility into it. A traditional response (yank the network cable, shut the machine down) loses telemetry the SOC needs to understand what the attacker did; host isolation keeps the host running and its agent talking, while blocking other network traffic to and from it.

In Huntress, isolation can be triggered per-host from the Agent overview page, or in bulk across an entire Organization for outbreak scenarios. Bulk isolation is restricted to Account-level Admins. The SOC can also isolate a host autonomously during an active critical incident, the partner sees the isolation as part of the incident report.

Releasing isolation is a deliberate post-remediation action: the host stays isolated until the partner has worked through the remediation plan and confirmed the host is clean. Releasing too early because users complain about access loss undoes the containment.
