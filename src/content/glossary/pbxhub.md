---
slug: pbxhub
term: PBXHub
aliases:
  - PBXHub Cluster
  - PBXHub Server
short: The Yeastar cluster server that hosts the Cloud PBX instances themselves, plus their storage for system data and recording files. One PBXHub Server can host up to 100 Cloud PBXs and up to 2,000 extensions.
related:
  - cloud-pbx
  - ycm
  - sbc
tags: [yeastar, infrastructure]
---

PBXHub is the engine room. When YCM "creates a Cloud PBX", a PBXHub Server launches a fresh, isolated PSE instance for that customer; the instance's data and recording files live on PBXHub's disk volumes too. Each Cloud PBX record carries the PBXHub Server it lives on (`pbxHubCluster: { clusterName, ip }`).

Capacity limits per PBXHub Server are 100 PBXs and 2,000 extensions. Recording capacity scales with the storage volume the MSP attaches to PBXHub (1 GiB ≈ 1,000 recording minutes). Adding capacity at the platform layer means standing up another PBXHub Server in the region.
