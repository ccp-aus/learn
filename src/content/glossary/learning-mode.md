---
slug: learning-mode
term: Learning Mode
aliases:
  - learning
short: A ThreatLocker maintenance state where the agent observes execution and auto-creates applications and policies for what it sees, without blocking anything yet.
related:
  - application-allowlisting
  - ringfencing
tags: [threatlocker, deployment]
---

**Learning Mode** is ThreatLocker's onboarding cushion. When you first deploy the agent, you don't have a ready-made allowlist for that customer's actual software estate, so the agent runs in a maintenance state where it permits execution, observes what runs, and writes new application definitions and policies as it goes.

The mode comes in three flavours: Automatic Computer (policies get created at the machine level), Automatic Group (computer-group level), and Automatic System (only learns drivers and Windows files). You leave Learning on long enough to capture everyone's normal weekly pattern, including the quarterly accounting tools and the once-a-month payroll run, then transition the endpoints to Secured Mode. Skip the wait and the day after cutover you'll be approving every line-of-business app the customer uses.
