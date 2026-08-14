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