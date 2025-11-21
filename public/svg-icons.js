function replaceIconElement(el) {
  // Find the class starting with "svgi-" to get the icon name
  const iconClass = Array.from(el.classList).find((c) => c.startsWith("svgi-"));
  if (!iconClass) return;

  const iconName = iconClass.replace("svgi-", "");
  const svgUrl = iconToSvg(iconName);

  fetch(svgUrl)
    .then((res) => res.text())
    .then((svgText) => {
      const temp = document.createElement("div");
      temp.innerHTML = svgText.trim();
      const svgEl = temp.firstElementChild;
      el.replaceWith(svgEl);
    })
    .catch((err) =>
      console.error(`Failed to load SVG for icon "${iconName}":`, err)
    );
}

//setTimeout(() => {
// Replace existing <i.svgi> elements
document.querySelectorAll("i.svgi").forEach(replaceIconElement);

// Observe future DOM changes
const svgiconobserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // Check added nodes
    mutation.addedNodes.forEach((node) => {
      // Node itself is an element <i.svgi>
      if (node.nodeType === 1 && node.matches?.("i.svgi")) {
        replaceIconElement(node);
      }

      // Or it contains <i.svgi> elements inside it
      if (node.nodeType === 1) {
        node.querySelectorAll?.("i.svgi").forEach(replaceIconElement);
      }
    });
  });
});

svgiconobserver.observe(document.body, {
  childList: true,
  subtree: true,
});
//}, 0);
