# EduLogic Plataforma de Cursos Online — Trabajo Práctico Final

Este repositorio contiene el desarrollo integral del Trabajo Práctico Final para la materia Programación Web I.
El objetivo fue simular una plataforma de e-learning (similar a Udemy o Coursera), comenzando por el maquetado estático (HTML/CSS) y avanzando hacia la incorporación de lógica de negocio, manejo de estado, validaciones y persistencia mediante JavaScript Vanilla.

###  [Ir al sitio](https://edulogic-plataformaeducativa.netlify.app)

---
## Evolución del Proyecto
### Primera Parte – Maquetado & Estilos (HTML / CSS)
Se trabajó en la construcción visual y estructural de toda la plataforma:
* **Home:** Grilla principal, banners y cards de cursos.
* **Detalle de Curso:** Ficha completa del curso.
* **Calendario:** Vista mensual con fechas destacadas.
* **Gift Card:** Editor visual de tarjetas.
* **Inscripción:** Formularios base (persona/empresa).
* **Contacto:** Layout del formulario y estructura general.

**La primera entrega incluyó:**
* HTML semántico.
* Diseño responsivo (Flexbox + Grid).
* Sistema de colores unificado.
* Componentes reutilizables (header/footer).
* Primeras animaciones y microinteracciones.

### Segunda Parte – Funcionalidad con JavaScript (Vanilla)
En esta etapa se integró toda la lógica dinámica del sitio, manipulación del DOM y almacenamiento local.

#### Gestión de Autenticación y Usuarios
* **Login y Registro:** Con persistencia mediante `localStorage`.
* **Validaciones:** Email, contraseña, campos obligatorios.
* **Sesión:** Simulación de “sesión activa” para habilitar ciertas funciones.

#### Carrito de Compras
* Solo accesible para usuarios logueados.
* **Contador global:** En el header implementado con `SessionStorage`.
* **Sidebar dinámico:**
    * Listado de cursos seleccionados.
    * Actualización de cantidad.
    * Eliminación de items.

#### Lógica por Página
* **Home:** Carrusel automático + controles manuales. Cards enlazadas a detalle.
* **Detalle del Curso:**
    * Acordeón/Accordion para el temario.
    * Modal personalizado para confirmar inscripción.
    * Botón "Agregar al Carrito" conectado al sistema central.
* **Calendario Interactivo:**
    * Render dinámico de la grilla mensual.
    * Popup al hacer click mostrando: nombre, fecha, botón comprar y link al detalle.
* **GiftCard**
    * Editor visual donde los cambios impactan en tiempo real (Fondo, Texto, Color, Tamaño).
* **Inscripción:**
    * **Persona:** Inscripción simple.
    * **Empresa:** Selección de socios, generación dinámica de inputs y cálculo de total en vivo.
* **Contacto:**
    * Validación de Email (Regex) y teléfono (8 dígitos).
    * Contador en tiempo real para textarea (máx. 1000 caracteres).
    * 
#### Validaciones y Seguridad (JS)
* Todos los formularios incluyen validaciones propias.
* Mensajes de error claros y visibles.
* Checks de sesión antes de permitir acciones de compra.
---


## 🛠 Tecnologías Utilizadas
<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=html,css,js,git,github,vscode" />
  </a>
</p>


---

## 👩‍💻 Colaboradores

* **MARTELLI GUIMIL, Rocio Belén**
* **MAZZA, Micaela Montserrat**
* **MOYANO VIVAS, Matías Ernesto**
