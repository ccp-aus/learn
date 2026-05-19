---
slug: sdes
term: SDES
aliases:
  - SDP Security Descriptions
  - sdescriptions
short: An SRTP key exchange mechanism that carries the encryption keys in SDP `a=crypto:` attributes. Confidential only when SIP itself is TLS-protected; plaintext SIP plus SDES is effectively plaintext SRTP.
related:
  - srtp
  - sdp
  - dtls-srtp
tags: [voip, security, protocol]
---

SDES (RFC 4568, SDP Security Descriptions) carries SRTP encryption keys inside the SDP body of SIP messages as `a=crypto:` attributes. The line names a tag, the cipher suite, and the key in base64 form, for example `a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:<base64-key>`. Both offerer and answerer name a tag and a key; if they match suites, that tag's key is used for SRTP.

SDES depends on SIP-TLS for confidentiality. If SIP is plaintext anywhere in the path, the keys are visible to anyone who can capture there, and the SRTP session offers no real protection. Many "is encryption actually working" investigations resolve when the analyst reads the `a=crypto:` line off a plaintext SIP trace, which is enough to decrypt the corresponding SRTP.

DTLS-SRTP is the alternative: keys derived from an in-band DTLS handshake on the RTP port, never visible in SDP. WebRTC's default. Choose between them based on whether SIP-TLS is already deployed and whether endpoints support DTLS-SRTP.
