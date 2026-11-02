/* =========================================================
   home.js  -  interactivity for index.html

   Link it AFTER script.js:
       <script src="script.js"></script>
       <script src="home.js"></script>

   Every block checks that its elements exist first, so one missing
   element never stops the blocks below it from running.
   The mobile menu and the portfolio strip stay in script.js.
   ========================================================= */


/* ---------- 1. SCROLL OFFSET ----------
   Anchor links (#about, #services...) should stop BELOW the sticky header,
   so we measure the header and tell the browser how much space to leave. */
const siteHeader = document.querySelector('.site-header');

function setScrollOffset() {
    if (!siteHeader) return;
    document.documentElement.style.scrollPaddingTop = siteHeader.offsetHeight + 'px';
}
setScrollOffset();
window.addEventListener('resize', setScrollOffset);


/* ---------- 2. ACTIVE NAV LINK WHILE SCROLLING ----------
   The nav link whose section is in the middle of the screen gets the
   gold "active" underline. */
const sectionLinks = [...document.querySelectorAll('.nav-links > li > a[href^="#"]')]
    .filter(link => link.getAttribute('href').length > 1);

if (sectionLinks.length && 'IntersectionObserver' in window) {
    const linkById = new Map(
        sectionLinks.map(link => [link.getAttribute('href').slice(1), link])
    );

    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            sectionLinks.forEach(link => link.classList.remove('active'));
            const match = linkById.get(entry.target.id);
            if (match) match.classList.add('active');
        });
    }, { rootMargin: '-40% 0px -55% 0px' });   // watches a thin band in the middle of the screen

    linkById.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) spy.observe(section);
    });
}


/* ---------- 3. STATS COUNTERS ----------
   Numbers count up from 0 the first time they scroll into view.
   They read data-target, data-decimals and data-suffix from the HTML. */
const counters = document.querySelectorAll('.stat-number[data-target]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function formatNumber(value, decimals, suffix) {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }) + suffix;
}

function runCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';

    if (reduceMotion) {
        el.textContent = formatNumber(target, decimals, suffix);
        return;
    }

    const duration = 1800;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);        // starts fast, slows down at the end
        el.textContent = formatNumber(target * eased, decimals, suffix);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            observer.unobserve(entry.target);               // only count once
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}


/* ---------- 4. VIDEO POP-UP (the play button in the About section) ---------- */
const videoModal = document.getElementById('videoModal');
const playButtons = document.querySelectorAll('.about-play');

if (videoModal && playButtons.length) {
    const modalBody = videoModal.querySelector('.video-modal-body');
    const closeButton = videoModal.querySelector('.video-modal-close');
    let opener = null;

    function openVideo(button) {
        const src = button.dataset.src;
        if (!src) return;                                    // no video set on this button
        opener = button;

        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        modalBody.replaceChildren(video);

        videoModal.hidden = false;
        document.body.style.overflow = 'hidden';             // stop the page scrolling behind
        closeButton.focus();
    }

    function closeVideo() {
        videoModal.hidden = true;
        modalBody.replaceChildren();                         // removing the video also stops it
        document.body.style.overflow = '';
        if (opener) opener.focus();
    }

    playButtons.forEach(button => button.addEventListener('click', () => openVideo(button)));
    closeButton.addEventListener('click', closeVideo);
    videoModal.addEventListener('click', event => {
        if (event.target === videoModal) closeVideo();       // click on the dark background
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !videoModal.hidden) closeVideo();
    });
}


/* ---------- 5. CATEGORY BAR -> PORTFOLIO PAGE ----------
   Clicking WEDDING opens portfolio.html?category=wedding, and the
   portfolio page switches on that filter by itself. */
document.querySelectorAll('.category-item').forEach(item => {
    const heading = item.querySelector('h4');
    if (!heading) return;

    const category = heading.textContent.trim().toLowerCase();   // "WEDDING" -> "wedding"
    const goToPortfolio = () => {
        window.location.href = `portfolio.html?category=${encodeURIComponent(category)}`;
    };

    item.setAttribute('role', 'link');
    item.tabIndex = 0;                                       // reachable with the keyboard
    item.addEventListener('click', goToPortfolio);
    item.addEventListener('keydown', event => {
        if (event.key === 'Enter') goToPortfolio();
    });
});


/* ---------- 6. BACK-TO-TOP BUTTON ---------- */
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
}


/* ---------- 7. FADE-IN ON SCROLL ----------
   JavaScript adds the "reveal" class itself, so if this script ever fails,
   nothing is left invisible. */
const revealTargets = document.querySelectorAll(
    '.about-grid > *, .intro > *, .section-head, .cta-banner > *, .packages-container > *'
);

if (revealTargets.length && 'IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    revealTargets.forEach(target => {
        target.classList.add('reveal');
        revealObserver.observe(target);
    });
}
