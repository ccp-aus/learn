---
slug: nexus
term: Nexus
aliases:
  - Nexus app
  - ApisCP Nexus
short: The admin-side ApisCP app that lists every customer account on the server and exposes the add / edit / suspend / delete / Login-As actions. The GUI front-end for AddDomain and friends.
related:
  - apiscp
  - login-as
tags: [apiscp, admin]
---

**Nexus** is the admin's home for account operations in ApisCP. From Nexus the admin can search for an account by domain or admin user, click into the account's detail view, and run any lifecycle action (suspend, edit, delete, Login-As). Every action is also reachable from the CLI (`AddDomain`, `EditDomain`, `SuspendDomain`, etc.) — Nexus is the form-driven equivalent for one-off operations.

When a customer ticket says "Able Moose can't send mail", the admin's first step is usually Nexus → search → click into Able Moose's account row → Login-As to investigate from inside the customer's session. Customers never see Nexus; they see their own per-account panel.
