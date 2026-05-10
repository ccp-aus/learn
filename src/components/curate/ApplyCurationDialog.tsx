import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  curationsEqual,
  decodeCurationFromUrlParam,
  readCuration,
  writeCuration,
  type Curation,
} from "@/lib/curation";

const STACK_PARAM = "stack";

/**
 * On mount, reads `?stack=` from the URL. If present and different from the
 * current localStorage curation, prompts the user to apply it. Strips the
 * param from the URL after the user responds (apply or dismiss) so refresh
 * doesn't re-prompt.
 */
export function ApplyCurationDialog() {
  const [pending, setPending] = React.useState<Curation | null>(null);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const param = url.searchParams.get(STACK_PARAM);
    if (!param) return;

    const parsed = decodeCurationFromUrlParam(param);
    if (!parsed) {
      // strip invalid param
      url.searchParams.delete(STACK_PARAM);
      window.history.replaceState(null, "", url.toString());
      return;
    }

    const current = readCuration();
    if (curationsEqual(parsed, current)) {
      // already-applied — silently strip
      url.searchParams.delete(STACK_PARAM);
      window.history.replaceState(null, "", url.toString());
      return;
    }

    setPending(parsed);
  }, []);

  const stripParam = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete(STACK_PARAM);
    window.history.replaceState(null, "", url.toString());
  };

  const onApply = () => {
    if (pending) writeCuration(pending);
    setPending(null);
    stripParam();
  };

  const onDismiss = () => {
    setPending(null);
    stripParam();
  };

  if (!pending) return null;

  const vendorCount =
    pending.vendors === null ? "all vendors" : `${pending.vendors.length} vendors`;

  return (
    <Dialog open onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply this stack curation?</DialogTitle>
          <DialogDescription>
            Someone shared a learn.msp.au stack with you — {vendorCount} selected.
            Applying it filters the site to just those products. You can clear
            or change it anytime from the <a href="/curate/" className="text-primary hover:underline">/curate</a> page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onDismiss}>
            Not now
          </Button>
          <Button onClick={onApply}>Apply curation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ApplyCurationDialog;
