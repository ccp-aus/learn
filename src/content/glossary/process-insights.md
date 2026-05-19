---
slug: process-insights
term: Process Insights
aliases:
  - process telemetry
short: Huntress's process-monitoring service. The agent ships process activity to the platform; the SOC analyses it for malicious or suspicious behaviour using rules mapped against frameworks like MITRE ATT&CK.
related:
  - edr
  - soc
tags: [huntress, edr]
---

**Process Insights** is the part of Huntress Managed EDR that watches what processes do on a host. The agent surveys process activity (which processes spawn what children, with what command lines, accessing what resources) and uploads it to the Huntress Platform, where SOC analysts and automation evaluate the activity against rule sets aligned with frameworks like the MITRE ATT&CK matrix.

For example, a benign process attempting privilege escalation, or a sequence of credential-access tooling followed by lateral-movement commands across an estate, is exactly the pattern Process Insights is built to catch. The SOC raises an Incident Report for High or Critical severity Process Insights detections.

Process Insights runs on top of the EDR component (Rio); on a fresh agent install, the EDR component completes about an hour after the base agent registration. Until that finishes, Process Insights detections won't generate from that endpoint. This is expected behaviour, not a problem to chase.
