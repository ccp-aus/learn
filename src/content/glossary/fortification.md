---
slug: fortification
term: Fortification
aliases:
  - fortified
  - fortify
  - unfortify
short: ApisCP's privilege-separation framework. Web app PHP processes run as a separate apache user; account files are owned by the account user; filesystem ACLs decide which files apache can read or write. MIN and MAX are the operational levels.
related:
  - apiscp
  - cpcmd
tags: [apiscp, security]
---

**Fortification** is what stops a compromised WordPress plugin from rewriting an account's core files. PHP runs under the system-wide `apache` user, not the account's admin user. Filesystem ACLs grant apache read-only access to PHP code (`wp-config.php`, themes, plugins) and read-write access to runtime-written directories (`wp-content/uploads/`). A PHP RCE has apache's permissions, which means it can write uploads but can't drop a backdoor into `wp-load.php`.

**MIN** is the default level (uploads writable, core read-only). **MAX** tightens further (some upload sub-paths become read-only too; intended for static-after-publish sites where updates only ever come through `webapp:update-all`). **Unfortify** is the one-shot escape hatch for stuck migrations; leaving an account unfortified long-term gives up Fortification's protections entirely.

For Able Moose's WordPress install, MIN is right: WordPress media library uploads work, the WP admin UI can't install plugins (the platform's scheduled `webapp:update-all` handles updates), and a plugin RCE has a bounded attack surface.
