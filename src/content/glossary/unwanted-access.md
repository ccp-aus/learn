---
slug: unwanted-access
term: Unwanted Access
aliases:
  - Unwanted Access Rules
  - Unwanted Access escalation
  - Unexpected Country
  - Unexpected VPN
short: Huntress ITDR feature for managing logins from unfamiliar countries and VPNs. Login events that don't match a user's Microsoft Entra usage location or an Expected rule become escalations the partner resolves by creating a rule.
related:
  - itdr
  - m365
  - mfa
tags: [huntress, identity]
---

**Unwanted Access** is the Huntress ITDR capability for governing where logins to a Microsoft 365 identity are allowed to come from. It runs alongside the Session Token Theft and Credential Theft detectors as the third pillar of ITDR; together those three target the adversary tradecraft of stealing credentials or sessions and re-using them from somewhere unexpected.

The mechanic is straightforward. When an identity logs in from a country that doesn't match its Microsoft Entra License Usage Location, or via a VPN/proxy that hasn't been seen before, Huntress raises an Unexpected Country or Unexpected VPN escalation in the portal. The partner resolves it by creating an **Expected** rule (login pattern is normal for this user or this customer) or an **Unauthorized** rule (login is not anticipated; trigger a Critical alert and disable the identity). Rules can be scoped at the Identity, Organization, or Account level, with the most-specific level winning on overlap. Account-level **Deny All** turns the model into "everything is unauthorised unless explicitly Expected", which strict environments use; an Organization can opt out of the cascade with its own Deny All toggle.

The helpdesk's day-to-day exposure to Unwanted Access is mostly the escalations rather than the rule design. Most are resolved with a one-question call to the user: are you travelling, did you turn on a VPN. The harder design questions (when to push a customer to Account-level Deny All, how to build an Expected-rule library across a multi-customer estate) are advanced-course territory.
