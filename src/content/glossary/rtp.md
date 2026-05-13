---
slug: rtp
term: RTP
aliases:
  - Real-time Transport Protocol
  - RTP stream
short: The protocol that carries actual audio packets across the network during a call. Runs over UDP on dynamic high ports negotiated in the SIP SDP body; typically sends one packet every 20 ms per direction.
related:
  - sip
  - sdp
  - mos
tags: [voip, protocol]
---

Real-time Transport Protocol (RTP, RFC 3550) carries the encoded audio for a VoIP call. Each direction is its own RTP stream, on a dynamic high UDP port that's chosen during SIP signalling and advertised in the SDP body. A typical call sends one packet every 20 ms (50 packets per second per direction).

RTP packets carry a sequence number (for drop detection and reordering), a timestamp (for playback scheduling), an SSRC (synchronisation source identifier), and the codec-encoded payload. Quality stats (loss, jitter, MOS) are reported via the companion protocol RTCP, which PSE consumes and writes back to CDR.

When SIP completes cleanly but the call has "no audio" or "one-way audio", the cause is almost always a NAT or firewall problem on the RTP path, not anything wrong with SIP itself.
