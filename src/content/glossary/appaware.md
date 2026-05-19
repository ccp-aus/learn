---
slug: appaware
term: AppAware
aliases: []
short: DNSFilter's feature that maps DNS activity to known applications, surfacing app usage and shadow IT through the filter.
related:
  - dns-filtering
  - policy
tags: [dnsfilter, security]
---

**AppAware** is DNSFilter-specific. It maps the domain queries the resolver sees to the applications they belong to (Dropbox, ChatGPT, Spotify, and so on) and lets you both report on app usage and apply controls at the app level, block this app, allow that one, without needing to identify each domain by hand.

For an MSP it's useful as a shadow-IT lens: which sanctioned tools are being used, which unsanctioned ones are creeping in, which apps a customer's policy already covers without anyone having configured the underlying domains. AppAware data also feeds the Insights and reporting surfaces.
