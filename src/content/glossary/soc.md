---
slug: soc
term: SOC
aliases:
  - Security Operations Centre
  - Security Operations Center
short: A staffed team that monitors security telemetry around the clock, triages alerts, investigates suspected compromise, and contains active threats. The "managed" part of MDR / Managed EDR.
related:
  - mdr
  - edr
  - itdr
tags: [security, operations]
---

A **SOC** (Security Operations Centre) is the team that watches the alerts a detection product produces. Building one in-house at an MSP means hiring shift-rotation analysts (typically across three timezones for 24x7 coverage), training them on the tooling, and writing the playbooks they execute. For all but the largest MSPs, this is uneconomic; the managed-detection model exists to share a SOC across many MSPs.

In a Huntress deployment, the SOC operates on a Follow-the-Sun model with analysts in the United Kingdom, the United States, and Australia. The SOC takes signals (interesting events surfaced by the platform's automation), promotes a fraction of them to investigations (a human takes a look), and produces incident reports for the ones that confirm as malicious. SOC analysts can also contain compromised endpoints (host isolation) and disable compromised identities directly through the M365 ITDR integration.

The MSP's role complements the SOC: action the remediation plans the SOC produces, communicate with the customer, integrate the workflow into the MSP's existing PSA and ticket system. The SOC is the analysis function; the MSP is the partner-facing function.
