---
slug: audit-log
term: audit log
aliases:
  - operation log
  - operational audit log
short: A record of every change made to a system, naming the actor, the time, the affected object, and (for edits) the before / after values, used to investigate incidents and demonstrate compliance.
related:
  - ycm
  - unified-audit
tags: [governance, security, compliance]
---

An **audit log** is the system's history. Each entry names an actor (user, API client, automation), a timestamp, the object that changed, and the operation type (add / edit / delete / login / specific feature actions). For edits, modern audit logs (YCM's included) carry an old-value / new-value diff, so reading the entry tells you what the field was before and what it became.

In YCM the audit log lives at System > Operation Log and covers every actor class: Super Admin, Colleagues, Hosting Users, their Colleagues, and API-driven actions. The log is the primary diagnostic for "who changed what when" questions, the artefact compliance audits sample against, and the input to a quarterly governance review of platform-shape-changing actions (capacity resizes, branding edits, API enables, custom domain adds, Hosting User creates).
