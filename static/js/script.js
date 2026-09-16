/*
    ==================================================
    SOURAV BOURI
    CINEMATIC SCROLL ENGINE
    ==================================================

    Features:

    - Scroll-driven word animation
    - Individual word pop-up
    - Highlighted words
    - Paragraph focus
    - Cinematic section movement
    - Active navigation
    - Interactive cards
    - Mouse parallax
*/


let sections = [];

let ticking = false;


/* ==================================================
   DOM READY
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        sections =
            Array.from(
                document.querySelectorAll(
                    ".page-section"
                )
            );


        startNavigation();

        startScrollEngine();

        startInteractiveCards();

        startMouseParallax();

        updateEverything();


        /*
            Cybersecurity FX layer.

            All of these are additive and
            fail silently if their target
            markup is not present.
        */

        startMatrixRain();

        startCyberCursor();

        startGlitchBursts();

        startTextScramble();

        startSidebarCycle();

        startTypedLine();

        startContactForm();

        start3DTiltCards();

    }
);


/* ==================================================
   PREFERS REDUCED MOTION
================================================== */

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


const isTouchDevice =
    window.matchMedia(
        "(pointer: coarse)"
    ).matches;


/* ==================================================
   MATRIX RAIN
================================================== */

function startMatrixRain() {

    const canvas =
        document.getElementById(
            "matrixRain"
        );


    if (!canvas || prefersReducedMotion) {

        return;

    }


    const ctx =
        canvas.getContext(
            "2d"
        );


    const glyphs =
        "01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ$#%&+=";


    let columns =
        [];


    let fontSize =
        16;


    function resize() {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;


        const columnCount =
            Math.floor(
                canvas.width /
                fontSize
            );


        columns =
            new Array(
                columnCount
            ).fill(0)
             .map(
                () => Math.floor(
                    Math.random() *
                    -80
                )
             );

    }


    resize();


    window.addEventListener(
        "resize",
        resize
    );


    function draw() {

        ctx.fillStyle =
            "rgba(4,6,6,0.16)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.font =
            `${fontSize}px monospace`;


        columns.forEach(
            (y, index) => {

                const char =
                    glyphs[
                        Math.floor(
                            Math.random() *
                            glyphs.length
                        )
                    ];


                const x =
                    index *
                    fontSize;


                const isLead =
                    Math.random() >
                    0.94;


                ctx.fillStyle =
                    isLead
                        ? "rgba(220,255,248,0.85)"
                        : "rgba(0,255,213,0.55)";


                ctx.fillText(
                    char,
                    x,
                    y * fontSize
                );


                if (
                    y * fontSize >
                        canvas.height &&
                    Math.random() >
                        0.975
                ) {

                    columns[index] =
                        0;

                } else {

                    columns[index] =
                        y + 1;

                }

            }
        );


        window.setTimeout(
            () => requestAnimationFrame(draw),
            60
        );

    }


    draw();

}


/* ==================================================
   CYBER CURSOR
================================================== */

function startCyberCursor() {

    const cursor =
        document.querySelector(
            ".cyber-cursor"
        );


    if (
        !cursor ||
        isTouchDevice
    ) {

        return;

    }


    /*
        Only hide the native OS cursor once we
        know the custom cursor is actually running.
    */

    document.documentElement.classList.add(
        "has-cyber-cursor"
    );


    cursor.classList.add(
        "is-active"
    );


    let targetX =
        window.innerWidth / 2;


    let targetY =
        window.innerHeight / 2;


    let currentX =
        targetX;


    let currentY =
        targetY;


    window.addEventListener(
        "mousemove",
        (event) => {

            targetX =
                event.clientX;

            targetY =
                event.clientY;


            cursor.classList.add(
                "is-active"
            );


            const hoverTarget =
                event.target.closest(
                    "a, button, .interactive-card, .glitch-word, .hero-photo"
                );


            cursor.classList.toggle(
                "is-hover",
                Boolean(
                    hoverTarget
                )
            );

        },
        {
            passive:
                true
        }
    );


    function animate() {

        currentX +=
            (targetX - currentX) *
            0.22;

        currentY +=
            (targetY - currentY) *
            0.22;


        cursor.style.transform =
            `translate(${currentX}px,${currentY}px)`;


        requestAnimationFrame(
            animate
        );

    }


    animate();

}


/* ==================================================
   GLITCH BURSTS
   Mr. Robot style identity break-up on the hero name,
   the logo, and (rarely) other headings.
================================================== */

