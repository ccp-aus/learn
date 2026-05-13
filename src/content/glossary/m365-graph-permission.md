---
slug: m365-graph-permission
term: Microsoft Graph permission
aliases:
  - Graph API permission
  - M365 Graph scope
short: "A scoped capability granted to an Azure / Entra application via Microsoft Graph. Two types: Application (acts as the org, no signed-in user) and Delegated (acts on behalf of a user). Revocable per-permission from the Enterprise Application page."
related:
  - m365
  - oidc
tags: [m365, security, identity]
---

Microsoft Graph permissions are the per-capability scopes that an application registered in Entra ID requests in order to call Microsoft Graph APIs. Examples: `User.Read.All` (read every user in the tenant), `Mail.Send` (send mail as any user), `Calls.AccessMedia.All` (access call media for Teams calls).

Two types matter:

- **Application permissions:** the app acts as itself, no signed-in user; typically requires admin consent. Used for service-to-service calls like background user-sync jobs.
- **Delegated permissions:** the app acts on behalf of a signed-in user, limited to what that user can do. Used for SSO and per-user data access.

The principle of least privilege applies: an application should be granted only the permissions it actively needs. Permissions are revocable at any time from the Enterprise Application's Permissions page in the Entra admin centre, with the change taking effect on the next token refresh (Application) or the user's next sign-in (Delegated).

In the Yeastar PSE context, the auto-created Entra app for the M365 integration requests a broad permission set sized for "any feature PSE could offer". Customers using only a subset of those features can pare back the granted permissions to least-privilege without breaking the integration. The full reference for permission semantics is at https://learn.microsoft.com/en-us/graph/permissions-reference.
