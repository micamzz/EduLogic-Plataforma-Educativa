document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario-pago");
    const popup = document.getElementById("popup");
    const cerrarPopup = document.querySelector(".cerrar-popup");

    function mostrarPopup() {
        popup.style.display = "flex";
    }

    function ocultarPopup() {
        popup.style.display = "none";
    }

    cerrarPopup.addEventListener("click", (e) => {
        e.preventDefault();
        ocultarPopup();
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const nombre = document.getElementById("nombre-titular").value.trim();
        const numeroTarjeta = document.getElementById("numero-tarjeta").value.trim();
        const vencimiento = document.getElementById("vencimiento").value.trim();
        const codigoSeguridad = document.getElementById("codigo-seguridad").value.trim();

        if (!email || !nombre || !numeroTarjeta || !vencimiento || !codigoSeguridad) {
            alert("Por favor completa todos los campos.");
            return;
        }

        if (numeroTarjeta.length < 13 || numeroTarjeta.length > 19 || isNaN(numeroTarjeta)) {
            alert("El número de tarjeta debe tener entre 13 y 19 dígitos numéricos.");
            return;
        }

        if (codigoSeguridad.length !== 3 || isNaN(codigoSeguridad)) {
            alert("El código de seguridad debe tener 3 dígitos numéricos.");
            return;
        }

        if (!/^(0[1-9]|1[0-2])[0-9]{2}$/.test(vencimiento)) {
            alert("La fecha de vencimiento debe tener formato MMAA y ser válida.");
            return;
        }

        mostrarPopup();

        form.reset();

        console.log("Pago realizado con éxito");
    });
});