function startGlitchBursts() {

    if (prefersReducedMotion) {

        return;

    }


    const heroWords =
        document.querySelectorAll(
            ".hero-title .glitch-word"
        );


    function burst(nodeList, duration) {

        nodeList.forEach(
            (node) => {

                node.classList.add(
                    "is-glitching"
                );

            }
        );


        window.setTimeout(
            () => {

                nodeList.forEach(
                    (node) => {

                        node.classList.remove(
                            "is-glitching"
                        );

                    }
                );

            },
            duration
        );

    }


    function scheduleHeroGlitch() {

        burst(
            heroWords,
            460
        );


        window.setTimeout(
            scheduleHeroGlitch,
            4200 +
            Math.random() *
            5200
        );

    }


    if (heroWords.length) {

        window.setTimeout(
            scheduleHeroGlitch,
            2200
        );


        const heroTitle =
            document.querySelector(
                ".glitch-title"
            );


        if (heroTitle) {

            heroTitle.addEventListener(
                "mouseenter",
                () => burst(
                    heroWords,
                    400
                )
            );

        }

    }


    const logo =
        document.querySelector(
            ".logo.glitch-word"
        );


    if (logo) {

        logo.addEventListener(
            "mouseenter",
            () => burst(
                [logo],
                300
            )
        );


        function scheduleLogoGlitch() {

            burst(
                [logo],
                300
            );


            window.setTimeout(
                scheduleLogoGlitch,
                6000 +
                Math.random() *
                7000
            );

        }


        window.setTimeout(
            scheduleLogoGlitch,
            5000
        );

    }

}


/* ==================================================
   TEXT SCRAMBLE / DECRYPT-IN
================================================== */

const SCRAMBLE_GLYPHS =
    "!<>-_\\/[]{}—=+*^?#________";


function scrambleReveal(
    node,
    finalText,
    duration = 700
) {

    const characters =
        finalText.split(
            ""
        );


    const startTime =
        performance.now();


    function frame(now) {

        const elapsed =
            now - startTime;


        const progress =
            clamp(
                elapsed / duration,
                0,
                1
            );


        const revealCount =
            Math.floor(
                progress *
                characters.length
            );


        let output =
            "";


        characters.forEach(
            (char, index) => {

                if (
                    char === " " ||
                    index < revealCount
                ) {

                    output +=
                        char;

                    return;

                }


                output +=
                    SCRAMBLE_GLYPHS[
                        Math.floor(
                            Math.random() *
                            SCRAMBLE_GLYPHS.length
                        )
                    ];

            }
        );


        node.textContent =
            output;


        if (progress < 1) {

            requestAnimationFrame(
                frame
            );

        } else {

            node.textContent =
                finalText;

        }

    }


    requestAnimationFrame(
        frame
    );

}


function startTextScramble() {

    const targets =
        document.querySelectorAll(
            ".scramble-text, .section-eyebrow"
        );


    if (!targets.length) {

        return;

    }


    if (prefersReducedMotion) {

        return;

    }


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (!entry.isIntersecting) {

                            return;

                        }


                        const node =
                            entry.target;


                        if (
                            node.dataset.scrambled ===
                            "true"
                        ) {

                            return;

                        }


                        node.dataset.scrambled =
                            "true";


                        const finalText =
                            (
                                node.dataset.scramble ||
                                node.textContent
                            )
                            .replace(/\s+/g, " ")
                            .trim();


                        scrambleReveal(
                            node,
                            finalText,
                            600
                        );


                        observer.unobserve(
                            node
                        );

                    }
                );

            },
            {
                threshold:
                    0.6
            }
        );


    targets.forEach(
        (node) => observer.observe(node)
    );

}


/* ==================================================
   SIDEBAR STATUS CYCLE
   Cycles LEARN / BUILD / HACK / IMPROVE / REPEAT
================================================== */

function startSidebarCycle() {

    const items =
        document.querySelectorAll(
            ".sidebar-cycle li"
        );


    if (!items.length) {

        return;

    }


    let index =
        0;


    items[0].classList.add(
        "is-current"
    );


    if (prefersReducedMotion) {

        return;

    }


    window.setInterval(
        () => {

            items[index].classList.remove(
                "is-current"
            );


            index =
                (index + 1) %
                items.length;


            items[index].classList.add(
                "is-current"
            );

        },
        1500
    );

}


/* ==================================================
   TYPED LINE (availability pill)
================================================== */

