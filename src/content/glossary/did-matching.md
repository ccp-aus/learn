---
slug: did-matching
term: DID matching
aliases:
  - DID matching mode
  - DID match
short: "The strategy PSE's inbound route uses to map a dialled DID to a destination. Four modes: DID Pattern (single destination), Match DID Pattern to Extensions (with placeholder), Match DID Range to Extension Range, and DID Number to Specific Extension."
related:
  - did
  - dod
tags: [yeastar, routing, inbound]
---

When an inbound call lands on a trunk with a known DID, PSE's inbound route runs its DID matching to decide where the call goes. The four modes solve different shapes of DID-to-destination mapping:

- **DID Pattern** routes all DIDs matching one or more patterns to a single destination. Best for main-number-into-IVR flows.
- **Match DID Pattern to Extensions** uses a pattern containing a `{{.Ext}}` placeholder; for `882{{.Ext}}`, an inbound call to 8821001 rings extension 1001 directly. Best for bulk N-to-1 mapping where the DID embeds the extension number.
- **Match DID Range to Extension Range** maps a sequential DID range like `8823201-8823210` to a sequential extension range `1001-1010` in lockstep. Best for clean DID blocks.
- **DID Number to Specific Extension** is an explicit list: DID 5501230 → 1000, DID 5361981 → 1001, etc. Best for non-sequential per-user DIDs.

Patterns support the wildcards X (0-9), Z (1-9), N (2-9), `[136-8]` (any of 1,3,6,7,8), `.` (one or more digits), and `!` (zero or more characters).
