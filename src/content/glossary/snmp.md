---
slug: snmp
term: SNMP
aliases:
  - Simple Network Management Protocol
  - SNMPv3
short: A standardised protocol for monitoring network devices; an NMS polls device-side SNMP agents for metric values (Get) and receives unsolicited event notifications (Trap), with an MIB defining what each device exposes.
related:
  - ycm
tags: [monitoring, infrastructure]
---

**SNMP** (Simple Network Management Protocol) is how a Network Management System (NMS) sees the inside of a managed device. The device runs an SNMP agent that maintains a tree of named values (CPU, memory, port utilisation, custom application metrics) defined by a MIB (Management Information Base). The NMS performs **SNMP Get** to poll values and receives **SNMP Trap** notifications the agent pushes when events occur.

YCM supports **SNMPv3 only** (the version with authentication and encryption; v1 and v2c are unsupported). Version 3 with `Priv` mode adds HMAC-MD5 authentication and CBC-DES encryption, which an internet-exposed YCM benefits from. Yeastar publishes a YCM-specific MIB you download from the System > SNMP page and load into your NMS. Common operational use: trap on cluster server abnormalities and PBX trunk-down events so they hit your existing pager.
