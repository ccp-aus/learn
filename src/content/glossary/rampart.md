---
slug: rampart
term: Rampart
aliases:
  - ApisCP firewall
  - "rampart:whitelist"
  - "rampart:unban"
short: "ApisCP's default brute-force deterrent. Jail-based: each auth surface (panel, mail, FTP, terminal) has its own per-IP failure counter. Default is three failures in five minutes = ten-minute block."
related:
  - apiscp
  - cpcmd
tags: [apiscp, security, firewall]
---

**Rampart** is the jail-based brute-force protection on every ApisCP server. Each authenticating service (`apnscp`, `dovecot`, `postfix-sasl`, `proftpd`, `sshd`) is a jail with its own counter; the default rule is three failures in five minutes triggers a ten-minute IP block. Same threshold on every jail; intentionally aggressive.

The most useful admin moves: `cpcmd rampart:unban <ip> '*'` to clear a customer's IP from every jail when they're locked out, and `cpcmd rampart:whitelist <ip>` to permanently allow trusted sources (the MSP's office IP, RMM/PSA outbound addresses). Helpdesk techs typo their own credentials; whitelisting office IPs cuts about a ticket a week.

Rampart catches authentication brute-forcing. The Shield handler catches request-volume DOS; they overlap on some attackers but cover different attack shapes.
