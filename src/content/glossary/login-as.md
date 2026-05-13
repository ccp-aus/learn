---
slug: login-as
term: Login-As
aliases:
  - admin:hijack
  - hijack
  - Revert Login-As
short: The ApisCP move that creates an authenticated session as a customer's admin user without password handoff. Reversible via Revert Login-As. Backed by the admin:hijack API call.
related:
  - nexus
  - apiscp
tags: [apiscp, admin, auth]
---

**Login-As** is server-side impersonation: ApisCP creates a real authenticated session as the customer's admin user, attributed in audit logs to both the impersonating admin (platform side) and the customer's user (account side). The customer's password is never exposed. The action is reversed with the **Revert Login-As** item in the top-right dropdown.

The standard helpdesk reflex: a customer reports something they can see and the admin can't reproduce, the admin uses Login-As to look at the same screen the customer is looking at, fixes the issue, then Reverts before opening the next ticket. Forgetting to Revert and then editing a different account from the impersonated session is the most common Login-As gotcha.
