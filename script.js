document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // 2. Animacje Scrolla
    const faders = document.querySelectorAll('.fade-up');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appeared');
            appearOnScroll.unobserve(entry.target);
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));

    // 3. Obsługa Menu
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    function toggleMenu() {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    }

    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });// ... (poprzedni kod: navbar, animacje, menu, status) ...

    // --- 6. OBSŁUGA INTERAKTYWNEJ MOZAIKI (Lightbox) ---
    
    // Pobieramy elementy modala
    const modalOverlay = document.getElementById('image-modal');
    // Sprawdzamy, czy modal istnieje na tej stronie (tylko index.html)
    if (modalOverlay) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-description');
        const closeModalBtn = document.querySelector('.close-modal');
        const mosaicItems = document.querySelectorAll('.mosaic-item');

        // Funkcja otwierająca modal
        function openModal(imgSrc, title, description) {
            modalImg.src = imgSrc;
            modalTitle.textContent = title;
            modalDesc.textContent = description;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Zablokuj przewijanie strony w tle
        }

        // Funkcja zamykająca modal
        function closeModal() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto'; // Odblokuj przewijanie
            // Wyczyść src po zamknięciu (dla płynności)
            setTimeout(() => { modalImg.src = ''; }, 300); 
        }

        // Dodaj nasłuchiwacze kliknięć do kafelków
        mosaicItems.forEach(item => {
            item.addEventListener('click', () => {
                // Pobierz dane z klikniętego kafelka
                const imgElement = item.querySelector('img');
                const imgSrc = imgElement.src;
                // Pobierz tytuł i opis z atrybutów data-
                const title = item.getAttribute('data-title');
                const desc = item.getAttribute('data-description');
                
                openModal(imgSrc, title, desc);
            });
        });

        // Zamykanie przyciskiem X
        closeModalBtn.addEventListener('click', closeModal);

        // Zamykanie kliknięciem w tło (poza kontenerem)
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Zamykanie klawiszem ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // --- KONIEC OBSŁUGI MODALA ---
    
    // 5. Status Godzin (to powinno być na samym końcu)
    checkOpenStatus();


    document.addEventListener('click', (e) => {
        if (nav.classList.contains('nav-active') && !nav.contains(e.target) && !burger.contains(e.target)) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
        }
    });

    // 4. ACTIVE LINK HIGHLIGHT (Nowość)
    // Pobiera nazwę pliku z URL (np. 'oferta.html')
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navItems = document.querySelectorAll('.nav-links li a');

    navItems.forEach(link => {
        // Jeśli href linku pasuje do obecnej strony, dodaj klasę .active-page
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active-page');
        }
    });

    // 5. Status Godzin
    checkOpenStatus();
});

function checkOpenStatus() {
    const statusText = document.getElementById('open-status-text');
    if(!statusText) return;
    
    const statusDot = document.querySelector('.status-dot');
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + (minute / 60);
    
    // Pn-Pt 8:30 - 17:00
    let isOpen = (day >= 1 && day <= 5 && currentTime >= 8.5 && currentTime < 17.0);

    if (isOpen) {
        statusText.textContent = "Otwarte";
        statusText.style.color = "#4cbb17";
        if(statusDot) { statusDot.classList.add('open'); statusDot.style.backgroundColor = "#4cbb17"; }
    } else {
        statusText.textContent = "Zamknięte (Pn-Pt 08:30-17:00)";
        if(statusDot) statusDot.classList.add('closed');
    }
}