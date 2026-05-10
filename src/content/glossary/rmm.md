---
slug: rmm
term: RMM
aliases:
  - Remote Monitoring and Management
  - remote monitoring & management
short: Remote Monitoring & Management, agent-based software an MSP installs on every endpoint to inventory, patch, alert, automate, and run scripts at scale.
related:
  - psa
  - patch-tuesday
tags: [tooling, fundamentals]
---

An **RMM** (Remote Monitoring and Management) platform is the central nervous system of an MSP. A small agent runs on each managed device, laptop, server, hypervisor, and reports back to a cloud console. From that console, an MSP technician can:

- See real-time and historical health (CPU, RAM, disk, services)
- Push patches and software updates on a schedule
- Run scripts (PowerShell, Bash) ad-hoc or on a trigger
- Receive alerts when something is wrong (disk full, service stopped, BSOD)
- Take remote control sessions

Common products: NinjaRMM (now NinjaOne), Datto RMM, ConnectWise Automate, N-able N-central, Atera. Most MSPs settle on one RMM platform per business and standardize their playbooks around it.

The RMM is *where techs live*. Most frontline work, running scripts, applying policy, picking up alerts, happens here.
