---
slug: pcapng
term: pcapng
aliases:
  - pcap-ng
  - PCAP Next Generation
short: The modern Wireshark capture format. Supports multiple interfaces in one file, embedded comments, and per-packet metadata. Use over legacy `.pcap` unless interoperability with an older tool requires it.
related:
  - pcap
tags: [voip, troubleshooting]
---

pcapng (PCAP Next Generation) is the default capture format produced by Wireshark and `dumpcap`. It extends the older libpcap file format with per-interface metadata blocks, packet comments, name resolution caches, and per-packet decryption secrets blocks (used for TLS keylog material).

For VoIP captures, the practical reasons to prefer pcapng over `.pcap`:

- Multiple capture interfaces in one file (useful when capturing on both sides of a B2BUA simultaneously and merging into one timeline).
- Embedded comments per packet (annotate the call setup, hold point, BYE for later review).
- Direct embedding of TLS session keys for decryption (no separate keylog file management).

Save in `.pcap` only when sharing with a tool that doesn't read pcapng. Most modern analysis tooling accepts both.
