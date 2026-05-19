---
slug: srtp
term: SRTP
aliases:
  - Secure RTP
  - Secure Real-time Transport Protocol
short: Encrypted RTP. Encrypts the audio payload but leaves the RTP header (sequence, timestamp, SSRC, payload type) in cleartext, so flow direction, codec, loss, and jitter remain analysable without keys.
related:
  - rtp
  - sdes
  - dtls-srtp
tags: [voip, protocol, security]
---

Secure RTP (SRTP, RFC 3711) is the encrypted variant of RTP for media confidentiality. The audio payload is encrypted with a stream cipher (typically AES_CM_128) and authenticated with HMAC-SHA1, while the RTP header stays in cleartext. The standard cipher suite is `AES_CM_128_HMAC_SHA1_80`.

For diagnostics, the cleartext envelope matters: an analyst can still count packets, identify the SSRC, read the payload type byte against the SDP's negotiated codec, and compute loss and jitter from sequence numbers and timestamps. Audio playback needs keys; "is media flowing in both directions and is it the right codec" usually doesn't.

Key exchange uses SDES (keys in SDP `a=crypto:` lines, depends on SIP-TLS for confidentiality) or DTLS-SRTP (keys derived from an in-band DTLS handshake on the RTP port, used by WebRTC).
