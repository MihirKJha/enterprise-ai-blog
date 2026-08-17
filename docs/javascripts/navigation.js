document.addEventListener("DOMContentLoaded", function () {

    /*
     * ============================================================
     * CREATE SIDEBAR TOGGLE
     * ============================================================
     */

    const button = document.createElement("button");

    button.className = "sidebar-toggle";

    button.setAttribute(
        "aria-label",
        "Collapse navigation sidebar"
    );

    button.setAttribute(
        "title",
        "Collapse navigation sidebar"
    );

    button.innerHTML =
        '<span class="sidebar-toggle__icon">‹</span>';

    document.body.appendChild(button);


    /*
     * ============================================================
     * FIND PRIMARY SIDEBAR
     * ============================================================
     */

    const sidebar =
        document.querySelector(".md-sidebar--primary");


    /*
     * ============================================================
     * POSITION TOGGLE
     * ============================================================
     */

    function positionToggle() {

        if (!sidebar) {
            return;
        }

        /*
         * If collapsed, keep button at viewport edge.
         */

        if (
            document.body.classList.contains(
                "sidebar-collapsed"
            )
        ) {
            button.style.left = "0px";
            return;
        }


        /*
         * Get sidebar position.
         */

        const rect =
            sidebar.getBoundingClientRect();


        /*
         * Use the actual right edge.
         */

        if (rect.width > 0 && rect.right > 0) {

            button.style.left =
                `${rect.right}px`;

        } else {

            /*
             * Fallback if sidebar is temporarily
             * hidden during animation.
             */

            button.style.left =
                `${sidebar.offsetWidth}px`;
        }
    }


    /*
     * ============================================================
     * INITIAL POSITION
     * ============================================================
     */

    positionToggle();


    /*
     * ============================================================
     * WINDOW RESIZE
     * ============================================================
     */

    window.addEventListener(
        "resize",
        positionToggle
    );


    /*
     * ============================================================
     * TOGGLE SIDEBAR
     * ============================================================
     */

    button.addEventListener("click", function () {

        const collapsed =
            document.body.classList.toggle(
                "sidebar-collapsed"
            );

        const icon =
            button.querySelector(
                ".sidebar-toggle__icon"
            );


        if (collapsed) {

            /*
             * ----------------------------------------------------
             * COLLAPSED
             * ----------------------------------------------------
             */

            icon.textContent = "›";

            button.setAttribute(
                "aria-label",
                "Expand navigation sidebar"
            );

            button.setAttribute(
                "title",
                "Expand navigation sidebar"
            );

            /*
             * Immediately move button to left edge.
             */

            button.style.left = "0px";

        } else {

            /*
             * ----------------------------------------------------
             * EXPANDED
             * ----------------------------------------------------
             */

            icon.textContent = "‹";

            button.setAttribute(
                "aria-label",
                "Collapse navigation sidebar"
            );

            button.setAttribute(
                "title",
                "Collapse navigation sidebar"
            );


            /*
             * Wait until the sidebar has started
             * expanding before measuring it.
             */

            requestAnimationFrame(function () {

                requestAnimationFrame(function () {

                    positionToggle();

                });

            });


            /*
             * Extra safety for Material's sidebar
             * transition.
             */

            setTimeout(function () {

                positionToggle();

            }, 350);

        }

    });

});


/* ============================================================
   CURRENT ARTICLE LABEL IN OUTLINE
   ============================================================ */

(function () {

    function addCurrentArticleLabel() {

        const toc = document.querySelector(
            ".md-sidebar--secondary .md-nav"
        );

        if (!toc) {
            return;
        }

        if (
            toc.querySelector(
                ".current-article-label"
            )
        ) {
            return;
        }

        const activeArticle =
            document.querySelector(
                ".md-nav--primary .md-nav__link--active"
            );

        if (!activeArticle) {
            return;
        }

        const articleTitle =
            activeArticle.textContent
                .replace(/\s+/g, " ")
                .trim();

        if (!articleTitle) {
            return;
        }

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "current-article-label";

        wrapper.innerHTML = `
            <div class="current-article-label__caption">
                CURRENT ARTICLE
            </div>
            <div class="current-article-label__title">
                ${articleTitle}
            </div>
        `;

        toc.insertBefore(
            wrapper,
            toc.firstChild
        );
    }

    if (typeof document$ !== "undefined") {

        document$.subscribe(function () {
            addCurrentArticleLabel();
        });

    } else {

        document.addEventListener(
            "DOMContentLoaded",
            addCurrentArticleLabel
        );

    }

})();