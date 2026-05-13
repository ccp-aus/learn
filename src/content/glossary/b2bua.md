---
slug: b2bua
term: B2BUA
aliases:
  - Back-to-Back User Agent
  - back-to-back user agent
short: A SIP element that terminates one dialog and originates another for the same logical call. Looks like two distinct dialogs on the wire (different Call-IDs, fresh tags) and typically bridges media as well as signalling.
related:
  - sip
  - sbc
  - rtp
tags: [voip, sip, infrastructure]
---

A B2BUA (Back-to-Back User Agent) acts as a UAS to the originator and a UAC to the destination. Unlike a pure SIP proxy (RFC 3261 §16) which leaves the dialog identifiers alone and only adds Via headers, a B2BUA terminates the inbound dialog and starts a fresh outbound one with its own Call-ID, From-tag, To-tag, and Contact. From a capture, one logical customer call shows as two or more distinct dialogs with timing relationships that link them.

Most production SIP deployments use B2BUAs: edge SBCs, PBX cores, and trunk-facing SBCs are usually all B2BUAs. A multi-hop call's SIP Flows view shows one row per B2BUA-segmented dialog, which is what makes "follow one call across the topology" an exercise in chaining Call-IDs rather than reading a single ladder diagram.

B2BUAs also typically bridge media, so an analyst sees four RTP streams per call (two pairs across the bridge) rather than the two that a direct call would produce. Many one-way audio and hold/resume failures are B2BUA media-bridge bugs and require capturing on both sides of the suspect B2BUA to confirm.
