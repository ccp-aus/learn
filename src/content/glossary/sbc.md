---
slug: sbc
term: SBC
aliases:
  - Session Border Controller
  - SBC Cluster
  - SBC Server
short: The Yeastar cluster server that handles customer-facing security and traffic. PBX web admin, SIP extension registration, Linkus client login and registration, and account-style trunks all traverse the SBC.
related:
  - sbc-proxy
  - pbxhub
  - ycm
tags: [yeastar, infrastructure]
---

In a generic VoIP sense, an SBC (Session Border Controller) is a security and policy element that sits between the PBX and the outside world. In Yeastar's BYOI platform specifically, the SBC Cluster is the customer-facing entry point: PBX web access, SIP extension registration, Linkus client login and registration, and account-style trunks (where the PBX itself registers outbound to a carrier) all travel through the SBC.

If extensions can't register but everything else works, suspect the SBC. The Cluster Status page in YCM shows SBC server state and load.