function startTypedLine() {

    const node =
        document.querySelector(
            "[data-typed]"
        );


    if (
        !node ||
        prefersReducedMotion
    ) {

        return;

    }


    const finalText =
        node.textContent
            .replace(/\s+/g, " ")
            .trim();


    node.textContent =
        "";


    let i =
        0;


    function typeNext() {

        if (i > finalText.length) {

            return;

        }


        node.textContent =
            finalText.slice(
                0,
                i
            );


        i +=
            1;


        window.setTimeout(
            typeNext,
            45
        );

    }


    window.setTimeout(
        typeNext,
        900
    );

}


/* ==================================================
   NAVIGATION
================================================== */

function startNavigation() {

    const links =
        document.querySelectorAll(
            "[data-section]"
        );


    links.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const sectionId =
                        link.dataset.section;


                    const target =
                        document.getElementById(
                            sectionId
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView(
                        {
                            behavior:
                                "smooth",

                            block:
                                "start"
                        }
                    );


                    history.pushState(
                        null,
                        "",
                        `#${sectionId}`
                    );

                }
            );

        }
    );

}


/* ==================================================
   SCROLL ENGINE
================================================== */

function startScrollEngine() {

    window.addEventListener(
        "scroll",
        requestUpdate,
        {
            passive:
                true
        }
    );


    window.addEventListener(
        "resize",
        requestUpdate
    );


    requestUpdate();

}


/* ==================================================
   REQUEST UPDATE
================================================== */

function requestUpdate() {

    if (ticking) {

        return;

    }


    ticking =
        true;


    requestAnimationFrame(
        () => {

            updateEverything();

            ticking =
                false;

        }
    );

}


/* ==================================================
   MASTER UPDATE
================================================== */

function updateEverything() {

    updateSections();

    updateWords();

    updateParagraphs();

}


/* ==================================================
   SECTION UPDATE
================================================== */

function updateSections() {

    if (!sections.length) {

        return;

    }


    const viewportCenter =
        window.innerHeight / 2;


    let closest =
        null;


    let closestDistance =
        Infinity;


    sections.forEach(
        (section) => {

            const rect =
                section.getBoundingClientRect();


            const center =
                rect.top +
                rect.height / 2;


            const distance =
                Math.abs(
                    center -
                    viewportCenter
                );


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closest =
                    section;

            }


            animateSection(
                section,
                rect
            );

        }
    );


    if (closest) {

        updateNavigation(
            closest.id
        );

    }

}


/* ==================================================
   SECTION ANIMATION
================================================== */

function animateSection(
    section,
    rect
) {

    const viewportHeight =
        window.innerHeight;


    const center =
        rect.top +
        rect.height / 2;


    const distance =
        center -
        viewportHeight / 2;


    let progress =
        1 -
        Math.abs(
            distance
        ) /
        (
            viewportHeight *
            0.95
        );


    progress =
        clamp(
            progress,
            0,
            1
        );


    const container =
        section.querySelector(
            ".section-container"
        );


    if (!container) {

        return;

    }


    /*
        Only a tiny movement.

        The section should feel alive,
        not like a PowerPoint slide.
    */

    const movement =
        distance *
        -0.025;


    const scale =
        0.992 +
        progress *
        0.008;


    container.style.transform =
        `
        translate3d(
            0,
            ${movement}px,
            0
        )
        scale(${scale})
        `;

}


/* ==================================================
   WORD ANIMATION
================================================== */

function updateWords() {

    const words =
        document.querySelectorAll(
            ".word"
        );


    const viewportHeight =
        window.innerHeight;


    words.forEach(
        (word) => {

            const rect =
                word.getBoundingClientRect();


            const center =
                rect.top +
                rect.height / 2;


            const distance =
                Math.abs(
                    center -
                    viewportHeight / 2
                );


            /*
                0 = far away
                1 = exactly centered
            */

            let focus =
                1 -
                distance /
                (
                    viewportHeight *
                    0.55
                );


            focus =
                clamp(
                    focus,
                    0,
                    1
                );


            /*
                The closer the word gets
                to the visual focus point,
                the stronger it becomes.
            */

            const y =
                (1 - focus) *
                38;


            const scale =
                0.96 +
                focus *
                0.04;


            let opacity =
                0.2 +
                focus *
                0.8;


            /*
                Highlight words are allowed
                to become more prominent.
            */

            if (
                word.classList.contains(
                    "highlight-word"
                )
            ) {

                opacity =
                    0.3 +
                    focus *
                    0.7;

            }


            word.style.opacity =
                opacity;


            word.style.transform =
                `
                translateY(${y}px)
                scale(${scale})
                `;


            if (
                focus >
                0.58
            ) {

                word.classList.add(
                    "is-visible"
                );

            } else {

                word.classList.remove(
                    "is-visible"
                );

            }

        }
    );

}


