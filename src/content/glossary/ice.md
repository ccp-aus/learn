---
slug: ice
term: ICE
aliases:
  - Interactive Connectivity Establishment
short: A procedure (RFC 8445) where endpoints gather candidate addresses (host, STUN-reflexive, TURN-relayed) and run connectivity checks to pick the best working pair. Standard for WebRTC; supported by some SIP softphones.
related:
  - stun
  - turn
  - nat-traversal
tags: [voip, networking]
---

ICE (Interactive Connectivity Establishment, RFC 8445) is the procedure WebRTC uses to find a working media path between two endpoints across arbitrary networks. Each endpoint gathers a list of candidate addresses: its host IPs, its STUN-reflexive public IP, and any TURN-relayed address. The candidates are exchanged in SDP, and the two sides run connectivity checks to find the best working pair, preferring direct over reflexive over relayed.

For typical SIP deployments inside a controlled customer network, ICE is overkill. The PBX or SBC handling NAT correctly does the same job with less complexity. ICE earns its keep when endpoints can't assume any specific network topology, which is exactly why WebRTC adopted it.
