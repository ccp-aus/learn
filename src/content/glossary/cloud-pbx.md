---
slug: cloud-pbx
term: Cloud PBX
aliases:
  - Cloud PBX instance
  - P-Series Cloud PBX
short: A P-Series Software Edition instance that YCM provisions and operates inside the MSP's infrastructure. Each customer's PBX is its own Cloud PBX, with its own URL, extensions, trunks, and capacity.
related:
  - ycm
  - pse
  - byoi
tags: [yeastar, deployment]
---

A Cloud PBX is the deployment shape that the MSP-as-BYOI model uses for each customer: YCM creates a new PSE instance, assigns it a plan (Enterprise or Ultimate), capacity (extensions, concurrent calls, recording, AI minutes), a region, and a URL. From that point on, the Cloud PBX behaves like any P-Series PBX, just operated through YCM's lifecycle controls (resize, restart, upgrade, backup, retire).

Customers can't see each other's Cloud PBXs. Each instance is logically separate. The MSP sees all of them from YCM's fleet view.
