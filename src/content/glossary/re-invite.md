---
slug: re-invite
term: re-INVITE
aliases:
  - re-invite
  - re-INVITEs
  - reinvite
short: An INVITE sent inside an established SIP dialog to modify it. Common triggers are hold/resume (toggling `a=sendrecv` / `a=sendonly`), codec re-negotiation, network moves, and session-timer refreshes.
related:
  - sip
  - session-timer
  - sdp
tags: [voip, sip, protocol]
---

A re-INVITE is an INVITE message sent within an already-established SIP dialog (RFC 3261 §14). It carries the same Call-ID and tags as the original INVITE but updates the dialog's state via a fresh SDP offer/answer. Common reasons:

- **Hold/resume**: toggling `a=sendrecv` to `a=sendonly` (with MoH starting on the held side) and back.
- **Codec re-negotiation**: a new `m=audio` line with different codecs, often as a carrier hands off between gateways.
- **Network move**: a new `Contact` URI when the endpoint moves networks (laptop sleeping, wifi changing).
- **Session-timer refresh**: the named refresher in an RFC 4028 timer arrangement sends a re-INVITE (or UPDATE) at half the agreed interval.
- **Transfer (REFER + Replaces)**: a re-INVITE with `Replaces` header swaps an existing dialog for a new one during transfers.

Failure modes are split between the SIP plane (re-INVITE 4xx) and the media plane (re-INVITE succeeds but RTP doesn't restart or bridge correctly). B2BUA media re-bridge bugs are the most common cause of "hold/resume works at SIP, breaks at audio".