/* ==================================================
   PARAGRAPH ANIMATION
================================================== */

function updateParagraphs() {

    const paragraphs =
        document.querySelectorAll(
            ".scroll-paragraph"
        );


    const viewportHeight =
        window.innerHeight;


    paragraphs.forEach(
        (paragraph) => {

            const rect =
                paragraph.getBoundingClientRect();


            const center =
                rect.top +
                rect.height / 2;


            const distance =
                Math.abs(
                    center -
                    viewportHeight / 2
                );


            let focus =
                1 -
                distance /
                (
                    viewportHeight *
                    0.65
                );


            focus =
                clamp(
                    focus,
                    0,
                    1
                );


            paragraph.style.opacity =
                0.25 +
                focus *
                0.75;


            paragraph.style.transform =
                `
                translateY(
                    ${(1 - focus) * 25}px
                )
                `;


            if (
                focus >
                0.55
            ) {

                paragraph.classList.add(
                    "is-active"
                );

            } else {

                paragraph.classList.remove(
                    "is-active"
                );

            }

        }
    );

}


/* ==================================================
   NAVIGATION STATE
================================================== */

function updateNavigation(
    activeId
) {

    const links =
        document.querySelectorAll(
            ".nav-links a[data-section]"
        );


    links.forEach(
        (link) => {

            if (
                link.dataset.section ===
                activeId
            ) {

                link.classList.add(
                    "active"
                );

            } else {

                link.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* ==================================================
   INTERACTIVE CARDS
================================================== */

function startInteractiveCards() {

    const cards =
        document.querySelectorAll(
            ".interactive-card"
        );


    if (!cards.length) {

        return;

    }


    cards.forEach(
        (card) => {

            card.addEventListener(
                "click",
                (event) => {

                    /*
                        Desktop hover handles
                        the first interaction.

                        Click is especially useful
                        on phones.
                    */

                    if (
                        window.innerWidth >
                        768
                    ) {

                        return;

                    }


                    event.stopPropagation();


                    cards.forEach(
                        (other) => {

                            if (
                                other !==
                                card
                            ) {

                                other.classList.remove(
                                    "card-active"
                                );

                            }

                        }
                    );


                    card.classList.toggle(
                        "card-active"
                    );

                }
            );

        }
    );


    document.addEventListener(
        "click",
        () => {

            if (
                window.innerWidth >
                768
            ) {

                return;

            }


            cards.forEach(
                (card) => {

                    card.classList.remove(
                        "card-active"
                    );

                }
            );

        }
    );

}


/* ==================================================
   MOUSE PARALLAX
================================================== */

function startMouseParallax() {

    const hero =
        document.querySelector(
            ".hero"
        );


    const photoFrame =
        document.querySelector(
            ".photo-frame"
        );


    if (!hero || !photoFrame) {

        return;

    }


    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches ||
        prefersReducedMotion
    ) {

        return;

    }


    let targetX =
        0;


    let targetY =
        0;


    let currentX =
        0;


    let currentY =
        0;


    hero.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                hero.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            targetX =
                (
                    x -
                    rect.width / 2
                ) /
                (
                    rect.width / 2
                );


            targetY =
                (
                    y -
                    rect.height / 2
                ) /
                (
                    rect.height / 2
                );

        }
    );


    hero.addEventListener(
        "mouseleave",
        () => {

            targetX =
                0;

            targetY =
                0;

        }
    );


    function animate() {

        currentX +=
            (
                targetX -
                currentX
            ) *
            0.06;


        currentY +=
            (
                targetY -
                currentY
            ) *
            0.06;


        /*
            Subtle 3D tilt — the photo rotates a
            little toward the cursor, like it's a
            physical panel catching the light.
            Capped at a few degrees so it reads as
            depth, not a wobble.
        */

        const rotateY =
            currentX * 7;


        const rotateX =
            currentY * -7;


        photoFrame.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;


        requestAnimationFrame(
            animate
        );

    }


    animate();

}


/* ==================================================
   3D TILT CARDS
   Applies a cursor-driven perspective tilt + glare
   to project / skill / lab / curiosity / article
   cards. Purely additive — falls back to the card's
   normal flat hover state with no JS at all.
================================================== */

function start3DTiltCards() {

    if (
        prefersReducedMotion ||
        isTouchDevice
    ) {

        return;

    }


    const cards =
        document.querySelectorAll(
            ".interactive-card, .article-card"
        );


    if (!cards.length) {

        return;

    }


    const MAX_TILT_DEGREES =
        7;


    cards.forEach(
        (card) => {

            card.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        (event.clientX - rect.left) /
                        rect.width;


                    const y =
                        (event.clientY - rect.top) /
                        rect.height;


                    const tiltX =
                        (0.5 - y) *
                        MAX_TILT_DEGREES *
                        2;


                    const tiltY =
                        (x - 0.5) *
                        MAX_TILT_DEGREES *
                        2;


                    card.style.setProperty(
                        "--tilt-x",
                        `${tiltX}deg`
                    );


                    card.style.setProperty(
                        "--tilt-y",
                        `${tiltY}deg`
                    );


                    card.style.setProperty(
                        "--glare-x",
                        `${x * 100}%`
                    );


                    card.style.setProperty(
                        "--glare-y",
                        `${y * 100}%`
                    );

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.setProperty(
                        "--tilt-x",
                        "0deg"
                    );

                    card.style.setProperty(
                        "--tilt-y",
                        "0deg"
                    );

                }
            );

        }
    );

}


