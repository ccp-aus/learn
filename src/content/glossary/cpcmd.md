---
slug: cpcmd
term: cpcmd
aliases:
  - cpcmd shell
short: The universal CLI for ApisCP. Every panel action is reachable from cpcmd via a module:function call. -d sets the site context, -u sets the user, --format=json switches output to JSON.
related:
  - apiscp
  - apiscp-scope
tags: [apiscp, cli, api]
---

**cpcmd** is the one CLI you keep open on every ApisCP server. The form is `cpcmd [-d <site>] [-u <user>] <module>:<function> [args]`. Every panel UI button and every SOAP API call routes through the same backend modules; cpcmd is the third surface, the shell-driven one.

Useful reflexes: `cpcmd misc:list-commands "admin:*"` to enumerate every admin call, `cpcmd --format=json admin:collect '[siteinfo.domain,diskquota.quota]'` to bulk-read every account's quota, `cpcmd -d ablemoose.example webapp:update-all` to update everything WordPress-ish on Able Moose's account. The Beacon CLI (`beacon exec common_get_load`) is the same shape called over SOAP from a different machine.
