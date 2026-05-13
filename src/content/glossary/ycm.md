---
slug: ycm
term: YCM
aliases:
  - Yeastar Central Management
  - Yeastar Central Management (BYOI)
short: The multi-tenant control plane an MSP uses to create, resize, monitor, and manage their fleet of P-Series Cloud PBXs from a single console.
related:
  - pse
  - linkus
  - cloud-pbx
tags: [yeastar, control-plane]
---

Yeastar Central Management (YCM) is the management portal that an MSP operates to run many customer PBXs. In the BYOI deployment, the MSP installs YCM on their own infrastructure and uses it to spin up a P-Series Cloud PBX instance per customer, allocate capacity, apply provisioning templates, manage SIP trunks, and monitor alarms across the whole fleet.

YCM doesn't handle calls itself. Calls travel through each customer's individual P-Series PBX (the Cloud PBX instance). YCM is the fleet view sitting one layer above; "create the PBX, set its capacity, apply a template, monitor that it's running" rather than "ring this extension, route this call."
