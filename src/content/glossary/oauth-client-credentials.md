---
slug: oauth-client-credentials
term: OAuth client credentials
aliases:
  - client credentials grant
  - client_credentials
short: An OAuth 2.0 grant type where an application authenticates itself (Client ID + Client Secret) to obtain an access token, with no end-user involvement; the right model for server-to-server API integrations like YCM provisioning scripts.
related:
  - jwt
  - ycm
tags: [api, auth, oauth]
---

The **client credentials** grant is the OAuth 2.0 flow for machine-to-machine integration. The application holds a Client ID and Client Secret (issued by the resource server, kept in a secrets manager on the application's side) and POSTs them to the token endpoint with `grant_type=client_credentials`. The server returns an access token (a bearer JWT, typically), which the application then includes on subsequent API requests as `Authorization: Bearer <token>`.

YCM uses this grant for its REST API. The access token expires after 30 minutes and is refreshed via a paired refresh token (15-day lifetime). No human is in the loop; the credentials authenticate the script, not a user. For an MSP, it is the foundation of Cloud PBX provisioning automation, capacity reconciliation, and webhook-driven integration with the PSA.
