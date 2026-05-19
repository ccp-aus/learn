/**
 * Tiny remark plugin: replaces ```mermaid``` code fences with a raw HTML
 * <pre class="mermaid">...</pre> block. The client-side MermaidLoader
 * (loaded only on lesson pages) then runs mermaid.run() on those blocks.
 *
 * No build dependency on Playwright, mermaid-isomorphic, or rehype-mermaid —
 * the entire diagram pipeline is client-side, which is fine for our scale.
 */

import { visit } from "unist-util-visit";

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function remarkMermaidPre() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;
      if (node.lang !== "mermaid") return;
      const html = `<pre class="mermaid not-prose" data-mermaid="true">${escapeHtml(node.value)}</pre>`;
      parent.children[index] = { type: "html", value: html };
    });
  };
}

export default remarkMermaidPre;
