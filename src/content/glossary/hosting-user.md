---
slug: hosting-user
term: Hosting User
aliases:
  - hosting users
  - subordinate user
short: A subordinate YCM account with its own capacity slice (extensions, concurrent calls, recording minutes, AI minutes) carved out of the MSP's pool, used to model sub-resellers or scoped partner channels under the Super Administrator.
related:
  - ycm
  - cloud-pbx
  - tenant
tags: [yeastar, ycm, multi-tenant]
---

A Hosting User is the YCM account shape for a sub-tenant under the MSP. When the Super Administrator creates a Hosting User, they allocate a slice of the pool (`totalExtensions`, `totalConcurrentCalls`, `totalRecordings`, `totalUltimatePlan`, `totalTranscription`, `totalAiReceptionist`, and so on) plus a `pbxCreationLimit`. The capacity leaves the MSP's pool immediately at allocation, whether the Hosting User uses it or not.

Hosting Users log into YCM with their own credentials and operate inside their sub-allocation. They create Cloud PBXes against their own slice, manage their own customer records, and use the trunks the MSP has granted them via Trunk Access Control. They cannot see the MSP's other customers, and their Colleagues cannot see across into the MSP's Super Admin scope.
