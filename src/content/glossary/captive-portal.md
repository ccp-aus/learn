---
slug: captive-portal
term: captive portal
aliases:
  - hotspot login page
short: The web page that public Wi-Fi networks force users through before letting their device reach the internet.
related:
  - dns-resolver
tags: [networking]
---

**Captive portals** are the airport / hotel / cafe Wi-Fi login pages, the network grants very limited connectivity, redirects all web requests to a portal page, and only opens the gate once the user accepts the terms or pays.

Captive portals are tricky for DNS-filtering agents. The agent wants to resolve via its own protective resolver, but the portal expects to see queries hit its resolver so it can redirect them to the portal page. Modern Roaming Clients usually handle this via a "Travel Wi-Fi Mode" or equivalent that detects the network's portal-detection probes and steps aside until the user gets through. When it goes wrong, the symptom is "Wi-Fi says connected, captive portal never appears, no internet", the fix is usually a network reconnect or a Roaming Client version with the captive-portal handling fixed.
