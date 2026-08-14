"""
MkDocs Markdown heading normalizer.

Purpose
-------
Many handbook notes use multiple top-level '#' headings:

    # Chapter Title
    ## Overview
    # 1. Topic
    # 2. Topic
    # 3. Topic

For a documentation site, the desired hierarchy is:

    # Chapter Title
    ## Overview
    ## 1. Topic
    ## 2. Topic
    ## 3. Topic

This hook keeps the first H1 and converts subsequent
top-level H1 headings into H2 headings.

Important:
- Does not modify the original Markdown files.
- Does not modify headings inside fenced code blocks.
- Does not modify ## / ### / #### headings.
"""


def on_page_markdown(markdown, page, **kwargs):
    lines = markdown.splitlines()

    result = []

    first_h1_seen = False
    inside_fence = False
    fence_marker = None

    for line in lines:

        stripped = line.strip()

        # -----------------------------------------------------
        # Detect fenced code blocks
        # -----------------------------------------------------

        if stripped.startswith("```") or stripped.startswith("~~~"):

            marker = stripped[:3]

            if not inside_fence:
                inside_fence = True
                fence_marker = marker

            elif marker == fence_marker:
                inside_fence = False
                fence_marker = None

            result.append(line)
            continue

        # -----------------------------------------------------
        # Never modify headings inside code blocks
        # -----------------------------------------------------

        if inside_fence:
            result.append(line)
            continue

        # -----------------------------------------------------
        # Detect ATX H1 heading
        #
        # Examples:
        # # Chapter
        # # 1. Topic
        # # Topic {#custom-id}
        # -----------------------------------------------------

        if line.startswith("# ") or line.startswith("#\t"):

            if not first_h1_seen:

                # First H1 = page title
                first_h1_seen = True
                result.append(line)

            else:

                # Subsequent H1 = chapter section
                result.append("#" + line)

            continue

        result.append(line)

    return "\n".join(result)