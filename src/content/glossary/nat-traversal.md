---
slug: nat-traversal
term: NAT traversal
aliases:
  - NAT
  - Network Address Translation
short: The set of techniques that let SIP and RTP work through routers that translate addresses. Symmetric RTP, STUN, TURN, and ICE are the four main mechanisms; SIP ALG is the router feature that breaks it.
related:
  - sip
  - rtp
  - stun
  - turn
  - ice
tags: [voip, networking]
---

NAT traversal covers the techniques used to get SIP signalling and RTP media through a NAT (Network Address Translation) router without the call breaking. The core problem: the endpoint behind NAT puts its private IP in the SDP body, and the far end can't route to that private IP.

The four mechanisms used in field deployments are symmetric RTP (the PBX learns the public address from inbound RTP), STUN (the endpoint asks an external server what its public address looks like), TURN (relay media through a public server), and ICE (try all candidates and pick the best working pair). On the customer side, **SIP ALG should usually be disabled** because consumer router implementations corrupt SDP rewrites and break re-INVITEs.
