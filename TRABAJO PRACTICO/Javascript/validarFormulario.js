export class validadorFormulario {

  static MENSAJES = {
    nombreVacio: "El nombre y apellido no puede estar vacío.",
    nombreVacio2: "El nombre no puede estar vacio",
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

  //expresiones regulares  para validaciones
  static expresionesRegulares = {
    email: /^[0-9a-zA-Z._.-]+@[0-9a-zA-Z._.-]+\.[0-9a-zA-Z]+$/, //valores permitidos en email
    telefono: /^\d{8,15}$|^\d{4}-\d{4,11}$/,
    tarjeta: /^\d{13,19}$/,                  // 13 a 19 dígitos
    vencimiento: /^(0[1-9]|1[0-2])[0-9]{2}$/, // MMYY
    cvv: /^\d{3}$/  // Entre 8 y 15 numeros con o sin guion
  };

  static campoVacio(valor) {
    return valor.trim() !== "";
  }

  static longitudMinima(valor, minimo) {
     return valor.trim().length >= minimo;
    }

  static emailValido(email) {
    return validadorFormulario.expresionesRegulares.email.test(email.trim());
  }

  static telefonoValido(tel) {
    if (tel.trim() === "") return true; 
    return validadorFormulario.expresionesRegulares.telefono.test(tel.trim());
  }

  static longitudTextoValida(texto, maximo) {
    return texto.trim().length <= maximo;
  }
 static numeroTarjetaValido(numeroTarjeta) {
    const limpio = numeroTarjeta.replace(/\s/g, "");
    return validadorFormulario.expresionesRegulares.tarjeta.test(limpio);
  }

  static vencimientoValido(vencimiento) {
    const soloNumeros = vencimiento.replace(/\D/g, ""); 
    return validadorFormulario.expresionesRegulares.vencimiento.test(soloNumeros);
  }

  static cvvValido(cvv) {
    return validadorFormulario.expresionesRegulares.cvv.test(cvv.trim());
  }
}
