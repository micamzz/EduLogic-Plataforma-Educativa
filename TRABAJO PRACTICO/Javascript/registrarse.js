import { mostrarPopup } from './popupManager.js';
import { ValidadorFormulario } from "./validarFormulario.js";

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

          // VALIDAR NOMBRE
          if (!ValidadorFormulario.campoVacio(nombre)) {
              mostrarError(nombreInput, ValidadorFormulario.MENSAJES.nombreVacio2);
              formularioValido = false;
          } else if (!ValidadorFormulario.longitudMinima(nombre, 3)) {
              mostrarError(nombreInput, ValidadorFormulario.MENSAJES.nombreCorto);
              formularioValido = false;
          }

          // VALIDAR APELLIDO 
          if (!ValidadorFormulario.campoVacio(apellido)) {
              mostrarError(apellidoInput, "El apellido no puede estar vacío.");
              formularioValido = false;
          } else if (!ValidadorFormulario.longitudMinima(apellido, 3)) {
              mostrarError(apellidoInput, "El apellido debe tener al menos 3 letras.");
              formularioValido = false;
          }

          // VALIDAR DNI
          if (!ValidadorFormulario.campoVacio(dni)) {
              mostrarError(dniInput, "El DNI no puede estar vacío.");
              formularioValido = false;
          } else if (dni.length < 7 || dni.length > 9) {
              mostrarError(dniInput, "El DNI debe tener entre 7 y 9 números.");
              formularioValido = false;
          }

          // VALIDAR EMAIL
          if (!ValidadorFormulario.campoVacio(email)) {
              mostrarError(emailInput, "El email no puede estar vacío.");
              formularioValido = false;
          } else if (!ValidadorFormulario.emailValido(email)) {
              mostrarError(emailInput, ValidadorFormulario.MENSAJES.emailInvalido);
              formularioValido = false;
          }

          // VALIDAR CONTRA
          if (!ValidadorFormulario.campoVacio(password)) {
              mostrarError(contraseniaInput, "La contraseña no puede estar vacía.");
              formularioValido = false;
          } else if (!CONTRASEÑA_VERIF.test(password)) {
              mostrarError(contraseniaInput, "Debe tener al menos 6 caracteres, una mayúscula y un número.");
              formularioValido = false;
          }

          // VALIDAR CONFIRMACION DE CONTRASEÑA
          if (!ValidadorFormulario.campoVacio(confirmPassword)) {
              mostrarError(confirmarContraseniaInput, "La confirmación de contraseña no puede estar vacía.");
              formularioValido = false;
          } else if (password !== confirmPassword) {
            
              mostrarError(confirmarContraseniaInput, "Las contraseñas no coinciden.");
              formularioValido = false;
          }

          
          contenedorRequisitos.style.display = formularioValido ? "none" : "block";

          if (!formularioValido || contraseniaInput.value.trim() === "") {
              contenedorRequisitos.style.display = "none";
          }


          if (!formularioValido) return;

          //  VALIDAR CUENTAS EXISTENTES O DNI
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

          //  DATOS CREAR USUARIO
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


    function mostrarError(input, mensaje) {
        input.classList.add("input-error");
        const error = document.createElement("p");
        error.className = "error-mensaje";
        error.textContent = mensaje;
        input.insertAdjacentElement("afterend", error);
    }

    //al registrarse guarda en localstorage
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        registrarUsuario(form);
    });
}

export function iniciarRegistroNormal() {
    iniciarRegistro('./inicioSesion.html'); //redirige a inicioSesion despues de registrar
}
