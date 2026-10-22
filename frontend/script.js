// ---------- MOBILE MENU ----------
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
    menuToggle.textContent = open ? '✕' : '☰';
});

// on phones, tapping a dropdown title opens it instead of following the link
document.querySelectorAll('.drop-down > a, .has-submenu > a').forEach(link => {
    link.addEventListener('click', e => {
        if (window.innerWidth <= 992) {
            e.preventDefault();
            link.parentElement.classList.toggle('open');
        }
    });
});

// reset everything when the window goes back to desktop size
window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        document.querySelectorAll('.nav-links.open, .nav-links .open')
            .forEach(el => el.classList.remove('open'));
        menuToggle.textContent = '☰';
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

// ---------- PORTFOLIO STRIP ----------
const pTrack = document.querySelector('.portfolio-track');

if (pTrack) {                                   // skips safely if the section is missing
    const pWrap = document.querySelector('.portfolio-wrap');
    const pItems = [...pTrack.querySelectorAll('.portfolio-item')];
    const pDotsBox = document.querySelector('.portfolio-dots');
    let pIndex = 0;
    let pTimer;

    // one dot per photo
    pItems.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Photo ${i + 1}`);
        dot.addEventListener('click', () => pGo(i));
        pDotsBox.appendChild(dot);
    });
    const pDots = [...pDotsBox.children];

    function pGo(i) {
        pIndex = (i + pItems.length) % pItems.length;
        pTrack.scrollTo({ left: pItems[pIndex].offsetLeft, behavior: 'smooth' });
    }

    // keep the active dot in sync, including when someone swipes
    pTrack.addEventListener('scroll', () => {
        const x = pTrack.scrollLeft;
        let i = pItems.findIndex(it => it.offsetLeft >= x - 5);
        if (i === -1 || x >= pTrack.scrollWidth - pTrack.clientWidth - 5) i = pItems.length - 1;
        pIndex = i;
        pDots.forEach((d, n) => d.classList.toggle('active', n === i));
    });
    pDots[0].classList.add('active');

    document.querySelector('.portfolio-arrow.next').addEventListener('click', () => pGo(pIndex + 1));
    document.querySelector('.portfolio-arrow.prev').addEventListener('click', () => pGo(pIndex - 1));

    // auto-advance, paused while hovering
    const pStart = () => { pTimer = setInterval(() => pGo(pIndex + 1), 3500); };
    pStart();
    pWrap.addEventListener('mouseenter', () => clearInterval(pTimer));
    pWrap.addEventListener('mouseleave', pStart);
}
