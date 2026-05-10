---
slug: signature-rule
term: signature rule
aliases:
  - signature rules
  - signature targeting
short: A condition on an Exclaimer signature controlling whether it applies to a given email, evaluated across Senders, Exceptions, Recipients, Date/Time, and Advanced Rules tabs.
related:
  - tenant
tags: [exclaimer, rules]
---

A **signature rule** is a condition you set on a signature template in Exclaimer that decides whether the signature is applied to a given email. Rules are evaluated against each enabled signature in processing order; the first signature whose rules all pass is applied, and Exclaimer stops walking the list.

Each signature has rules across five tabs: Senders (which mailboxes can send it), Exceptions (which mailboxes are excluded), Recipients (internal, external, or specific addresses), Date/Time (active windows), and Advanced Rules (server-side only). Folder rules are evaluated *before* the rules on each signature inside the folder; a folder Senders rule that excludes a user means no signature in that folder applies to them, regardless of what the signature's own rules say.
