
import { mostrarPopup } from './popupManager.js'; // Importar la nueva función




export function iniciarLogicaPerfil() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUser = localStorage.getItem('currentUser');

    
    if (!isLoggedIn) {
        if (window.location.href.includes('perfil.html')) {
            alert('Debes iniciar sesión para ver tu perfil.');
         
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


        //ACTUALIZACIÓN del perfil
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
                
                // Guardar Cambios (usando la función importada)
                mostrarPopup('Éxito', '¡Datos de perfil actualizados con éxito!', 'alert', () => {
                    window.location.reload();
                });
            });
        }
        

        // CERRAR SESIÓN (usando la función importada)
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                // POP-UP ESTÉTICO: Cerrar Sesión (Confirmación)
                mostrarPopup('Cerrar Sesión', '¿Estás seguro de que deseas cerrar tu sesión?', 'confirm', () => {
                    localStorage.removeItem('isLoggedIn');
                    
                    // POP-UP ESTÉTICO: Sesión Cerrada
                    mostrarPopup('Adiós', 'Sesión cerrada correctamente.', 'alert', () => {
                         window.location.href = '../index.html';
                    });
                });
            });
        }

        // ELIMINAR CUENTA (usando la función importada)
        const deleteAccountButton = document.getElementById('eliminar-cuenta-button');
        if (deleteAccountButton) {
            deleteAccountButton.addEventListener('click', () => {
                // POP-UP ESTÉTICO: Eliminar Cuenta (Confirmación)
                mostrarPopup(
                    'Eliminar Cuenta', 
                    'ADVERTENCIA: ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y se perderán todos tus datos locales.', 
                    'confirm', 
                    () => {
                        // Acción al confirmar
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('isLoggedIn');
                        
                        // POP-UP ESTÉTICO: Cuenta Eliminada
                        mostrarPopup('Cuenta Eliminada', 'Tu cuenta ha sido eliminada. Serás redirigido al inicio.', 'alert', () => {
                            window.location.href = '../index.html';
                        });
                    }
                );
            });
        }

        
    }
}