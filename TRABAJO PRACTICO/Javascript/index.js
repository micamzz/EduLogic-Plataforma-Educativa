
export function iniciarPaginaPrincipal() {
    const sliderContainer = document.querySelector('.slider'); //trae el contenedor de las diapos y es el elemento q se mueve en horizontal
    
    // Solo inicializar si el contenedor del carrusel existe
    if (!sliderContainer) return; 
    
    const dots = document.querySelectorAll('.dot');//puntos de posicion
    const prevBtn = document.querySelector('.prev-btn'); //boton anterior
    const nextBtn = document.querySelector('.next-btn'); //siguiente
    const slides = document.querySelectorAll('.slide');//img dentro del carrusel
    const totalSlides = slides.length;//cant de diapos
    let currentSlide = 0;//en que diapo empieza
    let autoSlideInterval; //almacena temporizador
    const intervalTime = 4000; //tiempo entre cada cambio automatico 4 seg
    let resumeTimeout; //temporizador para reanudar el auto deslizamiento despues de la interaccion del usuario
    const resumeDelay = 5000;
    const slideWidthPercentage = 100 / totalSlides; //calcula el ancho de cada diapo en porcentaje


    //muestra la diapo
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