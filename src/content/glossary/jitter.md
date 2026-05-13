---
slug: jitter
term: Jitter
aliases:
  - interarrival jitter
short: The variance in inter-packet arrival time on an RTP stream. Reported by RTCP in RTP timestamp units; divide by 8 for narrowband-codec ms, by 48 for Opus. Below 20 ms is fine, above 50 is audibly bad.
related:
  - rtp
  - mos
  - dscp
tags: [voip, quality]
---

Jitter is the variance in inter-packet arrival time on an RTP stream. RTP is sent at a steady cadence (typically one packet every 20 ms), but the network delays each packet by some amount that isn't constant. The variance in those delays is jitter.

RTCP reports interarrival jitter in RTP timestamp units, so the conversion to milliseconds depends on the codec's sample rate: divide by 8 for narrowband (G.711, G.722, G.729 all run at 8000 timestamp units per second) or by 48 for Opus at its standard 48 kHz. Rough field thresholds: under 20 ms is fine, 20-50 is noticeable, above 50 is audibly bad. High jitter without high loss usually means variable queueing delay (e.g. backups competing for the customer's uplink), not a lossy link.
