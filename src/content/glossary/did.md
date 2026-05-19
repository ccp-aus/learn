---
slug: did
term: DID
aliases:
  - DIDs
  - DID number
  - DDI
  - direct inward dial
short: Direct Inward Dial, a public phone number bound to a SIP trunk and routed by the PBX to an inbound destination (extension, queue, IVR, time condition). DIDs are added at YCM against a shared trunk and assigned per-Cloud-PBX.
related:
  - shared-trunk
  - cloud-pbx
tags: [yeastar, telephony, trunks]
---

A DID is the public number a caller dials to reach the customer. In Yeastar's YCM model, DIDs live as records in Repository → DID Numbers, each carrying the number itself (in `+xxx` or `xxx` format), a friendly name (the `didName`, e.g. "Able Moose Main"), and the list of trunks the number is delivered on (`trunkIds`, usually one, with multi-trunk shapes for failover). The DID isn't routed anywhere until the MSP assigns it to a Cloud PBX from the PBX's Assigned DIDs tab.

On the customer's PSE side, once a DID is assigned, inbound routes (Call Control → Inbound Routes) match the dialled DID and send the call to the chosen destination (extension, ring group, queue, IVR, time condition). The DID-to-destination map is where most "wrong destination" callflow tickets root-cause.