/* ==================================================
   INITIAL HASH
================================================== */

window.addEventListener(
    "load",
    () => {

        const hash =
            window.location.hash;


        if (!hash) {

            return;

        }


        const target =
            document.querySelector(
                hash
            );


        if (!target) {

            return;

        }


        window.setTimeout(
            () => {

                target.scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "start"
                    }
                );

            },
            200
        );

    }
);


/* ==================================================
   CLAMP
================================================== */

function clamp(
    value,
    minimum,
    maximum
) {

    return Math.min(
        Math.max(
            value,
            minimum
        ),
        maximum
    );

}

/* ==================================================
   CONTACT FORM

   Posts to /contact on this same Flask app. The
   real inbox address is never present here or
   anywhere in the HTML -- it only lives server-side
   in app.py / the .env file.
================================================== */

function startContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );


    if (!form) {

        return;

    }


    const statusBox =
        document.getElementById(
            "formStatus"
        );


    const submitButton =
        document.getElementById(
            "cf-submit"
        );


    const fields =
        form.querySelectorAll(
            "input, textarea"
        );


    fields.forEach(
        (field) => {

            field.addEventListener(
                "blur",
                () => field.classList.add(
                    "is-touched"
                )
            );

        }
    );


    function showStatus(message, isSuccess) {

        statusBox.textContent =
            message;

        statusBox.classList.add(
            "is-visible"
        );

        statusBox.classList.toggle(
            "is-success",
            isSuccess
        );

        statusBox.classList.toggle(
            "is-error",
            !isSuccess
        );

    }


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                form.name.value.trim();

            const email =
                form.email.value.trim();

            const subject =
                form.subject.value.trim();

            const message =
                form.message.value.trim();

            const company =
                form.company.value.trim();


            fields.forEach(
                (field) => field.classList.add(
                    "is-touched"
                )
            );


            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                showStatus(
                    "Please fill in every field.",
                    false
                );

                return;

            }


            submitButton.disabled =
                true;

            submitButton.classList.add(
                "is-sending"
            );

            statusBox.classList.remove(
                "is-visible"
            );


            try {

                const response =
                    await fetch(
                        "/contact",
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify({
                                    name,
                                    email,
                                    subject,
                                    message,
                                    company,
                                }),
                        }
                    );


                let result =
                    {};

                try {

                    result =
                        await response.json();

                } catch (parseError) {

                    result =
                        {};

                }


                if (
                    response.ok &&
                    result.ok
                ) {

                    showStatus(
                        "Message sent — I'll get back to you soon.",
                        true
                    );

                    form.reset();

                    fields.forEach(
                        (field) => field.classList.remove(
                            "is-touched"
                        )
                    );

                } else {

                    showStatus(
                        result.error ||
                            "Something went wrong sending your message. Please try again.",
                        false
                    );

                }

            } catch (networkError) {

                showStatus(
                    "Couldn't reach the server. Check your connection and try again.",
                    false
                );

            } finally {

                submitButton.disabled =
                    false;

                submitButton.classList.remove(
                    "is-sending"
                );

            }

        }
    );

}
