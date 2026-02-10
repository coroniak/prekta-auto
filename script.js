document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. Scroll Animations (Intersection Observer) ---
    // Elementy pojawiają się płynnie podczas przewijania
    const faders = document.querySelectorAll('.fade-up');
    const appearOptions = {
        threshold: 0.1, // Pojaw się, gdy 10% elementu jest widoczne
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appeared');
                appearOnScroll.unobserve(entry.target); // Przestań obserwować po pojawieniu się
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- 3. Mobile Navigation (Burger) ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Zamknij menu po kliknięciu
    navLinks.forEach(link => {
        link.addEventListener('click', () => {nav.classList.remove('nav-active'); burger.classList.remove('toggle'); navLinks.forEach(item => item.style.animation = '');});
    });

    // --- 4. Status Godzin Otwarcia ---
    checkOpenStatus();
});

function checkOpenStatus() {
    const statusText = document.getElementById('open-status-text');
    const statusDot = document.querySelector('.status-dot');
    
    const now = new Date();
    const day = now.getDay(); // 0=Nd, 1=Pn, 6=So
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + (minute / 60);

    // Godziny: Pn-Pt 8:30 - 17:00
    const openTime = 8.5; // 8:30
    const closeTime = 17.0; // 17:00

    let isOpen = false;

    if (day >= 1 && day <= 5) {
        if (currentTime >= openTime && currentTime < closeTime) {
            isOpen = true;
        }
    }

    if (isOpen) {
        statusText.textContent = "Otwarte";
        statusText.style.color = "#2ecc71";
        statusDot.classList.add('open');
    } else {
        statusText.textContent = "Zamknięte (Otwarte Pn-Pt 08:30-17:00)";
        statusDot.classList.add('closed');
    }
}