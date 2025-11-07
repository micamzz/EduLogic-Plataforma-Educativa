export class ValidadorFormulario {

  static MENSAJES = {
    nombreVacio: "El nombre y apellido no puede estar vacío.",
    nombreCorto: "El nombre debe tener al menos 3 letras.",
    emailInvalido: "El email es inválido.",
    telefonoInvalido: "El teléfono debe tener mínimo 8 números.",
    consultaLarga: "La consulta no puede superar los 1000 caracteres."
  };

  static expresionesRegulares = {
    email: /^[0-9a-zA-Z._.-]+@[0-9a-zA-Z._.-]+\.[0-9a-zA-Z]+$/,
    telefono: /^\d{8,15}$/ 
  };

  static campoVacio(valor) {
    return valor.trim() !== "";
  }

  static longitudMinima(valor, minimo) {
    return valor.trim().length >= minimo;
  }

  static emailValido(email) {
    return ValidadorFormulario.expresionesRegulares.email.test(email.trim());
  }

  static telefonoValido(tel) {
    if (tel.trim() === "") return true; // teléfono opcional
    return ValidadorFormulario.expresionesRegulares.telefono.test(tel.trim());
  }

  static longitudTextoValida(texto, maximo) {
    return texto.trim().length <= maximo;
  }
}
