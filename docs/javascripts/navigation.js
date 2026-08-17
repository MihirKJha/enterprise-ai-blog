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
   RESIZABLE PRIMARY SIDEBAR
   ============================================================ */

(function () {

    const MIN_WIDTH = 10;
    const MAX_WIDTH = 16;
    const DEFAULT_WIDTH = 10;
    const STORAGE_KEY = "enterprise-ai-primary-sidebar-width";

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function getStoredWidth() {
        const stored = parseFloat(
            localStorage.getItem(STORAGE_KEY)
        );

        return Number.isFinite(stored)
            ? clamp(stored, MIN_WIDTH, MAX_WIDTH)
            : DEFAULT_WIDTH;
    }

    function setSidebarWidth(rem) {
        document.documentElement.style.setProperty(
            "--primary-sidebar-width",
            `${rem}rem`
        );

        localStorage.setItem(
            STORAGE_KEY,
            rem.toString()
        );
    }

    function createResizer() {

        const sidebar = document.querySelector(
            ".md-sidebar--primary"
        );

        if (!sidebar) {
            return;
        }

        if (sidebar.querySelector(".sidebar-resizer")) {
            return;
        }

        const resizer = document.createElement("div");

        resizer.className = "sidebar-resizer";
        resizer.setAttribute(
            "aria-label",
            "Resize navigation sidebar"
        );

        sidebar.appendChild(resizer);

        let dragging = false;

        resizer.addEventListener("pointerdown", function (event) {

            if (window.innerWidth < 1220) {
                return;
            }

            dragging = true;

            resizer.classList.add("dragging");

            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";

            resizer.setPointerCapture(event.pointerId);

            event.preventDefault();
        });

        resizer.addEventListener("pointermove", function (event) {

            if (!dragging) {
                return;
            }

            const sidebarLeft =
                sidebar.getBoundingClientRect().left;

            const widthPx =
                event.clientX - sidebarLeft;

            const rem =
                widthPx / parseFloat(
                    getComputedStyle(document.documentElement)
                        .fontSize
                );

            setSidebarWidth(
                clamp(rem, MIN_WIDTH, MAX_WIDTH)
            );
        });

        function stopDragging() {

            if (!dragging) {
                return;
            }

            dragging = false;

            resizer.classList.remove("dragging");

            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }

        resizer.addEventListener(
            "pointerup",
            stopDragging
        );

        resizer.addEventListener(
            "pointercancel",
            stopDragging
        );

        resizer.addEventListener(
            "lostpointercapture",
            stopDragging
        );
    }

    function initialize() {

        setSidebarWidth(getStoredWidth());

        createResizer();
    }

    if (document$) {

        document$.subscribe(function () {
            initialize();
        });

    } else {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    }

})();
