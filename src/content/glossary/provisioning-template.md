---
slug: provisioning-template
term: Provisioning Template
aliases:
  - provisioning templates
  - YCM provisioning template
short: A YCM-held baseline of PBX-wide settings (allowed IPs, music on hold, distinctive caller ID, allowed country codes, contact visibility) that the MSP stamps onto a new Cloud PBX at creation, or pushes onto an existing one.
related:
  - cloud-pbx
  - ycm
  - pse
tags: [yeastar, provisioning, ycm]
---

A Provisioning Template is the MSP's house style for a fresh Cloud PBX. The template carries a fixed scope of settings: network and firewall defaults (allowed IPs, country IPs, country codes), media defaults (music on hold), display defaults (distinctive caller ID, device naming), and feature defaults (contact visibility, speech-to-text). Templates do not carry per-customer config like extensions, queues, IVRs, time conditions, trunks, or DIDs; those are built per-customer in PSE after the template applies.

An MSP holds many templates (one per customer tier, one per region, one per industry) and picks the right one on the create form for each new PBX. Templates apply once at PBX creation or once via Apply Template on the row action menu; later edits to the template do not retroactively push to PBXes that already received it.
