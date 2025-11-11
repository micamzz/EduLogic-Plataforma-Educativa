
export function iniciarPaginaPrincipal() {
    const sliderContainer = document.querySelector('.slider');
    
    // Solo inicializar si el contenedor del carrusel existe
    if (!sliderContainer) return; 
    
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn'); 
    const nextBtn = document.querySelector('.next-btn'); 
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoSlideInterval;
    const intervalTime = 4000;
    let resumeTimeout;
    const resumeDelay = 5000;
    const slideWidthPercentage = 100 / totalSlides; 

    function showSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;
        const offset = -currentSlide * slideWidthPercentage; 
        sliderContainer.style.transform = `translateX(${offset}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, intervalTime);
    }

    function handleUserInteraction(indexToMoveTo) {
        clearInterval(autoSlideInterval);
        clearTimeout(resumeTimeout); 
        showSlide(indexToMoveTo);
        resumeTimeout = setTimeout(() => {
            startAutoSlide();
        }, resumeDelay);
    }

    showSlide(0);
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-slide-index'));
            handleUserInteraction(index);
        });
    });

    prevBtn.addEventListener('click', () => {
        handleUserInteraction(currentSlide - 1)
    });

    nextBtn.addEventListener('click', () => {
        handleUserInteraction(currentSlide + 1);
    });
    
    startAutoSlide();
}