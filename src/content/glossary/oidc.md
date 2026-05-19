---
slug: oidc
term: OIDC
aliases:
  - OpenID Connect
short: An identity layer on top of OAuth 2.0 that lets a relying app verify who a user is by trusting an external Identity Provider's token.
related:
  - tenant
  - mfa
tags: [identity, security]
---

**OIDC** (OpenID Connect) is the modern federated-identity protocol most MSP-relevant SaaS products implement. The user logs into their organisation's IdP (Entra ID, Okta, Google Workspace, JumpCloud, and others), the IdP issues a signed token, and the SaaS product reads the token to know who's logging in.

For an MSP this matters because it consolidates the credential management problem to the customer's IdP, one place to disable a leaver, one place to enforce MFA, one place to rotate. DNSFilter, M365, and most modern SaaS use OIDC. Some legacy products still require SAML; check the product's docs before promising one or the other.
