---
slug: storage-control
term: Storage Control
short: Granular access policy for removable media and file shares. Lets you allow specific USB device serials or specific UNC paths while denying the rest.
related:
  - ringfencing
tags: [threatlocker, dlp]
---

**Storage Control** governs the read/write surface a computer presents to its operator: USB sticks, DVD/CD, internal SCSI/SATA/IDE volumes, and UNC file shares. Where Windows Group Policy can block USB wholesale, Storage Control says "permit USBs with this serial number for this user, deny the rest."

The pattern that earns its place is letting finance read from a specific encrypted USB the auditor brings in once a year, while denying every other USB across the rest of the fleet. That's a lever that almost no other product on the MSP shelf gives you cleanly.
