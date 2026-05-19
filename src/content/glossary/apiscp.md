---
slug: apiscp
term: ApisCP
aliases:
  - apnscp
short: A self-hosted multi-tenant hosting control panel an MSP installs on its own RHEL-family servers. Customers get isolated accounts with mail, DNS, files, databases, and 1-click web apps; the MSP gets a Nexus admin app to operate every account.
related:
  - nexus
  - cpcmd
  - fortification
tags: [apiscp, hosting]
---

**ApisCP** (formerly apnscp) is the hosting platform the MSP runs end-to-end. One server license, many customer accounts, each isolated by Fortification's filesystem ACLs and cgroup resource bounds. The day-to-day GUI surface is closer to cPanel than to a cloud orchestrator; the operational surface is heavier on the command line (cpcmd, Scopes, the Ansible Bootstrapper) than cPanel is.

For Able Moose Accounting (the recurring persona in this coursework), the MSP's ApisCP server hosts their website at `ablemoose.example`, their mailboxes, their DNS zone, and their 1-click WordPress install. The MSP creates and operates Able Moose's account from Nexus; Able Moose's office manager logs in to a separate end-user panel to manage day-to-day mailbox and content changes.
