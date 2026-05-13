---
slug: sip
term: SIP
aliases:
  - Session Initiation Protocol
short: The signalling protocol used to set up, modify, and tear down voice calls. Runs over UDP, TCP, or TLS on port 5060 (5061 for TLS). Carries no audio itself; that's RTP's job.
related:
  - rtp
  - sdp
  - mos
tags: [voip, protocol]
---

Session Initiation Protocol (SIP, RFC 3261) is the call-control protocol behind almost every VoIP system in production. It carries the messages that set up, modify, transfer, and tear down a call — INVITE, REGISTER, BYE, ACK, CANCEL, OPTIONS — but it never carries the audio itself. Audio flows via RTP, on a separate set of UDP ports negotiated during the SIP handshake.

The two SIP transactions you'll trace most often are REGISTER (an endpoint coming online) and INVITE (a call being set up). Response codes break into six classes (1xx through 6xx), with 4xx ("called side said no") and 5xx ("server / trunk fault") the two most common error patterns at the helpdesk.
