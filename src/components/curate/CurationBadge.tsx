import * as React from "react";
import { ListFilter, X } from "lucide-react";
import {
  CURATION_EVENT,
  clearCuration,
  isActive,
  readCuration,
  type Curation,
} from "@/lib/curation";

/** Header chip — shows when curation is active, clears on click of the X. */
export function CurationBadge() {
  const [c, setC] = React.useState<Curation | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setC(readCuration());
    setHydrated(true);
    const onChange = () => setC(readCuration());
    window.addEventListener(CURATION_EVENT, onChange);
    return () => window.removeEventListener(CURATION_EVENT, onChange);
  }, []);

  if (!hydrated || !c || !isActive(c)) return null;

  const vendorCount = c.vendors === null ? "—" : String(c.vendors.length);

  return (
    <div className="hidden items-center gap-1 rounded-md border border-primary/30 bg-primary/10 pl-2 pr-1 py-1 text-xs sm:inline-flex">
      <ListFilter className="h-3 w-3 text-primary" />
      <a
        href="/curate/"
        className="text-primary hover:underline"
        title="Manage your stack curation"
      >
        Stack: {vendorCount} {vendorCount === "1" ? "vendor" : "vendors"}
      </a>
      <button
        type="button"
        className="ml-1 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => clearCuration()}
        aria-label="Clear curation"
        title="Clear curation"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export default CurationBadge;
