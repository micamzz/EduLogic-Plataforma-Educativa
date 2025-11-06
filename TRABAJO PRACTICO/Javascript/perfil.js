// Archivo: Javascript/perfil.js

// Eliminamos la importación de header.js ya que las funciones se llaman en JavaScript.js

export function iniciarLogicaPerfil() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUser = localStorage.getItem('currentUser');

    // Redirige al login si no está logueado
    if (!isLoggedIn) {
        if (window.location.href.includes('perfil.html')) {
            alert('Debes iniciar sesión para ver tu perfil.');
            // Aseguramos la ruta de redirección correcta
            window.location.href = '../paginas/inicioSesion.html'; 
            return;
        }
    }


    if (isLoggedIn && storedUser) {
        const user = JSON.parse(storedUser);

        // Rellenar campos del perfil con los datos guardados
        document.getElementById('perfil-nombre').value = user.nombre || '';
        document.getElementById('perfil-apellido').value = user.apellido || '';
        document.getElementById('perfil-dni').value = user.dni || '';
        document.getElementById('perfil-email').value = user.email || '';
        document.getElementById('perfil-telefono').value = user.telefono || '';
        document.getElementById('perfil-direccion').value = user.direccion || '';
        document.getElementById('perfil-localidad').value = user.localidad || '';
        document.getElementById('perfil-provincia').value = user.provincia || '';
        document.getElementById('perfil-postal').value = user.codigo_postal || '';
        document.getElementById('perfil-pais').value = user.pais || '';

        // Mostrar nombre en el encabezado
        const nombreUsuario = document.getElementById('nombre-usuario');
        if (nombreUsuario) nombreUsuario.textContent = (user.nombre + ' ' + user.apellido).trim() || 'Mi Perfil';


        // Manejar la ACTUALIZACIÓN del perfil
        const formPerfil = document.getElementById('perfil-form');
        if (formPerfil) {
            formPerfil.addEventListener('submit', function(e) {
                e.preventDefault();

                user.nombre = document.getElementById('perfil-nombre').value;
                user.apellido = document.getElementById('perfil-apellido').value;
                user.email = document.getElementById('perfil-email').value;
                user.telefono = document.getElementById('perfil-telefono').value;
                user.direccion = document.getElementById('perfil-direccion').value;
                user.localidad = document.getElementById('perfil-localidad').value;
                user.provincia = document.getElementById('perfil-provincia').value;
                user.codigo_postal = document.getElementById('perfil-postal').value;
                user.pais = document.getElementById('perfil-pais').value;

                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('¡Datos de perfil actualizados con éxito!');
                window.location.reload();
            });
        }

        // Manejar el CERRAR SESIÓN
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                alert('Sesión cerrada correctamente.');
                window.location.href = '../index.html';
            });
        }
    }
}
