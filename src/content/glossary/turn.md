---
slug: turn
term: TURN
aliases:
  - Traversal Using Relays around NAT
short: A protocol (RFC 8656) that relays SIP / WebRTC media through a public server when STUN can't find a working direct path. Always works, but adds latency and bandwidth cost.
related:
  - nat-traversal
  - stun
  - ice
tags: [voip, networking]
---

TURN (Traversal Using Relays around NAT, RFC 8656) is the fallback when STUN can't establish a direct path between two endpoints. The endpoint relays all media through a public TURN server: the far endpoint sees the TURN server as the source, the TURN server forwards to the real endpoint. The TURN server has to be on the public Internet with adequate bandwidth.

TURN always works (assuming both endpoints can reach the TURN server). The cost is one extra network hop, which adds latency and means the relay bandwidth is paid for somewhere. WebRTC apps almost always have a TURN server available as a last resort; SIP softphone deployments use TURN less often because the PBX can usually handle NAT itself.
