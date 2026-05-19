---
slug: pse
term: PSE
aliases:
  - P-Series Software Edition
  - P-Series PBX
short: Yeastar's PBX software. Each customer's PBX is a PSE instance; in the BYOI model, YCM creates and operates these as Cloud PBXs in the MSP's infrastructure.
related:
  - ycm
  - linkus
  - cloud-pbx
tags: [yeastar, pbx]
---

P-Series Software Edition (PSE) is the actual PBX. Extensions live in it. Trunks register to it. Inbound routes, IVRs, queues, time conditions, recording rules, and the CDR are all per-PBX concerns inside PSE.

A Cloud PBX instance created by YCM is a PSE instance. Same software, just deployed and operated through YCM rather than installed by hand on a customer's hypervisor. The PSE admin guide and the entire PSE feature set apply identically to a Cloud PBX; YCM adds capacity and lifecycle controls on top.
