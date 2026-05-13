---
slug: recording-rule
term: recording rule
aliases:
  - recording rules
  - call recording
short: The PSE configuration that decides which calls get recorded. Scoped by trunk, extension, queue, conference, IVR, or paging. Combined with user role permissions that decide who can play, download, or delete the resulting files.
related:
  - queue
tags: [yeastar, recording, compliance]
---

Recording rules live at Call Features → Recording → Recording Settings. The rule shape is "scope this set of trunks / extensions / queues / conferences / IVRs / pagings to be recorded". The five scopes overlap; a call from an external customer to a Sydney support agent through the Support queue is captured by whichever rule matches first, and PSE deduplicates so you get one recording per call.

Recording rules pair with two important neighbouring features:

- **Recording tones** at PBX Settings → Voice Prompt play a "this call may be recorded" prompt to participants at recording start, satisfying notification obligations in most jurisdictions.
- **User role permissions** at PBX Settings → User Roles decide who can play, download, or delete each recording. Scope options are All Extensions, Same Extension Group, Same Department, or Specific Extensions; play / download / delete are independently toggleable.

Retention is managed at System → Storage → Auto Cleanup Settings (Max Usage of Device, Recordings Preservation Days). For long-retention compliance requirements, configure an archive task to push old recordings to S3, SharePoint, or SFTP rather than relying on the PBX's local storage.
