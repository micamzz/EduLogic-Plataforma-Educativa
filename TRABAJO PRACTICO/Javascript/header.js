
// Lógica de la Barra de Búsqueda
export function manejarBusqueda() {
    const searchForm = document.getElementById('search-form');
    const cursoInput = document.getElementById('curso-input');
    const cursosDatalist = document.getElementById('cursos-list');

    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const inputValue = cursoInput.value;
            let targetUrl = '';
            const options = cursosDatalist.querySelectorAll('option');

            for (let i = 0; i < options.length; i++) {
                if (options[i].value === inputValue) {
                    targetUrl = options[i].getAttribute('data-url');
                    break;
                }
            }

            if (targetUrl) {
                window.location.href = targetUrl;
            } else {
                alert('Por favor, selecciona un curso de la lista o verifica el nombre.');
            }
        });
    }
}

// Lógica para visualizar u ocultar los enlaces del Header
export function manejarVisualizacionHeader() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const perfilLink = document.querySelector('.perfil-link');
    const loginButton = document.querySelector('.login-button');
    const signupButton = document.querySelector('.signup-button');

    if (isLoggedIn) {
        if (perfilLink) perfilLink.style.display = 'block';
        if (loginButton) loginButton.style.display = 'none';
        if (signupButton) signupButton.style.display = 'none';
    } else {
        if (perfilLink) perfilLink.style.display = 'none';
        if (loginButton) loginButton.style.display = 'flex'; // Usar 'flex' para mantener estilo
        if (signupButton) signupButton.style.display = 'block';
    }
}
