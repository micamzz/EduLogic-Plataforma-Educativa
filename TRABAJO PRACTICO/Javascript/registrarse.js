import { mostrarPopup } from './popupManager.js';
import { validadorFormulario } from "./validarFormulario.js";

const CONTRASEÑA_VERIF = /^(?=.*[A-Z])(?=.*\d).{6,}$/; 

//obtener todos los usuarios registrados o un array vacio si no hay
function obtenerUsuariosRegistrados() {
  const usuariosTexto = localStorage.getItem('registeredUsers');
  try {
    return usuariosTexto ? JSON.parse(usuariosTexto) : [];
  } catch (e) {
    return [];
  }
}

// guardar la lista completa de usuarios
function guardarUsuariosRegistrados(usuarios) {
  localStorage.setItem('registeredUsers', JSON.stringify(usuarios));
}

export function iniciarRegistro(redirectUrl) {
    const form = document.getElementById('registro-form');
    if (!form) {
        return;
    }

    const nombreInput = form.querySelector('input[name="nombre"]');
    const apellidoInput = form.querySelector('input[name="apellido"]');
    const dniInput = form.querySelector('input[name="dni"]');
    const emailInput = form.querySelector('input[name="email"]');
    const contraseniaInput = form.querySelector('input[name="password"]');
    const confirmarContraseniaInput = form.querySelector('input[name="confirm_password"]');
 
  

    // REQUISITOS DE LA CONTRASEÑA - PARA MOSTRARLOS
    let contenedorRequisitos = form.querySelector(".requisitos-password");
    if (!contenedorRequisitos) {
        contenedorRequisitos = document.createElement("div");
        contenedorRequisitos.classList.add("requisitos-password");
        contenedorRequisitos.innerHTML = `
      <span id="req-longitud" class="no-cumple"> Al menos 6 caracteres</span>
      <span id="req-mayuscula" class="no-cumple">Al menos una letra mayúscula</span>
      <span id="req-numero" class="no-cumple">Al menos un número</span>
    `;
        contraseniaInput.insertAdjacentElement("afterend", contenedorRequisitos);
    }
    contenedorRequisitos.style.display = "none";

    const actualizarRequisitos = () => {
        const valor = contraseniaInput.value;
        if (valor === "") {
            contenedorRequisitos.style.display = "none";
        } else {
            contenedorRequisitos.style.display = "block";
        }
        const tieneLongitud = valor.length >= 6;
        const tieneMayuscula = /[A-Z]/.test(valor);
        const tieneNumero = /\d/.test(valor);

        form.querySelector("#req-longitud").className = tieneLongitud ? "cumple" : "no-cumple";
        form.querySelector("#req-mayuscula").className = tieneMayuscula ? "cumple" : "no-cumple";
        form.querySelector("#req-numero").className = tieneNumero ? "cumple" : "no-cumple";
    };

    contraseniaInput.addEventListener("input", actualizarRequisitos);
    contraseniaInput.addEventListener("focus", actualizarRequisitos); // por si entra directo con tab

    form.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => {
            input.classList.remove("input-error");
            const siguiente = input.nextElementSibling;
            if (siguiente && siguiente.classList.contains("error-mensaje")) {
                siguiente.remove();
            }
        });
    });

    function mostrarError(input, mensaje) {
        input.classList.add("input-error");
        const error = document.createElement("p");
        error.className = "error-mensaje";
        error.textContent = mensaje;
        input.insertAdjacentElement("afterend", error);
    }

    // Funciones de validación separadas
    function validarNombre(nombre) {
        if (!validadorFormulario.campoVacio(nombre)) {
            mostrarError(nombreInput, validadorFormulario.MENSAJES.nombreVacio2);
            return false;
        }
        if (!validadorFormulario.longitudMinima(nombre, 3)) {
            mostrarError(nombreInput, validadorFormulario.MENSAJES.nombreCorto);
            return false;
        }
        return true;
    }

    function validarApellido(apellido) {
        if (!validadorFormulario.campoVacio(apellido)) {
            mostrarError(apellidoInput, "El apellido no puede estar vacío.");
            return false;
        }
        if (!validadorFormulario.longitudMinima(apellido, 3)) {
            mostrarError(apellidoInput, "El apellido debe tener al menos 3 letras.");
            return false;
        }
        return true;
    }

    function validarDNI(dni) {
        if (!validadorFormulario.campoVacio(dni)) {
            mostrarError(dniInput, "El DNI no puede estar vacío.");
            return false;
        }
        if (dni.length < 7 || dni.length > 9) {
            mostrarError(dniInput, "El DNI debe tener entre 7 y 9 números.");
            return false;
        }
        return true;
    }

    function validarEmail(email) {
 
    
    if (!validadorFormulario.campoVacio(email)) {
      
        mostrarError(emailInput, "El email no puede estar vacío.");
        return false;
    }
    if (!validadorFormulario.emailValido(email)) {
       
        mostrarError(emailInput, validadorFormulario.MENSAJES.emailInvalido);
        return false;
    }
    
    return true;
}

    function validarPassword(password) {
        if (!validadorFormulario.campoVacio(password)) {
            mostrarError(contraseniaInput, "La contraseña no puede estar vacía.");
            return false;
        }
        if (!CONTRASEÑA_VERIF.test(password)) {
            mostrarError(contraseniaInput, "Debe tener al menos 6 caracteres, una mayúscula y un número.");
            return false;
        }
        return true;
    }

    function validarConfirmacion(password, confirmPassword) {
        if (!validadorFormulario.campoVacio(confirmPassword)) {
            mostrarError(confirmarContraseniaInput, "La confirmación de contraseña no puede estar vacía.");
            return false;
        }
        if (password !== confirmPassword) {
            mostrarError(confirmarContraseniaInput, "Las contraseñas no coinciden.");
            return false;
        }
        return true;
    }

  function registrarUsuario(form) {
    form.querySelectorAll(".error-mensaje").forEach(el => el.remove());
    form.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const dni = dniInput.value.trim();
    const email = emailInput.value.trim();
    const password = contraseniaInput.value.trim();
    const confirmPassword = confirmarContraseniaInput.value.trim();

    let formularioValido = true;

    

    // Validar cada campo individualmente - FORMA CORRECTA
    const valNombre = validarNombre(nombre);
    const valApellido = validarApellido(apellido);
    const valDNI = validarDNI(dni);
    const valEmail = validarEmail(email);
    const valPassword = validarPassword(password);
    const valConfirmacion = validarConfirmacion(password, confirmPassword);

 

    // Verificar si TODOS son verdaderos
    formularioValido = valNombre && valApellido && valDNI && valEmail && valPassword && valConfirmacion;

    

    // Controlar visibilidad de requisitos
    if (!formularioValido || contraseniaInput.value.trim() === "") {
        contenedorRequisitos.style.display = "none";
    } else {
        contenedorRequisitos.style.display = "block";
    }

    // Solo si hay errores de validación, detenerse aquí
    if (!formularioValido) {
  
        return;
    }

    // VALIDAR CUENTAS EXISTENTES O DNI
    const usuarios = obtenerUsuariosRegistrados();
    const emailExiste = usuarios.some(user => user.email === email);
    const dniExiste = usuarios.some(user => user.dni === dni);

    if (emailExiste) {
        mostrarError(emailInput, "Ya existe una cuenta registrada con este email.");
        return;
    }

    if (dniExiste) {
        mostrarError(dniInput, "Ya existe una cuenta registrada con este DNI.");
        return;
    }

    // DATOS CREAR USUARIO
    const userData = {
        nombre, apellido, dni, email, password,
        telefono: '', direccion: '', localidad: '',
        provincia: '', codigo_postal: '', pais: '', cursosObtenidos: []
    };

    usuarios.push(userData);
    guardarUsuariosRegistrados(usuarios);
    localStorage.setItem('currentUser', JSON.stringify(userData));

    contenedorRequisitos.style.display = "none";

    mostrarPopup('Éxito', '¡Registro exitoso! Ahora puedes iniciar sesión.', 'alert', () => {
        window.location.href = './inicioSesion.html';
    });
}



// DEBUG del event listener
form.addEventListener('submit', function (e) {
 
    
    e.preventDefault();
    e.stopPropagation();
    
    
    registrarUsuario(form);
});


}

export function iniciarRegistroNormal() {
    iniciarRegistro('./inicioSesion.html'); //redirige a inicioSesion despues de registrar
}

