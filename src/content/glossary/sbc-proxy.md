---
slug: sbc-proxy
term: SBC Proxy
aliases:
  - SBC Proxy Cluster
  - SBC Proxy Server
short: The Yeastar cluster server that handles carrier-side and integration traffic. Register trunks, peer trunks (port-based and DID-based), and service ports for SSH / AMI / database grant traverse the SBC Proxy.
related:
  - sbc
  - pbxhub
  - ycm
tags: [yeastar, infrastructure]
---

The SBC Proxy Cluster handles the platform's carrier-facing and integration-facing traffic. Register Trunks, Port-based Peer Trunks, and DID-based Peer Trunks all land here, as do the service ports for SSH connections, AMI integration, and database grants when the MSP integrates third-party tooling against the platform.

An SBC Proxy Server provides up to 500 peer trunk ports and up to 5,000 general service ports. Carrier-side trunk problems and integration-tooling problems typically point at the SBC Proxy, not the SBC.
