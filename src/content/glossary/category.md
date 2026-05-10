---
slug: category
term: category
aliases:
  - content category
  - threat category
short: A label DNSFilter (and similar tools) assigns to a domain so policies can block or allow whole groups of sites at once instead of one-by-one.
related:
  - dns-filtering
  - policy
tags: [security, configuration]
---

A **category** lets a policy say "block all phishing" instead of maintaining a list of every known phishing domain. DNSFilter classifies every resolved domain via threat intel + ML into:

- **Threat categories**: Malware, Phishing, Botnet/C2, Cryptomining, Newly Registered, Parked
- **Content categories**: Adult, Gambling, Social Media, Streaming, Shopping, Productivity Loss
- **Reputation**: High Risk, Suspicious, Low Risk

You build a policy by deciding which categories to **block**, which to **allow**, and which to **monitor (audit)**. A typical baseline blocks all threat categories, allows productivity, and decides per-client on grey areas like Social Media or Streaming.

When categorisation is wrong, you submit a **recategorisation request** to the vendor and add a temporary [allowlist](/glossary/allowlist/) entry to unblock the user.
