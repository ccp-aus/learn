---
slug: dtmf
term: DTMF
aliases:
  - Dual-Tone Multi-Frequency
  - touch tone
short: Keypresses on a phone keypad. In SIP/VoIP carried three ways, RFC 4733 telephone-event over RTP (the standard), inband audio (broken by lossy codecs), or SIP INFO messages.
related:
  - sip
  - rtp
  - sdp
tags: [voip, protocol]
---

DTMF (Dual-Tone Multi-Frequency) is the technical name for the keypresses a caller sends to an IVR ("press 1 for sales, 2 for support"). In SIP / VoIP, three transport modes exist, and a trunk's config has to pick one that both sides agree on.

RFC 4733 telephone-event is the standard: keypresses ride in the RTP stream as a separate payload type (typically 101), carrying an event code rather than audio. Inband mode plays the actual tone as audio, which works on G.711 but gets destroyed by lossy codecs like Opus or G.729. SIP INFO carries the event as a SIP message during the call, useful when RTP-based DTMF isn't supported. Mode mismatches are the textbook cause of "the IVR doesn't hear my keypresses".
