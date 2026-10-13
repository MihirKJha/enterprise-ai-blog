(() => {
  "use strict";

  const palettes = {
    light: {
      background: "#FFFFFF",
      primaryColor: "#E0F2FE",
      primaryTextColor: "#0C1E35",
      primaryBorderColor: "#0284C7",
      secondaryColor: "#D1FAE5",
      secondaryTextColor: "#064E3B",
      secondaryBorderColor: "#059669",
      tertiaryColor: "#EDE9FE",
      tertiaryTextColor: "#3B0764",
      tertiaryBorderColor: "#7C3AED",
      lineColor: "#64748B",
      textColor: "#1E293B",
      mainBkg: "#E0F2FE",
      nodeBorder: "#0284C7",
      clusterBkg: "#F8FAFC",
      clusterBorder: "#94A3B8",
      edgeLabelBackground: "#FFFFFF"
    },
    dark: {
      background: "#111827",
      primaryColor: "#172554",
      primaryTextColor: "#F8FAFC",
      primaryBorderColor: "#38BDF8",
      secondaryColor: "#064E3B",
      secondaryTextColor: "#ECFDF5",
      secondaryBorderColor: "#34D399",
      tertiaryColor: "#3B0764",
      tertiaryTextColor: "#FAF5FF",
      tertiaryBorderColor: "#C084FC",
      lineColor: "#94A3B8",
      textColor: "#E2E8F0",
      mainBkg: "#172554",
      nodeBorder: "#38BDF8",
      clusterBkg: "#1E293B",
      clusterBorder: "#64748B",
      edgeLabelBackground: "#1E293B"
    }
  };

  const isDark = () =>
    document.body.dataset.mdColorScheme === "slate";

  const render = async () => {
    if (!window.mermaid) return;

    const dark = isDark();

    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: dark ? palettes.dark : palettes.light,
      securityLevel: "strict",
      flowchart: {
        htmlLabels: true,
        curve: "basis"
      }
    });

    const diagrams = [...document.querySelectorAll(".mermaid")];

    for (const el of diagrams) {
      if (!el.dataset.mermaidSource) {
        el.dataset.mermaidSource = el.textContent.trim();
      }

      el.removeAttribute("data-processed");
      el.innerHTML = el.dataset.mermaidSource;
    }

    if (diagrams.length) {
      try {
        await mermaid.run({ nodes: diagrams });
      } catch (error) {
        console.error("Mermaid rendering failed:", error);
      }
    }
  };

  let lastScheme = null;

  const renderOnChange = () => {
    const scheme = isDark() ? "dark" : "light";
    if (scheme !== lastScheme) {
      lastScheme = scheme;
      render();
    }
  };

  document$.subscribe(() => {
    lastScheme = null;
    renderOnChange();
  });

  new MutationObserver(renderOnChange).observe(document.body, {
    attributes: true,
    attributeFilter: ["data-md-color-scheme"]
  });
})();