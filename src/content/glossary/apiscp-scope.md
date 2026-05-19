---
slug: apiscp-scope
term: Scope
aliases:
  - ApisCP Scope
  - Scopes
  - "scope:set"
  - "scope:get"
short: "ApisCP's unified read/write surface for platform configuration. cpcmd scope:get / scope:set / scope:list. Writes trigger configuration cascades; hand-editing config.ini does not, which is why Scopes exist."
related:
  - cpcmd
  - apiscp
tags: [apiscp, config]
---

A **Scope** in ApisCP is a callable config knob: setting it triggers the relevant re-renders and restarts; reading it returns the live value, not a cached one. `cpcmd scope:set dns.default-provider cloudflare` does more than write a line to a file; it propagates the change to every dependent component and restarts what needs restarting.

The legacy mental model from cPanel-land — edit `/etc/apiscp.conf` with vim — is wrong on ApisCP. The Bootstrapper is idempotent: hand-edits get reverted on the next platform update. Use `cpcmd scope:set` (or its `cp.config:set` wrapper for the `config.ini`-style knobs) every time. The MSP's runbooks should never instruct anyone to "open `config.ini` in vim".
