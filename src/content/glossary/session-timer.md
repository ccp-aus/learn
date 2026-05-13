---
slug: session-timer
term: Session timer
aliases:
  - SIP session timer
  - Session-Expires
  - session timers
short: A SIP heartbeat for an established dialog (RFC 4028). The named refresher sends a re-INVITE or UPDATE at half the agreed interval; if a refresh doesn't arrive in time, the other side BYEs with cause 408.
related:
  - re-invite
  - sip
tags: [voip, sip, protocol]
---

Session timers (RFC 4028) keep a SIP dialog alive by requiring periodic refreshes. An INVITE that includes `Supported: timer` and a `Session-Expires` header proposes a refresh interval; the 200 OK either accepts (returning its own `Session-Expires` and naming the refresher with `refresher=uac` or `refresher=uas`) or declines. The named refresher sends a re-INVITE or UPDATE at half the agreed interval; if a refresh doesn't get a 200 in time, the other side sends `BYE; Reason: SIP;cause=408;text="Session timer expired"`.

The most recognisable failure pattern is "calls drop at exactly N minutes", where N matches half the agreed `Session-Expires`. The investigation reads the 200 OK to find the agreed interval and the named refresher, then traces whether the refresh was sent and whether it reached the far side. Stateful middleboxes dropping the refresh INVITE are a common root cause; trunk profiles without session timers enabled are another.
