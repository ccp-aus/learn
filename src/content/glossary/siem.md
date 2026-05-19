---
slug: siem
term: SIEM
aliases:
  - Security Information and Event Management
  - Managed SIEM
short: A platform that ingests security-relevant logs from many sources (firewalls, endpoints, identity, OS event logs) for correlation, alerting, retention, and investigation.
related:
  - mdr
  - soc
  - edr
  - itdr
tags: [security, observability]
---

**SIEM** (Security Information and Event Management) ingests logs from across an environment, endpoints, identity, network, email, SaaS, then applies correlation rules and dashboards on top. It's the place a SOC analyst looks when "is this a real incident?" needs an answer that draws on multiple data sources at once.

Two flavours show up in MSP stacks:

- **Self-run SIEM**, the customer (or MSP) runs Splunk, Sentinel, or similar. Ingestion is per-GB; retention and rules are the operator's job. Powerful, expensive, demands a SOC to use.
- **Managed SIEM**, the vendor ingests, filters, retains, and analyses on the customer's behalf. Pricing is per-source rather than per-GB. The 24x7 SOC reviews the data, so the MSP doesn't carry that workload.

In a Huntress deployment, **Managed SIEM** sits next to Managed EDR and Managed ITDR as a co-equal pillar. The Smart Filter discards log volume Huntress's detections don't need (which keeps storage and per-GB costs out of the equation), and the SOC correlates SIEM data with EDR and ITDR signals to bridge the endpoint and the network views in a single investigation.

In a DNSFilter deployment, the SIEM connection is most often via Data Export, DNS query data forwarded out on a schedule into the customer's or MSP's SIEM, where it joins endpoint and email events. DNS data is high-volume; be deliberate about retention windows and which fields you forward.
