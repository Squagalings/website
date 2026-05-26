const camera = document.getElementById('camera');
const planets = document.querySelectorAll('.planet');
const mainTitle = document.getElementById('main-title');
const stars = document.querySelector('.stars');
const autoScrollBtn = document.getElementById('auto-scroll-btn');

// --- 3D CAMERA VARIABLES ---
let rotateX = 0;
let rotateY = 0;
let isDragging = false;
let startX, startY;

// --- FLIGHT CONTROLS ---
const zoomSpeed = 2.5; // Keeps the deep-zoom speed you requested
let isAutoScrolling = false;
let autoScrollSpeed = 4; // REDUCED from 15 to 4 for a slow, cinematic cruise
let scrollAnimationId;

// --- SCATTER THE UNIVERSE IN 3D SPACE ---
planets.forEach((planet, index) => {
    const zPos = planet.getAttribute('data-z');
    let xPos = 0;
    let yPos = 0;

    // We keep the very first one dead center, but scatter the rest widely
    if (index !== 0) {
        xPos = (Math.random() * 2000) - 1000; // Scatters them far left and right
        yPos = (Math.random() * 1200) - 600;  // Scatters them far up and down
    }

    // Applies the physical 3D positioning
    planet.style.transform = `translate3d(${xPos}px, ${yPos}px, ${zPos}px)`;
});

// --- CENTRAL CAMERA CONTROLLER ---
function updateCamera() {
    const scrollY = window.scrollY;
    const travelDepth = scrollY * zoomSpeed;

    // Updates the camera based on your mouse drag (rotate) AND scroll (translateZ)
    if (camera) {
        camera.style.transform = `translateZ(${travelDepth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    // Shifts the background stars slightly to create parallax depth
    const bgShiftX = -rotateY * 5;
    const bgShiftY = rotateX * 5;

    if (stars) {
        stars.style.transform = `scale(${1 + scrollY * 0.0001})`;
        stars.style.backgroundPosition = `${bgShiftX}px ${bgShiftY}px`;
    }
}

// --- MOUSE DRAG LOGIC (Look Around) ---
window.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
});

window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('mouseleave', () => isDragging = false);

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Adjusts camera rotation based on mouse movement
    rotateY += deltaX * 0.1;
    rotateX -= deltaY * 0.1;

    startX = e.clientX;
    startY = e.clientY;

    updateCamera();
});

// --- SCROLL LOGIC (Fly Forward) ---
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const travelDepth = scrollY * zoomSpeed;

    if (mainTitle) {
        mainTitle.style.opacity = 1 - (scrollY / 600);
    }

    updateCamera();

    // Hides the planets once they fly behind your screen
    planets.forEach(planet => {
        const initialZ = parseInt(planet.getAttribute('data-z'));
        const currentZ = initialZ + travelDepth;

        if (currentZ > 800) {
            planet.style.opacity = 0;
        } else {
            planet.style.opacity = 1;
        }
    });
});

// --- AUTO-SCROLL LOGIC ---
function performAutoScroll() {
    if (isAutoScrolling) {
        // Scrolls down by the new, slower autoScrollSpeed
        window.scrollBy(0, autoScrollSpeed);

        const maxScroll = document.body.offsetHeight - window.innerHeight;
        if (window.scrollY >= maxScroll) {
            toggleAutoScroll();
        } else {
            scrollAnimationId = requestAnimationFrame(performAutoScroll);
        }
    }
}

function toggleAutoScroll() {
    isAutoScrolling = !isAutoScrolling;

    if (isAutoScrolling) {
        if (autoScrollBtn) {
            autoScrollBtn.textContent = 'Stop Auto-Pilot';
            autoScrollBtn.classList.add('active');
        }
        performAutoScroll();
    } else {
        if (autoScrollBtn) {
            autoScrollBtn.textContent = 'Start Auto-Pilot';
            autoScrollBtn.classList.remove('active');
        }
        cancelAnimationFrame(scrollAnimationId);
    }
}

if (autoScrollBtn) {
    autoScrollBtn.addEventListener('click', toggleAutoScroll);
}