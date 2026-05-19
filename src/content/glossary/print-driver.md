---
slug: print-driver
term: print driver
aliases:
  - printer driver
  - print drivers
  - drivers
short: The software that translates an application's print output into the printer's native command language.
related:
  - print-queue
tags: [printing, fundamentals]
---

A **print driver** turns a generic print job from an application into the proprietary command stream a specific printer model understands. A wrong or stale driver prints garbled pages, missing fonts, or nothing at all. Driver chaos was one of the strongest arguments for an on-prem print server, then for Printix.

Printix maintains a global driver store and pushes the right Windows or macOS driver to a workstation when a queue is added. Where no model-specific driver exists, Printix can fall back to a vendor universal driver (HP, Canon, Konica Minolta, Kyocera, Lexmark, Ricoh, Toshiba, or Xerox).
