const canvas = document.getElementById('scroll-canvas');
        const context = canvas.getContext('2d');

        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        const frameCount = 240;
        const currentFrame = index => (
            `imgs/frame_${index.toString().padStart(6, '0')}.webp`
        );

        // Preloader progress tracking
        const preloader = document.getElementById('preloader');
        const preloaderFill = document.getElementById('preloaderFill');
        const preloaderPercent = document.getElementById('preloaderPercent');
        const totalAssets = frameCount + 51;
        let loadedAssets = 0;

        function assetLoaded() {
            loadedAssets++;
            const pct = Math.min(100, Math.floor((loadedAssets / totalAssets) * 100));
            preloaderFill.style.width = pct + '%';
            preloaderPercent.textContent = pct + '%';
            if (loadedAssets >= totalAssets) {
                finishPreload();
            }
        }

        function finishPreload() {
            document.body.classList.remove('loading');
            preloader.classList.add('loaded');
            renderFirstFrame();
            updateImage(0);
            updateForeground();
        }

        // Preload images to ensure smooth playback
        const images = [];
        
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.onload = assetLoaded;
            img.onerror = assetLoaded;
            img.src = currentFrame(i);
            images.push(img);
        }

        function renderFirstFrame() {
            canvas.width = images[0].width;
            canvas.height = images[0].height;
            context.drawImage(images[0], 0, 0);
        }

        // Update image based on scroll position
        window.addEventListener('scroll', () => {  
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScrollTop <= 0) return;
            const scrollFraction = scrollTop / maxScrollTop;
            
            const frameIndex = Math.floor(scrollFraction * frameCount) % frameCount;
            
            requestAnimationFrame(() => updateImage(frameIndex));
        });

        function updateImage(index) {
            if (images[index] && images[index].complete) {
                // Ensure canvas size matches image size in case the first image was slow to load
                if (canvas.width !== images[index].width) {
                    canvas.width = images[index].width;
                    canvas.height = images[index].height;
                }
                context.drawImage(images[index], 0, 0);
            }
        }

        // Handle resize events to re-render the current frame
        window.addEventListener('resize', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
            const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
            const frameIndex = Math.floor(scrollFraction * frameCount) % frameCount;
            updateImage(frameIndex);
        });

        // Foreground nobg scroll animation over hero Arabic text
        const fgCanvas = document.getElementById('foreground-canvas');
        const fgContext = fgCanvas.getContext('2d');
        const fgFrameCount = 51;
        const fgCurrentFrame = index => `nobg/frame_${index.toString().padStart(6, '0')}_no_bg.webp`;

        const fgImages = [];

        for (let i = 0; i < fgFrameCount; i++) {
            const img = new Image();
            img.onload = assetLoaded;
            img.onerror = assetLoaded;
            img.src = fgCurrentFrame(i);
            fgImages.push(img);
        }

        function updateForeground() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
            const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;

            const frameIndex = Math.min(
                frameCount - 1,
                Math.max(0, Math.floor(scrollFraction * frameCount))
            );

            const heroSection = document.querySelector('.hero-section');
            const heroRect = heroSection.getBoundingClientRect();
            const isHeroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

            if (isHeroVisible && frameIndex < fgFrameCount && fgImages[frameIndex] && fgImages[frameIndex].complete) {
                if (fgCanvas.width !== fgImages[frameIndex].width) {
                    fgCanvas.width = fgImages[frameIndex].width;
                    fgCanvas.height = fgImages[frameIndex].height;
                }
                fgContext.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
                fgContext.drawImage(fgImages[frameIndex], 0, 0);
            } else {
                fgContext.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
            }
        }

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateForeground);
        });

        window.addEventListener('resize', () => {
            updateForeground();
        });

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

const navLinks = document.querySelectorAll('.nav-pill a, .mobile-menu a');
const navSections = ['about', 'contact', 'posts']
    .map(id => document.getElementById(id))
    .filter(Boolean);

function setActiveNav(id) {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
}

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
        }
    });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

navSections.forEach(sec => navObserver.observe(sec));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

const cards = document.querySelectorAll('.tube-card.fade-in');
document.querySelectorAll('.fade-in').forEach(el => {
    if (el.classList.contains('tube-card')) {
        const i = Array.prototype.indexOf.call(cards, el);
        el.style.transitionDelay = (i * 0.12) + 's';
    }
    observer.observe(el);
});