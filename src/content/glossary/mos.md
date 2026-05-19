---
slug: mos
term: MOS
aliases:
  - Mean Opinion Score
short: A perceptual quality score for a call leg, 1.0 (terrible) to 5.0 (perfect). Derived from packet loss, jitter, and codec choice. PSE writes MOS per leg into CDR for analysis.
related:
  - rtp
  - jitter
tags: [voip, quality]
---

Mean Opinion Score (MOS) is a 1.0 to 5.0 perceptual quality estimate for a call leg, calculated from observed RTP / RTCP stats. Rough field bands: 4.3+ is indistinguishable from a landline, 4.0-4.3 is solid, 3.5-4.0 is "the line sounds slightly off", below 3.5 is "customers complain", and below 3.0 is bad enough to need escalation.

MOS lets you separate perception from reality. A customer saying "the line was really bad" with a logged MOS of 4.2 is reporting their feeling about the call, not the audio quality. Investigate echo, sidetone, headset choice, or context (a stressful call remembered as a bad-sounding one). A customer saying "fine" with MOS 3.2 is tolerating audio problems they shouldn't have to.
