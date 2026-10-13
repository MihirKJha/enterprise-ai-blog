(() => {
  const getMermaidTheme = () => {
    const scheme = document.body.getAttribute("data-md-color-scheme");
    return scheme === "slate" ? "dark" : "default";
  };

  const renderMermaid = async () => {
    if (typeof mermaid === "undefined") return;

    // Configure Mermaid for the current Material palette.
    mermaid.initialize({
      startOnLoad: false,
      theme: getMermaidTheme()
    });

    // Reset previously rendered diagrams before re-rendering.
    const diagrams = document.querySelectorAll(
      ".mermaid:not([data-processed]), .mermaid[data-processed]"
    );

    for (const diagram of diagrams) {
      const source =
        diagram.getAttribute("data-original-source") ||
        diagram.textContent;

      if (!diagram.hasAttribute("data-original-source")) {
        diagram.setAttribute("data-original-source", source);
      }

      diagram.removeAttribute("data-processed");
      diagram.innerHTML = source;
    }

    await mermaid.run({ nodes: diagrams });
  };

  document$.subscribe(() => {
    renderMermaid();
  });

  // Respond to Material's palette toggle.
  const observer = new MutationObserver(() => {
    renderMermaid();
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-md-color-scheme"]
  });
})();
