---
slug: webhook
term: webhook
aliases:
  - webhooks
  - HTTP callback
  - event push
short: An HTTP-based callback an application registers with a service so the service pushes event notifications (POST requests with a JSON payload) to a URL the application controls, instead of the application polling.
related:
  - oauth-client-credentials
  - ycm
tags: [api, events, integration]
---

A **webhook** inverts the polling model. The application registers a URL with the service, the service POSTs to that URL when subscribed events occur, the application processes the payload and returns a 2xx to acknowledge. Where polling means "ask every minute if anything changed," webhooks mean "tell me only when something changed."

For YCM, the webhook subscription model lets the MSP's PSA, billing system, or automation platform react to platform events (DID assignments changing, Cloud PBX capacity changing) without polling the API on a schedule. Authenticity is verified per-request via a HMAC-SHA256 signature in the `X-Signature` header, computed against the raw body keyed by a per-webhook secret YCM generates at subscription time. Up to 5 subscriptions per YCM tenant; configurable timeout (3-10s) and retry count for delivery resilience.
