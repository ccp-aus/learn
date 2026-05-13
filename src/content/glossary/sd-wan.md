---
slug: sd-wan
term: SD-WAN
aliases:
  - software-defined WAN
short: "A WAN-overlay architecture that uses a software control plane to build secure tunnels between sites without relying on dedicated MPLS lines or per-site public IPs. In the Yeastar context, used to connect PBXs across regions for cross-site disaster recovery."
related:
  - cloud-pbx
  - hot-standby
tags: [networking, resilience]
---

Software-Defined Wide-Area Networking (SD-WAN) is a WAN architecture where a software control plane decides how traffic is routed across multiple links (broadband, LTE, MPLS) and provides secure overlay tunnels between sites. Each site has an SD-WAN node; the control plane tells each node how to reach the others, choosing paths based on real-time network conditions.

For Yeastar PSE, "SD-WAN PBX Networking" is the specific feature that connects two PSE servers in different physical regions via Yeastar's hosted SD-WAN service (`sdwantunnel.yeastar.com`). The customer doesn't run their own VPN or MPLS; they enable the feature, exchange a networking code between the two PBXs, and the SD-WAN cloud handles the inter-site tunnel.

The most common use case is cross-region disaster recovery: a Working Server at site A, a Redundancy Server at site B, with SD-WAN as the network-level glue. The alternative is a customer-operated Site-to-Site VPN (IPSec); SD-WAN is the simpler option because the customer doesn't have to operate the VPN. Requires the Ultimate plan.
