---
slug: pcap
term: pcap
aliases:
  - packet capture
  - pcapng
short: A packet capture file (typically .pcap or .pcapng) containing raw network traffic. The ground truth for voice diagnostics; opened in Wireshark to analyse SIP dialogs, RTP streams, and call quality.
related:
  - sip
  - rtp
tags: [voip, troubleshooting]
---

A pcap (packet capture) is a file containing raw network traffic recorded from a network interface. The file format originated with the tcpdump library and is the universal interchange format for network captures. Most modern PBXes have a built-in pcap tool that captures from the PBX's own interface; on customer networks, captures come from a host with Wireshark or a span (mirror) port on a switch.

For voice diagnostics, pcap files are the ground truth. They let you open the capture in Wireshark, filter by SIP Call-ID, see the ladder diagram of a specific dialog, inspect SDP bodies for codec and address details, and analyse RTP streams for loss and jitter. Save captures as `.pcapng` (the modern Wireshark format) rather than `.pcap` unless interoperability with an older tool demands the legacy format.
