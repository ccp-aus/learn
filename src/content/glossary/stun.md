---
slug: stun
term: STUN
aliases:
  - Session Traversal Utilities for NAT
short: A protocol (RFC 8489) that lets an endpoint discover its own public IP and port by asking an external STUN server. Used for NAT traversal in SIP softphones and WebRTC clients.
related:
  - nat-traversal
  - turn
  - ice
tags: [voip, networking]
---

STUN (Session Traversal Utilities for NAT, RFC 8489) lets a SIP endpoint behind a NAT find out what public IP and port the outside world sees it from. The endpoint sends a STUN Binding Request to a public STUN server; the server replies with the source address it observed. The endpoint then puts THAT address in its SDP body so far ends can route media correctly.

STUN works for most NAT types (full-cone, restricted-cone, port-restricted) but doesn't work for symmetric NAT, where the NAT picks a different external port per destination. When STUN can't establish a working path, the fallback is TURN, which relays the media through a public server.
