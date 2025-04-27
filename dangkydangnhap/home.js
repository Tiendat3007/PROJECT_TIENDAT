
const slidesEl = document.querySelector('.slides');
const banners = document.querySelectorAll('.banner');
const dotsContainer = document.querySelector('.dots');
let current = 0;
const total = banners.length;
let autoSlide;

// Tạo dots
banners.forEach((_, idx) => {
    const dot = document.createElement('span'); dot.classList.add('dot');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll('.dot');

function updateDots(i) {
    dots.forEach(d => d.classList.remove('active'));
    dots[i].classList.add('active');
}

function goToSlide(i) {
    current = (i + total) % total;
    slidesEl.style.transform = `translateX(-${current * 100}%)`;
    updateDots(current);
}

function startAuto() {
    autoSlide = setInterval(() => goToSlide(current + 1), 2000);
}
function stopAuto() { clearInterval(autoSlide); }

// Khởi chạy
goToSlide(0);
startAuto();
document.querySelector('.slider-wrapper').addEventListener('mouseenter', stopAuto);
document.querySelector('.slider-wrapper').addEventListener('mouseleave', startAuto);
