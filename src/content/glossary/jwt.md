---
slug: jwt
term: JWT
aliases:
  - JSON Web Token
short: A signed, base64-encoded token format used to authenticate API calls and pass identity claims between systems.
related:
  - oidc
tags: [security, api]
---

**JWT** (JSON Web Token, pronounced "jot") is a compact token format that carries claims (who the bearer is, what they can do, when the token expires) signed by the issuer so the recipient can verify them without calling back.

In MSP-tooling contexts you'll meet JWTs in two places: as the API token format for product APIs (DNSFilter, many others), and as the access-token format issued by an OIDC IdP. Treat them like passwords, they grant the bearer whatever the claims allow. Per-script tokens, rotation policy, never in source control.
