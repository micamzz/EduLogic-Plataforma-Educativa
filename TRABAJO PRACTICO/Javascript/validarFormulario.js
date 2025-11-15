export class ValidadorFormulario {

  //alamcena msg de error
  static MENSAJES = {
    nombreVacio: "El nombre y apellido no puede estar vacío.",
    nombreCorto: "El nombre debe tener al menos 3 letras.",
    emailInvalido: "El email es inválido.",
    telefonoInvalido: "El teléfono debe tener mínimo 8 números.",
    consultaLarga: "La consulta no puede superar los 1000 caracteres.",
    tarjetaVacia: "El número de tarjeta es obligatorio.",
    tarjetaInvalida: "Debe tener entre 13 y 19 dígitos numéricos.",
    vencimientoVacio: "La fecha de expiración es obligatoria.",
    vencimientoInvalido: "Formato incorrecto (MM/AA, ej: 12/31).",
    cvvVacio: "El código de seguridad es obligatorio.",
    cvvInvalido: "Debe tener 3 dígitos numéricos."
  };

  //expresiones para validaciones
  //metodo estatico para no instanciar la clase
  static expresionesRegulares = {
    email: /^[0-9a-zA-Z._.-]+@[0-9a-zA-Z._.-]+\.[0-9a-zA-Z]+$/,//valores permitidos en email
    telefono: /^\d{8,15}$|^\d{4}-\d{4,11}$/,
    tarjeta: /^\d{13,19}$/,                  // 13 a 19 dígitos
    vencimiento: /^(0[1-9]|1[0-2])[0-9]{2}$/, // MMYY
    cvv: /^\d{3}$/  // Entre 8 y 15 numeros con o sin guion
  };

  static campoVacio(valor) {//valida si el campo esta vacio
    return valor.trim() !== "";//true si no esta vacio,
  }

  static longitudMinima(valor, minimo) {//hace la validacion de longitud minima
    return valor.trim().length >= minimo;//true si cumple la longitud minima
  }

  static emailValido(email) {//valida el formato del email
    return ValidadorFormulario.expresionesRegulares.email.test(email.trim());//true si es valido
  }

  static telefonoValido(tel) {
    if (tel.trim() === "") return true; // SI EL TELEFONO ESTA VACIO NO SE HACE VALIDACION 
    return ValidadorFormulario.expresionesRegulares.telefono.test(tel.trim());
  }

  static longitudTextoValida(texto, maximo) {//valida longitud maxima
    return texto.trim().length <= maximo;
  }
 static numeroTarjetaValido(numeroTarjeta) {//valida numero tarjeta
    const limpio = numeroTarjeta.replace(/\s/g, ""); // saca espacios
    return ValidadorFormulario.expresionesRegulares.tarjeta.test(limpio);//devuelve true si es valido
  }

  static vencimientoValido(vencimiento) {//valida fecha vencimiento
    const soloNumeros = vencimiento.replace(/\D/g, ""); // saca barra y demás
    return ValidadorFormulario.expresionesRegulares.vencimiento.test(soloNumeros);
  }

  static cvvValido(cvv) {
    return ValidadorFormulario.expresionesRegulares.cvv.test(cvv.trim());
  }
}
