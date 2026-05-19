---
slug: dscp
term: DSCP
aliases:
  - Differentiated Services Code Point
short: A 6-bit field in the IP header that marks a packet's traffic class. Voice typically uses EF (DSCP 46) for RTP and CS3 (24) or AF31 (26) for SIP, so network gear can prioritise voice in low-latency queues.
related:
  - sip
  - rtp
  - mos
tags: [voip, networking, qos]
---

DSCP (Differentiated Services Code Point) is the 6-bit field in the IP header that says "this packet belongs to traffic class X". Routers and switches configured for QoS treat higher-class packets as higher priority, putting them in low-latency queues ahead of bulk traffic. Voice has standard values: EF (Expedited Forwarding, DSCP 46) for RTP media; CS3 (24) or AF31 (26) for SIP signalling.

DSCP only helps on networks that respect the marking. Customer LAN switches and managed MPLS / SD-WAN circuits usually do. The public Internet almost never does; most ISPs rewrite DSCP to 0 at the edge. So DSCP earns its keep inside the customer's office, prioritising voice over backups and video calls, and stops mattering once on the public Internet.
