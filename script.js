document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SMART NAVBAR (Chowanie przy scrollu) ---
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // --- 2. Animacje Scrolla (Fade Up) ---
    const faders = document.querySelectorAll('.fade-up');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appeared');
            observer.unobserve(entry.target);
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));

    // --- 3. Obsługa Menu Burger ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    function toggleMenu() {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    }
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('nav-active') && !nav.contains(e.target) && !burger.contains(e.target)) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
        }
    });

    // --- 4. Podświetlanie Aktywnego Linku ---
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-links li a').forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active-page');
    });

    // --- 5. SLIDER WIDEO (VW Style) ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.pag-dot');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = document.getElementById('play-pause-icon');
    let currentSlide = 0;
    let isPlaying = true;
    
    if(slides.length > 0) {
        // Stan początkowy
        updateSlideState(0);

        function updateSlideState(index) {
            // Pauzuj i resetuj inne filmy
            slides.forEach((s, i) => {
                const v = s.querySelector('video');
                if(v) {
                    v.pause();
                    if(i !== index) v.currentTime = 0;
                }
                s.classList.remove('active');
                dots[i].classList.remove('active');
                dots[i].querySelector('.progress-bar').style.width = '0%';
            });

            // Aktywuj nowy slajd
            currentSlide = index;
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            // Odtwarzaj wideo
            const activeVideo = slides[index].querySelector('video');
            if(activeVideo && isPlaying) activeVideo.play();
        }

        function nextSlide() {
            updateSlideState((currentSlide + 1) % slides.length);
        }

        // Obsługa zdarzeń wideo
        slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if(video) {
                // Gdy film się skończy -> następny
                video.addEventListener('ended', nextSlide);
                // Aktualizacja paska postępu
                video.addEventListener('timeupdate', () => {
                    if(slides[index].classList.contains('active')) {
                        const progress = (video.currentTime / video.duration) * 100;
                        dots[index].querySelector('.progress-bar').style.width = `${progress}%`;
                    }
                });
            }
        });

        // Obsługa kropek
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                if(index !== currentSlide) {
                    if(!isPlaying) togglePlayPause(); 
                    updateSlideState(index);
                }
            });
        });

        // Przycisk Start/Stop
        function togglePlayPause() {
            const activeVideo = slides[currentSlide].querySelector('video');
            if(isPlaying) {
                activeVideo.pause();
                // Zmieniamy ikonę na Play (trójkąt)
                playPauseIcon.classList.remove('icon-pause');
                playPauseIcon.classList.add('icon-play');
                isPlaying = false;
            } else {
                activeVideo.play();
                // Zmieniamy ikonę na Pause (paski)
                playPauseIcon.classList.remove('icon-play');
                playPauseIcon.classList.add('icon-pause');
                isPlaying = true;
            }
        }
        if(playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);

        // Wznawianie po powrocie na kartę
        document.addEventListener('visibilitychange', () => {
            const activeVideo = slides[currentSlide].querySelector('video');
            if (!document.hidden && isPlaying && activeVideo.paused) {
                activeVideo.play();
            } else if (document.hidden && isPlaying) {
                activeVideo.pause();
            }
        });
    }

    // --- 6. Lightbox (Powiększanie zdjęć) ---
    const modalOverlay = document.getElementById('image-modal');
    if (modalOverlay) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-description');
        const closeModalBtn = document.querySelector('.close-modal');
        const mosaicItems = document.querySelectorAll('.mosaic-item');

        function openModal(imgSrc, title, description) {
            modalImg.src = imgSrc;
            modalTitle.textContent = title;
            modalDesc.textContent = description;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeModal() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            setTimeout(() => { modalImg.src = ''; }, 300); 
        }

        mosaicItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                openModal(img.src, item.getAttribute('data-title'), item.getAttribute('data-description'));
            });
        });

        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    }

    // --- 7. Status Godzin Otwarcia ---
    checkOpenStatus();
});

function checkOpenStatus() {
    const statusText = document.getElementById('open-status-text');
    if(!statusText) return;
    const statusDot = document.querySelector('.status-dot');
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + (now.getMinutes() / 60);
    const isOpen = (day >= 1 && day <= 5 && hour >= 8.5 && hour < 17.0);

    if (isOpen) {
        statusText.textContent = "Otwarte";
        statusText.style.color = "#4cbb17";
        if(statusDot) { statusDot.classList.add('open'); statusDot.style.backgroundColor = "#4cbb17"; }
    } else {
        statusText.textContent = "Zamknięte (Pn-Pt 08:30-17:00)";
        if(statusDot) statusDot.classList.add('closed');
    }
}