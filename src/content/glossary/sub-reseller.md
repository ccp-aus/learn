---
slug: sub-reseller
term: sub-reseller
aliases:
  - sub-resellers
  - subordinate reseller
short: A reseller of an MSP's service that itself sits below the MSP in a YCM Hosting User hierarchy, with its own capacity allocation, its own customer base, and (often) its own further sub-tier.
related:
  - hosting-user
  - msp
tags: [yeastar, ycm, channel]
---

A **sub-reseller** in the YCM channel model is a Hosting User that runs its own customer base under the MSP's wholesale account. Each sub-reseller has its own capacity allocation carved from the MSP pool (extensions, concurrent calls, recording minutes, AI minute packs, custom domain quota), its own `pbxCreationLimit`, its own Colleagues for staff access, and its own Cloud PBXs for its customers.

The Hosting User can themselves create further Hosting Users underneath, which is how multi-tier sub-reseller chains form (MSP -> distributor -> regional reseller -> end customer's PBX). Each tier's capacity comes from the tier above; the `allowSuperiorPasswordlessLogin` flag on each Cloud PBX in the chain decides whether the MSP can delegate down through every link to support the customer's PBX directly.
