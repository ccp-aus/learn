---
slug: sdp
term: SDP
aliases:
  - Session Description Protocol
short: The body inside SIP INVITE and 200 OK messages that describes the audio session. Lists which codecs each side supports, which RTP port and IP it's listening on, and any session-level options.
related:
  - sip
  - rtp
  - codec
tags: [voip, protocol]
---

Session Description Protocol (SDP, RFC 4566) isn't a protocol you speak directly; it's a text format that sits inside SIP INVITE and 200 OK messages. SDP describes the media session: which codecs the offering party supports (`m=audio` and `a=rtpmap` lines), the IP address audio should be sent to (`c=` line), and the port number for RTP.

The two SDP bodies in a call form an offer / answer: the INVITE side offers a list of codecs and an RTP endpoint; the 200 OK side answers with the chosen codec and its own RTP endpoint. Once both endpoints have the other's SDP, RTP starts flowing.

When SDP carries a private (RFC 1918) IP address from a NATed endpoint, the receiving side tries to send RTP to that unreachable IP and the call has no audio. PBX NAT traversal settings exist specifically to rewrite the SDP with the public IP before forwarding.
