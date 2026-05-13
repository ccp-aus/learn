---
slug: dtls-srtp
term: DTLS-SRTP
aliases:
  - DTLS for SRTP
  - DTLS-SRTP key exchange
short: SRTP key exchange via an in-band DTLS handshake on the RTP port. Keys never appear in SDP; SDP only carries `a=setup:` and `a=fingerprint:` for certificate verification. WebRTC's default.
related:
  - srtp
  - sdes
  - sdp
tags: [voip, security, protocol]
---

DTLS-SRTP (RFC 5763 framework, RFC 5764 key extractor) negotiates SRTP keys via a DTLS handshake on the same socket as the eventual SRTP packets. The SDP carries `a=setup:active` or `a=setup:passive` (naming which side initiates the handshake) and `a=fingerprint:sha-256 <hex>` (the fingerprint of the certificate the other side will present). The actual session keys never appear in SDP and are not visible on the wire.

For diagnostics, the DTLS handshake itself is cleartext: an analyst can verify Client Hello, Server Hello, Certificate, and Alert messages in Wireshark just like a TLS handshake. Failures usually manifest as a `bad_certificate` alert (fingerprint mismatch between `a=fingerprint:` and the cert actually presented) or as the handshake never completing (firewall blocking the RTP port for the other direction).

Captured DTLS-SRTP traffic generally cannot be decrypted after the fact, because the keys exist only in the endpoints' memory after the handshake. This is the practical security gap over SDES: even with the SDP body, an analyst can't recover keys.
