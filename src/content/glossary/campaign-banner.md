---
slug: campaign-banner
term: Campaign banner
aliases:
  - campaign
  - campaigns
  - signature campaign
short: An Exclaimer time-boxed banner image with a hyperlink and start/end dates, appended after a signature; one Campaign at a time, server-side only on Gmail.
related:
  - signature-rule
  - brand-kit
tags: [exclaimer, marketing]
---

A **Campaign banner** in Exclaimer (Standard and Pro plans) is a banner image with a hyperlink and a configured start and end date, appended after the active signature. Campaigns ride the same mail flow path as signatures but don't take a signature slot, and signature processing-order rules don't apply to them; they have their own rules.

Image constraints are JPG, JPEG, PNG, or GIF, under 150KB, up to 600x600 pixels. Only one Campaign applies to any given email; if two enabled Campaigns have overlapping date ranges and matching rules, Exclaimer applies the first match and silently skips the second. On Gmail, Campaigns deploy server-side only because of HTML rendering limitations. UTM parameters in the target URL are supported for click-tracking attribution back to the customer's web analytics.
