---
slug: codec
term: Codec
aliases:
  - audio codec
short: An algorithm that encodes audio for transmission. Voice codecs include G.711 (PCMA / PCMU, narrowband 64 kbps), G.722 (wideband 64 kbps), Opus (variable 6-510 kbps), and G.729 (legacy 8 kbps). Negotiated per call in SDP.
related:
  - sdp
  - rtp
  - mos
tags: [voip, protocol]
---

A codec encodes audio so it fits in an RTP payload, and decodes it back at the receiver. In SIP, codecs are negotiated per call via the SDP offer/answer: the offerer lists supported codecs in priority order, the answerer picks one.

The four codecs an MSP tech sees in production are G.711a (PCMA, 64 kbps narrowband, the European / Australian default), G.711u (PCMU, the North American equivalent), G.722 (64 kbps wideband, better quality than G.711 at the same bitrate, supported by most modern endpoints), and Opus (variable bitrate, often the softphone default but rarely accepted on carrier trunks). G.729 (legacy 8 kbps) still appears on some old low-bandwidth carrier trunks. A codec mismatch causes a 488 Not Acceptable Here, or a successful call with broken audio if a transcoder is in the path.
