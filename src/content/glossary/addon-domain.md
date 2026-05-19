---
slug: addon-domain
term: addon domain
aliases:
  - addon domains
  - additional domain
short: A second (or third) registered domain hosted inside the same ApisCP account. Has its own document root, DNS, and optional mailboxes; shares the account's login and resource quotas.
related:
  - apiscp
tags: [apiscp, dns, domains]
---

An **addon domain** is the surface for "the customer bought a second domain and wants it on the same hosting". Different from a subdomain (which is a name beneath an existing domain like `blog.ablemoose.example`) and different from a separate ApisCP account (which would have its own login and quota envelope).

In Able Moose's case: the firm registers `ablebookkeeping.example` as a secondary domain. From their end-user panel, **DNS > Addon Domains** adds it under the same account. The customer logs in with the same credentials, the second domain shares the same disk and bandwidth quota, and DNS / mail / web for the new domain can be managed alongside the primary `ablemoose.example`. Each addon domain typically gets its own document root (`/var/www/<domain>`) to avoid `.htaccess` collisions with the primary site.
