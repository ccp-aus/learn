---
slug: signatures-tester
term: Signatures Tester
aliases:
  - signature tester
short: An Exclaimer simulator that walks a chosen sender and recipient against every enabled signature and reports which rules passed or failed, without sending real mail.
related:
  - signature-rule
tags: [exclaimer, testing]
---

The **Signatures Tester** is Exclaimer's interactive simulator for verifying signature rules. You enter a From and To address, optionally a subject and message, and the tester evaluates every enabled signature against the configured rules: enabled-for-server-side-or-client-side, Senders, Exceptions, Recipients, Date/Time, and Advanced Rules. The Details view shows a tick or cross per rule, so the first failure tells you what to fix.

The Tester is a simulation, not a real send. It also can't evaluate upstream conditions outside Exclaimer (the Exchange Online "Identify messages to send to Exclaimer Cloud" transport rule, the Exchange Transport Agent, Google Workspace Content Compliance rules). When the Tester says it should apply but real mail still misbehaves, the next tools are Diagnostic Logs and Message Capture.
