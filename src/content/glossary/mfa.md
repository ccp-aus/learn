---
slug: mfa
term: MFA
aliases:
  - multi-factor authentication
  - 2FA
  - two-factor authentication
short: Requiring a second factor (app code, hardware key, biometric) beyond the password to verify identity.
related:
  - sso
  - tenant
tags: [security, identity]
---

**Multi-factor authentication** is the single most cost-effective security control an MSP can require. A leaked password without a second factor is a breach in waiting; with MFA, it's a hygiene event.

Factor categories:

- **Something you know**, password, PIN
- **Something you have**, phone, hardware key, smart card
- **Something you are**, fingerprint, face

"True MFA" combines two different categories. SMS-based MFA is better than nothing but is phishable; **authenticator apps** (Microsoft Authenticator, Authy, 1Password) and **FIDO2 hardware keys** (YubiKey) are the gold standard.

Conditional Access in M365 is how an MSP enforces MFA without trusting users to enable it themselves.
