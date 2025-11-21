function replaceIconElement(el) {
  // Find the class starting with "svgi-" to get the icon name
  const iconClass = Array.from(el.classList).find((c) => c.startsWith("svgi-"));
  if (!iconClass) return;

  const iconName = iconClass.replace("svgi-", "");

  const replace_i = (the_svg) => {
    const temp = document.createElement("div");
    temp.innerHTML = the_svg;
    const svgEl = temp.firstElementChild;
    el.replaceWith(svgEl);
  };

  const cached_svg = sessionStorage.getItem(`svgicon_${iconName}`);
  if (cached_svg) {
    replace_i(cached_svg);
    return;
  }
  const svgUrl = iconToSvg(iconName);

  fetch(svgUrl)
    .then((res) => res.text())
    .then((svgText) => {
      const the_svg = svgText.trim();

      sessionStorage.setItem(`svgicon_${iconName}`, the_svg);
      replace_i(the_svg);
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
