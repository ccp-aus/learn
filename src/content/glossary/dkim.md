---
slug: dkim
term: DKIM
aliases:
  - DomainKeys Identified Mail
short: An email signing scheme where the sending server signs each message with a private key, and the matching public key is published in DNS. Receivers verify the signature to confirm the message wasn't altered in transit.
related:
  - spf
  - dmarc
tags: [mail-auth, dns]
---

**DKIM** (DomainKeys Identified Mail) cryptographically signs outgoing email. The sending mail server signs each message with a private key; the public key is published in DNS at a "selector" subdomain (e.g. `selector1._domainkey.example.com`). The receiver fetches the key, verifies the signature, and confirms the message hasn't been tampered with and was signed by a key the domain owner published.

For Microsoft 365, DKIM is set up by adding two CNAME records (one per selector) and then enabling DKIM signing per-domain in the M365 admin centre. The CNAMEs point at hostnames Microsoft owns; Microsoft serves the actual public-key TXT records there and rotates keys invisibly. Other providers (Google Workspace, Mailgun, etc.) publish DKIM directly as a TXT record at the selector.

DKIM by itself is advisory. Pair it with DMARC to enforce that the visible "From" domain aligns with the DKIM-signing domain.
