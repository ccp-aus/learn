---
slug: dod
term: DOD
aliases:
  - DODs
  - direct outward dialling
  - direct outward dial
short: Direct Outward Dialling. The specific public number that appears in the From header (and on the called party's caller ID) when an extension dials out. Configured per-trunk and assigned to extensions, optionally with a short code for per-call selection.
related:
  - did
  - outbound-route
tags: [yeastar, telephony, trunks]
---

DOD is the outbound twin of DID. A DID is the number the customer can be reached on; a DOD is the number that appears as the caller ID when one of the customer's extensions dials out. PSE configures DODs per-trunk under the Outbound Caller ID tab, with optional short codes (e.g. `200` for Sales line, `300` for Support line) so extensions can pick a DOD at dial time using feature codes (`*085*200#` sets Sales as default).

When the Sales team should present a different outbound caller ID than the Support team while sharing the same trunk, DOD is the construct that solves it. The trunk's Advanced setting **Force Selected DOD in From Header** decides whether the extension's DOD pick overrides the trunk's default From User Part. Enable it for any customer where caller-ID-per-team or caller-ID-per-individual matters.
