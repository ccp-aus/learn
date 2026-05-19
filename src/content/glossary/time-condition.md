---
slug: time-condition
term: time condition
aliases:
  - time conditions
  - business hours
short: A rule that routes calls differently based on the time of day, day of week, or holiday status. PSE supports three modes (system-wide business hours, custom business hours, or custom time periods) and three destination buckets (business hours, outside business hours, holidays).
related:
  - ivr
  - did
tags: [yeastar, routing, scheduling]
---

Time conditions decide which destination a call lands at depending on when it arrives. PSE inbound routes, IVR key destinations, and ring group / queue configs all support time conditions. The three modes:

- **Based on Business Hours Configured for the Time Zone** uses the system's per-timezone business hours definition (PBX Settings → Preferences → Business Hours). Most customers use this.
- **Based on Custom Business Hours** defines a custom schedule for one route only. Useful when a single route has different hours than the rest of the customer's operation.
- **Based on Custom Time Periods** lets you define multiple discrete time periods, each routing to its own destination. For unusual schedules with lunch breaks, after-school, or shift handovers.

Each route has three destination slots: business hours, outside business hours, and holidays. The PBX's system timezone (PBX Settings → Date and Time) and the per-route Time Zone field are independent; misrouted calls during business hours often trace back to those two settings disagreeing. Holidays themselves are defined separately and can be By Date (one-off), By Month (annual recurring), By Week (e.g. Memorial Day = last Monday in May), or By Weekday (e.g. Labour Day = first Monday in September).
