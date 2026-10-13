document$.subscribe(() => {
  mermaid.initialize({
    startOnLoad: false,
    theme: "base"
  });

  mermaid.run().catch((error) => {
    console.error("Mermaid rendering failed:", error);
  });
});
