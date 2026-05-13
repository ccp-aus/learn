---
slug: sip-tls
term: SIP TLS
aliases:
  - SIPS
  - TLS for SIP
short: "SIP signalling over TLS, encrypts the SIP messages (REGISTER, INVITE, etc.) between endpoints and the PBX. Independent of SRTP, which encrypts the audio."
related:
  - sip
  - srtp
  - sdes
tags: [voip, protocol, security]
---

SIP TLS is the application of TLS to the SIP signalling protocol. The TLS connection wraps the SIP messages so an observer on the network can't read REGISTER credentials, INVITE headers, or call destinations. Default port is 5061 (TCP, distinct from the cleartext-SIP port 5060). The URI scheme is `sips:` (rather than `sip:`).

SIP TLS protects only the signalling layer. The associated RTP media stream is independent: it can be cleartext RTP or encrypted SRTP regardless of the SIP transport. A fully-encrypted call needs both SIP TLS (for signalling) and SRTP (for the audio payload).

On Yeastar PSE, SIP TLS settings live under `PBX Settings -> SIP -> TLS`, with separate server-side (PBX accepting TLS connections) and client-side (PBX registering against an upstream ITSP via TLS) certificate handling. Recommended TLS version is 1.2; older 1.0 support exists for legacy interop but should be avoided when possible.
