---
slug: apiscp-plan
term: ApisCP plan
aliases:
  - hosting plan
  - service plan
  - opcenter plan
short: A named bundle of service defaults in ApisCP. When an account is created with -p plan-name, every unset service value falls through to the plan's value. Plans can inherit from a base plan.
related:
  - apiscp
  - siteinfo
tags: [apiscp, plans]
---

An **ApisCP plan** is the technical template an account inherits from. Plans live on disk under `resources/templates/plans/<plan-name>/` as one INI file per service the plan wants to override. A "thin" plan only contains the files for services it overrides; everything else falls through to a base plan (typically `basic`) and through that to `.skeleton`.

For the MSP serving Able Moose Accounting, plans are typically tiered: `starter` (low quota, no databases), `agency` (the default for small business customers like Able Moose), `enterprise` (more quota, PostgreSQL on, more users). Switching a customer's plan is non-destructive: `EditDomain -c siteinfo,plan=enterprise ablemoose.example` reassigns Able Moose without touching their data, and existing per-account overrides survive unless you pass `--reset`.

Plans are *technical* templates. The billing software (Blesta, WHMCS) decides what each plan costs and what's on the invoice.
