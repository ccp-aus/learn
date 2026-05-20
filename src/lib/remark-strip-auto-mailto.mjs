/**
 * Build-time remark plugin: strips auto-generated mailto: links produced by
 * remark-gfm's `gfm-autolink-literal` extension.
 *
 * remark-gfm is on by default in Astro's MDX integration and turns bare
 * `name@domain.tld` strings into `<a href="mailto:name@domain.tld">name@domain.tld</a>`.
 * Our lessons use example.com / example.org / contoso.com email shapes that
 * are not real mailboxes; we don't want learners clicking them.
 *
 * The plugin unwraps any `link` node whose URL starts with `mailto:` and whose
 * single child's text matches the URL's local part (i.e. the auto-link shape
 * `[name@domain](mailto:name@domain)`). Explicitly-authored mailto links like
 * `[email the team](mailto:helpdesk@contoso.com)` are preserved because their
 * link text doesn't match the URL.
 *
 * Pure ESM, no dependencies beyond unist-util-visit.
 */

import { visit } from "unist-util-visit";

export function remarkStripAutoMailto() {
  return (tree) => {
    visit(tree, "link", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;
      if (typeof node.url !== "string") return;
      if (!node.url.toLowerCase().startsWith("mailto:")) return;
      // Auto-linked emails have a single text child whose value equals the
      // address (the URL minus the `mailto:` prefix).
      if (!Array.isArray(node.children) || node.children.length !== 1) return;
      const child = node.children[0];
      if (!child || child.type !== "text") return;
      const address = node.url.slice("mailto:".length);
      if (child.value !== address) return;
      // Replace the link node with its text content.
      parent.children.splice(index, 1, { type: "text", value: address });
      return index;
    });
  };
}
