---
slug: byoi
term: BYOI
aliases:
  - Bring Your Own Infrastructure
  - Yeastar BYOI
short: The Yeastar deployment model where the MSP runs YCM on their own infrastructure (their own cloud / colo / on-prem VMs) and uses it to create Cloud PBX instances for each customer.
related:
  - ycm
  - cloud-pbx
tags: [yeastar, deployment]
---

"BYOI" (Bring Your Own Infrastructure) is the deployment shape this site assumes throughout the Yeastar track. The MSP licenses YCM and a P-Series entitlement; they install YCM on infrastructure they own and operate (typically VMs in AWS, Azure, or a colocation facility). Each customer's PBX is then provisioned as a Cloud PBX inside that MSP-operated YCM.

The alternative deployment paths (Yeastar-hosted "PCE" Cloud PBXs, or standalone on-premises P-Series appliances connected to YCM only for remote management) are out of scope for this coursework.
