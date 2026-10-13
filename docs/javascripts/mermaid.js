document$.subscribe(() => {
  mermaid.initialize({
    startOnLoad: false,
    theme: "default"
  });

  mermaid.run().catch((error) => {
    console.error("Mermaid rendering failed:", error);
  });
});
