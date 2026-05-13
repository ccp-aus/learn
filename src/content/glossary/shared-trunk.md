---
slug: shared-trunk
term: Shared Trunk
aliases:
  - shared trunks
  - YCM trunk
short: A SIP trunk held at the MSP's YCM level and assigned to one or more Cloud PBXes. The MSP holds the carrier credentials once; assignments route the trunk to specific customers, with DIDs bound per-assignment.
related:
  - cloud-pbx
  - ycm
  - did
tags: [yeastar, trunks, ycm]
---

A Shared Trunk is the YCM-held SIP trunk that the MSP uses to deliver PSTN connectivity to many Cloud PBXes from a single carrier account. The trunk type is one of `register` (the PBX authenticates with username and password), `did_based` peer trunk (carrier identifies by dialled DID), or `port_based` peer trunk (carrier identifies by source IP and port). The carrier dictates which.

Once a Shared Trunk is assigned to a Cloud PBX (Cloud PBX detail → Assigned DIDs → Add, picking the trunk and the DIDs), the trunk appears in the customer's PSE under Inbound → Trunks with a shared badge. The customer's PSE administrator cannot edit the centrally-managed fields (registration credentials, codec list, hostname) but can edit Inbound Caller ID Reformatting and Outbound Caller ID per-customer. Shared trunks are not included in PBX system backups; after a restore, the MSP reassigns them from YCM.
