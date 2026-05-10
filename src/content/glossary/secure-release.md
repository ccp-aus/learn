---
slug: secure-release
term: secure release
aliases:
  - pull-printing
  - pull printing
  - find-me printing
short: Hold a print job in a queue until the user authenticates at the printer, so the document only comes out when they are standing there.
related:
  - print-queue
  - printix-go
tags: [printing, security]
---

**Secure release** keeps a print job in a queue, encrypted on the user's computer or in cloud storage, and only sends it to the printer when the user authenticates at the device. The pattern stops confidential pages piling up in the output tray, and stops the wrong person picking up someone else's payroll printout.

In Printix, the user submits to a print queue and the job stays on their computer (or in the customer's cloud storage). They walk to a printer, sign in via the Printix App, by ID code, or by card on a Printix Go terminal, and release the job. Same idea exists in older on-prem products such as PaperCut, SafeCom, and Equitrac under names like "find-me" or "follow-me" printing.
