---
slug: itdr
term: ITDR
aliases:
  - Identity Threat Detection and Response
  - identity threat detection
short: Identity Threat Detection and Response. Detection and response capabilities focused on the identity layer (Microsoft 365, Google Workspace), watching for compromised credentials, malicious inbox rules, suspicious sign-ins, and rogue OAuth apps.
related:
  - mdr
  - edr
  - m365
tags: [security, identity]
---

**ITDR** (Identity Threat Detection and Response) is a security category covering products that watch what happens *in* a cloud identity (M365, Google Workspace) rather than on an endpoint. The detection set is built around identity-specific attacker tradecraft: credential theft, session hijacking, malicious inbox rules that hide auto-forwarding, OAuth apps that persist after a password reset, suspicious sign-ins from unusual locations or anonymising services.

For an MSP, ITDR fills the gap between an EDR (which sees the endpoint) and an email gateway (which sees mail at the perimeter). When the attack starts as a successful phish that lands in M365 and the user clicks through, the EDR is unlikely to detect it; the email gateway already let it past. ITDR is the detection layer that catches the activity *after* the credentials are compromised.

Common products: Huntress Managed ITDR, Microsoft Defender for Cloud Apps (with the right licensing), Push Security, Vectra. Huntress's positioning is the MSP-native delivery model with the SOC handling triage and account-disable directly through the integration.
