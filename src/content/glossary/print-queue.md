---
slug: print-queue
term: print queue
aliases:
  - print queues
short: A logical destination on a computer that maps a printer name to a print driver and a target device, where jobs wait before they print.
related:
  - print-driver
  - secure-release
tags: [printing, fundamentals]
---

A **print queue** is the operating-system-level object an application talks to when it prints. The queue knows which print driver to use, where to send the rendered job, and holds spooled jobs while the printer works through them. On Windows, queues live under Devices and Printers; on macOS, in Printers & Scanners.

In Printix, queues are managed centrally and pushed to user computers by the Printix Client, so a tech doesn't manually install a per-printer queue on every device. Each Printix print queue maps to a printer, a print driver from the Printix driver store, and (where applicable) a Printix Anywhere or Print Later print method.
