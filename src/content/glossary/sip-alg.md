---
slug: sip-alg
term: SIP ALG
aliases:
  - SIP Application Layer Gateway
  - VoIP Helper
  - SIP Transformations
short: A router feature that inspects SIP traffic and tries to rewrite SDP and open RTP pinholes automatically. In practice on consumer routers it usually breaks more than it helps. Disable on customer routers and handle NAT at the PBX or SBC.
related:
  - sip
  - nat-traversal
  - sdp
tags: [voip, networking]
---

SIP ALG (Application Layer Gateway) is a router feature that tries to help SIP traffic traverse NAT by inspecting SIP packets, rewriting SDP body IPs to the router's public address, and automatically opening pinholes for the RTP ports the SDP names. The intention is benign; the implementations on retail and consumer-grade routers are typically out of date, corrupt SDP rewrites, break re-INVITEs and call transfers, and interfere with keepalive packets.

Industry consensus is to disable SIP ALG on customer routers and let the PBX or SBC handle NAT correctly. The setting goes by different names depending on the router brand (SIP ALG, VoIP Helper, SIP Transformations). It's enabled by default on many consumer routers, and some firmware updates re-enable it after being switched off, so it's worth verifying on every new deployment.
