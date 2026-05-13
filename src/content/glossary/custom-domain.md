---
slug: custom-domain
term: custom domain
aliases:
  - custom domains
  - custom domain name
short: A domain you own and operate (e.g. *.pbx.contoso.com), substituted for a vendor's default wildcard domain so the customer's URL reflects your brand rather than the vendor's.
related:
  - ycm
  - whitelabel
tags: [branding, dns]
---

A **custom domain** in the YCM context is a wildcard domain you own (`*.pbx.contoso.com`, `*.proxy.pbx.contoso.com`) that replaces the default `*.yeastarcloud.com` style URLs. Cloud PBXs created against the custom domain show URLs like `customer.pbx.contoso.com` to the customer instead of the vendor's wildcard, completing a white-label brand the customer's tech sees on every Linkus login and PBX management visit.

Setting up a custom domain wires three places: YCM (Add Cluster Domain, naming the SBC and SBC Proxy domains), your DNS provider (forward the wildcards to YCM's SBC and SBC Proxy public IPs), and a certificate authority (upload a wildcard cert or let YCM apply for one via Let's Encrypt). With a supported DNS provider configured in YCM, certificate auto-renewal happens 7 days before expiry without anyone touching the console; without it, you live with a manual annual or 90-day renewal.
