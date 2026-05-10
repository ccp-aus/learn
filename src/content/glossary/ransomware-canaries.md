---
slug: ransomware-canaries
term: Ransomware Canaries
aliases:
  - canary files
  - ransomware canary
short: Decoy files Huntress drops on protected endpoints to detect ransomware. When a ransomware encryptor touches one, the agent fires an early signal before the encryptor reaches real customer data.
related:
  - edr
  - host-isolation
tags: [security, huntress]
---

**Ransomware Canaries** are bait files an EDR agent places in spots a ransomware encryptor would scan first. Huntress writes its canaries with predictable names and content; if any of them are renamed, encrypted, or deleted, the agent treats that as a high-confidence ransomware signal and surfaces it to the SOC. The pattern relies on encryptors walking the filesystem alphabetically or by common locations; the canaries get hit before the customer's real data does.

For an MSP, the canary rollout is partner-configurable: on by default, can be disabled per Organization or per Endpoint when a vendor application would touch the canary file path and produce false signal. The signal fires fast enough to be useful inside the encryption window, which is why isolation actions during a confirmed canary alert are usually triggered before remediation starts.
