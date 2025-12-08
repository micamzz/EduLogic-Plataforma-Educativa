
export const LISTA_CURSOS = [
  // PRIMER CURSO- BACK-END
  {
    id : "curso1",
    titulo: "Programación Back-End",
    duracion: "44 hs.",
    dedicacion: "2 hs diarias.",
    requisitos: "Conocimientos en Base de Datos y API's",
    precio: 250000 ,
    rating: 4,
    descripcion:
      "Curso avanzado de Back-End orientado a desarrolladores con conocimientos previos en programación y bases de datos. A lo largo de la formación profundizarás en arquitectura de software, seguridad, optimización de consultas, integración de APIs, servicios en la nube y despliegue de aplicaciones escalables. El objetivo es que adquieras la capacidad de diseñar y mantener sistemas robustos, eficientes y preparados para entornos de alta demanda profesional.",
    docente: {
      nombre: "Javier Rodrigo Dominguez",
      profesion: "Ingeniero en Sistemas y Analista de Datos",
      descripcion:
        "Soy Ingeniero en Sistemas y Analista de Datos, y en este curso de Back-End te voy a enseñar a construir la lógica que da vida a las aplicaciones web. Vamos a trabajar con bases de datos, servidores y APIs, para que aprendas a gestionar la información de forma segura y eficiente. Mi objetivo es que desarrolles una base sólida en programación del lado del servidor y adquieras las competencias necesarias para integrarte en proyectos profesionales de desarrollo de software.",
      imagen: "../img/cursos/istockphoto-2160473960-612x612.jpg"
    },
    imagen: "../img/cursos/backend.jpg",
    modulos: [
      {
        nombre: "MÓDULO 1 - Fundamentos Avanzados",
        clases: [
          "Clase 1: Arquitecturas y patrones de diseño (120 min)",
          "Clase 2: Dependencias y principios SOLID (120 min)",
          "Clase 3: Testing en backend (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 2 - Bases de Datos Avanzadas",
        clases: [
          "Clase 4: SQL avanzado (120 min)",
          "Clase 5: Optimización de consultas (120 min)",
          "Clase 6: NoSQL (MongoDB, Redis) (120 min)",
          "Clase 7: ORM avanzado y migraciones (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 3 - APIs y Servicios",
        clases: [
          "Clase 8: REST avanzado y documentación (120 min)",
          "Clase 9: Autenticación y autorización (120 min)",
          "Clase 10: GraphQL (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 4 - Escalabilidad y Rendimiento",
        clases: [
          "Clase 11: Caching y rate limiting (120 min)",
          "Clase 12: Balanceadores y microservicios (120 min)",
          "Clase 13: Colas y mensajería (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 5 - Seguridad y Buenas Prácticas",
        clases: [
          "Clase 14: OWASP Top 10 y protección de apps (120 min)",
          "Clase 15: Cifrado y manejo de secretos (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 6 - DevOps y Deploy",
        clases: [
          "Clase 16: CI/CD pipelines (120 min)",
          "Clase 17: Docker y Kubernetes (120 min)",
          "Clase 18: Deploy en la nube y monitoreo (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 7 - Proyecto Final",
        clases: [
          "Clase 19-20: Diseño del proyecto (240 min)",
          "Clase 21-22: Implementación y deploy (240 min)"
        ]
      }
    ]
  },

  // PROGRAMACIÓN FRONT-END
  {
     id : "curso2",
    titulo: "Programación Front-End",
    duracion: "44 hs.",
    dedicacion: "2 hs diarias.",
    requisitos: "Conocimientos introductorios de HTML y CSS (deseable).",
    precio: 120000,
    rating: 4,
    descripcion:
      "Este curso introduce a los estudiantes en el desarrollo de interfaces web interactivas y atractivas, enfocadas en la experiencia del usuario. Se aprenderá a estructurar páginas con HTML, darles estilo con CSS y dotarlas de dinamismo mediante JavaScript.",
    docente: {
      nombre: "Ana Garcia Milano",
      profesion: "Ingeniero de Software",
      descripcion:
        "Hola, soy Ana García, profesora de Frontend. Me dedico a enseñar a mis estudiantes a crear interfaces web modernas y funcionales, combinando HTML, CSS y JavaScript con buenas prácticas de diseño. Mis clases son prácticas y orientadas a proyectos reales para que cada alumno pueda desarrollar sus propias aplicaciones.",
      imagen: "../img/cursos/frontprof.jpg"
    },
    imagen: "../img/cursos/frontend.jpg",
    modulos: [
      {
        nombre: "MÓDULO 1 - Curso desarrollo web",
        clases: [
          "Clase 1: HTML (120 min)",
          "Clase 2: CSS (120 min)",
          "Clase 3: Box model y flexbox (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 2 - Introducción a Git y GitHub",
        clases: [
          "Clase 4: Grids (120 min)",
          "Clase 5: Animaciones (120 min)",
          "Clase 6: SEO y Servidores (120 min)",
          "Clase 7: KYC (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 3 - Curso JavaScript",
        clases: [
          "Clase 8: Introducción a JavaScript (120 min)",
          "Clase 9: Control de ciclos (120 min)",
          "Clase 10: Funciones (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 4 - Curso JavaScript parte II",
        clases: [
          "Clase 11: Arrays (120 min)",
          "Clase 12: Objetos (120 min)",
          "Clase 13: Promesas y librerías (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 5 - Curso de React JS",
        clases: [
          "Clase 14: Introducción a React (120 min)",
          "Clase 15: Configuración del entorno (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 6 - JSX, transpiling y componentes",
        clases: [
          "Clase 16: Componentes II (120 min)",
          "Clase 17: Promises, asincronía y MAP (120 min)",
          "Clase 18: API's (120 min)"
        ]
      },
      {
        nombre: "MÓDULO 7 - Proyecto Final",
        clases: [
          "Clase 19-20: Diseño del proyecto (240 min)",
          "Clase 21-22: Implementación y deploy (240 min)"
        ]
      }
    ]
  },

  // CIBERSEGURIDAD
  {
     id : "curso3",
    titulo: "Ciberseguridad",
    duracion: "49 hs.",
    dedicacion: "2 hs diarias.",
    requisitos: "Manejo básico de sistemas operativos.",
    precio: 400000,
    rating: 4,
    descripcion:
      "Este curso brinda los fundamentos esenciales para proteger información y sistemas frente a amenazas digitales. Aprenderás a identificar vulnerabilidades, aplicar buenas prácticas de seguridad y comprender los principales riesgos en redes, aplicaciones y dispositivos. Con un enfoque práctico, se abordan técnicas de prevención, detección y respuesta a incidentes, preparando a los participantes para desenvolverse con mayor seguridad en el entorno tecnológico actual.",
    docente: {
      nombre: "Adolfo Cinati",
      profesion: "Profesor de Ciberseguridad",
      descripcion:
        "Soy Adolfo profesor de ciberseguridad. Me apasiona enseñar a proteger la información y los sistemas frente a amenazas digitales, desde el manejo seguro de contraseñas hasta la prevención de ataques más complejos. Mi objetivo es que cada persona que participe en mis clases adquiera conocimientos prácticos para navegar y trabajar en el mundo digital de manera segura y confiable.",
      imagen: "../img/cursos/ciberseguridadprof.jpg"
    },
    imagen: "../img/cursos/ciberseguridad.jpg",
    modulos: [
      {
        nombre: "MÓDULO 1 - Introducción al ciberdelito y ciberamenazas",
        clases: [
          "Clase 1: Panorama del ciberdelito...",
          "Clase 2: Tipos de ciberamenazas...",
          "Clase 3: Impacto económico..."
        ]
      },
      {
        nombre: "MÓDULO 2 - Vulnerabilidades y amenazas",
        clases: [
          "Clase 4: Concepto de vulnerabilidad...",
          "Clase 5: Principales amenazas...",
          "Clase 6: Amenazas en redes...",
          "Clase 7: Modelos de gestión..."
        ]
      },
      {
        nombre: "MÓDULO 3 - Hacking ético",
        clases: [
          "Clase 8: Qué es el hacking ético...",
          "Clase 9: Fases de un test...",
          "Clase 10: Herramientas comunes..."
        ]
      },
      {
        nombre: "MÓDULO 4 -  Ciberseguridad, criptografía y cifrado",
        clases: [
          "Clase 11: Fundamentos de ciberseguridad...",
          "Clase 12: Criptografía...",
          "Clase 13: Protocolos de cifrado..."
        ]
      },
      {
        nombre: "MÓDULO 5 - Tecnología de protección a usuarios",
        clases: [
          "Clase 14: Seguridad en dispositivos...",
          "Clase 15: Seguridad en la nube..."
        ]
      },
      {
        nombre: "MÓDULO 6 - Tecnologías de protección de perímetro",
        clases: [
          "Clase 16: Firewalls, IDS/IPS...",
          "Clase 17: Seguridad en entornos corporativos...",
          "Clase 18: Deploy en la nube..."
        ]
      },
      {
        nombre: "MÓDULO 7 - Proyecto Final",
        clases: [
          "Clase 19-20: Diseño del proyecto (300 min)",
          "Clase 21-22: Implementación y deploy (300 min)"
        ]
      }
    ]
  },

  // FINANZAS PERSONALES
  {
     id : "curso4",
    titulo: "Finanzas Personales",
    duracion: "30 hs.",
    dedicacion: "2 hs diarias.",
    requisitos:
      "Interés en organizar mejor sus ingresos, gastos y hábitos financieros.",
    precio: 75000,
    rating: 4,
    descripcion:
      "Este curso está diseñado para ayudarte a tomar el control de tu dinero y desarrollar hábitos financieros saludables. A lo largo de la capacitación aprenderás a organizar tus ingresos y gastos, planificar un presupuesto realista, comprender el uso responsable del crédito y sentar bases sólidas para el ahorro y la inversión. Con un enfoque práctico y ejemplos cotidianos, te brindaremos herramientas que podrás aplicar de inmediato para alcanzar mayor estabilidad y seguridad económica.",
    docente: {
      nombre: "Claudia Clerici",
      profesion: "Profesora de finanzas personales",
      descripcion:
        "Hola, soy Claudia, profesora de finanzas personales. Me apasiona enseñar a las personas a manejar su dinero de manera inteligente, desde ahorrar y presupuestar hasta invertir y planificar para el futuro. Mi objetivo es que cada persona que pase por mis clases adquiera herramientas prácticas para tomar decisiones financieras seguras y alcanzar sus metas económicas con confianza.la, soy Claudia, profesora de finanzas personales...",
      imagen: "../img/cursos/profefinanzas.jpg"
    },
    imagen: "../img/cursos/finanzasperso.jpg",
    modulos: [
      {
        nombre: "MÓDULO 1 - Introducción de finanzas personales",
        clases: [
          "Clase 1: Introducción a las Finanzas Personales (90 min)",
          "Clase 2: La importancia de la educación financiera...",
          "Clase 3: Cómo analizar tus ingresos y gastos"
        ]
      },
      {
        nombre: "MÓDULO 2 - Creación y gestión de presupuesto",
        clases: [
          "Clase 4: Presupuesto personal...",
          "Clase 5: Deudas...",
          "Clase 6: Uso inteligente de tarjetas...",
          "Clase 7: Fondo de emergencia..."
        ]
      },
      {
        nombre: "MÓDULO 3 - Fundamentos del ahorro",
        clases: [
          "Clase 8: El ahorro...",
          "Clase 9: Objetivos financieros...",
          "Clase 10: Inversiones básicas..."
        ]
      },
      {
        nombre: "MÓDULO 4 - Introducción a la inversión",
        clases: [
          "Clase 11: Inflación y su impacto...",
          "Clase 12: Seguros...",
          "Clase 13: Jubilación..."
        ]
      },
      {
        nombre: "MÓDULO 5 - El crédito",
        clases: [
          "Clase 14: Psicología del dinero...",
          "Clase 15: Educación financiera..."
        ]
      },
      {
        nombre: "MÓDULO 6 - Gestión de deudas",
        clases: [
          "Clase 16: Introducción...",
          "Clase 17: Herramientas digitales...",
          "Clase 18: Plan financiero personal..."
        ]
      },
      {
        nombre: "MÓDULO 7 - Proyecto Final",
        clases: [
          "Clase 19-20: Diseño del proyecto (90 min)",
          "Clase 21-22: Implementación y deploy (90 min)"
        ]
      }
    ]
  },

  // INGLÉS AVANZADO
  {
     id : "curso5",
    titulo: "Inglés Avanzado",
    duracion: "44 hs.",
    dedicacion: "2 hs diarias.",
    requisitos: "Conocimiento previo de gramática y vocabulario general.",
    precio: 120000,
    rating: 4,
    descripcion:
      "Este curso está orientado a desarrollar las habilidades clave del idioma inglés: comprensión oral, lectura, escritura y expresión verbal. A través de actividades prácticas, ejercicios comunicativos y situaciones de la vida real, adquirirás confianza para desenvolverte tanto en contextos académicos como profesionales. El objetivo es que avances de manera progresiva, mejorando tu fluidez y ampliando tu vocabulario para lograr una comunicación clara y efectiva.",
    docente: {
      nombre: "Laura Gonzales",
      profesion: "Profesora de inglés y traductora",
      descripcion:
        "Soy profesora y traductora de inglés. Me apasiona enseñar idiomas y ayudar a mis estudiantes a mejorar su nivel de inglés mediante métodos prácticos y personalizados. También trabajo como traductora profesional, facilitando la comunicación entre distintas culturas.",
      imagen: "../img/cursos/profeingles.jpg"
    },
    imagen: "../img/cursos/ingles.jpg",
    modulos: [
      {
        nombre: "MÓDULO 1 - Expresiones y fluidez avanzada",
        clases: [
          "Clase 1: Idioms y expresiones...",
          "Clase 2: Phrasal verbs...",
          "Clase 3: Discourse markers..."
        ]
      },
      {
        nombre: "MÓDULO 2 - Gramática compleja en uso real",
        clases: [
          "Clase 4: Inversion for emphasis...",
          "Clase 5: Mixed conditionals...",
          "Clase 6: Nominalization...",
          "Clase 7: Reducción de cláusulas..."
        ]
      },
      {
        nombre: "MÓDULO 3 - Writing académico y profesional",
        clases: [
          "Clase 8: Essay writing...",
          "Clase 9: Formal reports...",
          "Clase 10: Emailing profesional..."
        ]
      },
      {
        nombre: "MÓDULO 4 - Listening y comprensión",
        clases: [
          "Clase 11: Acento británico...",
          "Clase 12: Acentos globales...",
          "Clase 13: Listening de medios..."
        ]
      },
      {
        nombre: "MÓDULO 5 - Speaking avanzado",
        clases: [
          "Clase 14: Debates y argumentación...",
          "Clase 15: Presentaciones profesionales..."
        ]
      },
      {
        nombre: "MÓDULO 6 - Cultura, matices y preparación final",
        clases: [
          "Clase 16: Cross-cultural communication...",
          "Clase 17: C1-C2 practice...",
          "Clase 18: Matices y registro lingüístico..."
        ]
      },
      {
        nombre: "MÓDULO 7 - Proyecto Final",
        clases: [
          "Clase 19-20: Diseño del proyecto (240 min)",
          "Clase 21-22: Implementación y deploy (240 min)"
        ]
      }
    ]
  },

  // MARKETING DIGITAL
  {
     id : "curso6",
    titulo: "Marketing Digital",
    duracion: "38 hs.",
    dedicacion: "2 hs diarias.",
    requisitos: "Manejo básico de redes sociales e internet.",
    precio: 90000,
    rating: 4,
    descripcion:
      "Este curso ofrece una introducción integral a las estrategias y herramientas del marketing en entornos digitales, con el objetivo de crear campañas efectivas y medibles que potencien la visibilidad de marcas, productos o servicios.",
    docente: {
      nombre: "Mariano Cabrera",
      profesion: "Profesor de Marketing Digital",
      descripcion:
        "Soy Mariano, profesor de Marketing Digital. Disfruto enseñar estrategias digitales efectivas y ayudar a mis estudiantes a desarrollar habilidades prácticas para el mundo online. Combino teoría con ejercicios reales para que cada clase sea aplicada y dinámica.",
      imagen: "../img/cursos/profemark.jpg"
    },
    imagen: "../img/cursos/marketing.jpg",
    modulos: [
      {
        nombre: "MÓDULO 1 - Plan de marketing",
        clases: [
          "Clase 1: Introducción al Marketing...",
          "Clase 2: El rol del CM...",
          "Clase 3: Testing en backend..."
        ]
      },
      {
        nombre: "MÓDULO 2 - Estrategia de contenido",
        clases: [
          "Clase 4: Estrategias en Facebook...",
          "Clase 5: Estrategias en Instagram...",
          "Clase 6: Estrategias en TikTok & Threads..."
        ]
      },
      {
        nombre: "MÓDULO 3 - Estrategia de contenido II",
        clases: [
          "Clase 8: Estrategias en Twitter...",
          "Clase 9: Estrategias en WhatsApp...",
          "Clase 10: Estrategias en LinkedIn..."
        ]
      },
      {
        nombre: "MÓDULO 4 - Creación y gestión de anuncios en redes sociales",
        clases: [
          "Clase 11: Cómo atrapar al cliente...",
          "Clase 12: Estrategias de venta..."
        ]
      },
      {
        nombre: "MÓDULO 5 - Video marketing y Google Ads",
        clases: [
          "Clase 14: Introducción...",
          "Clase 15: Manejo de Google Ads..."
        ]
      },
      {
        nombre: "MÓDULO 6 - Estrategias de e-mail marketing",
        clases: [
          "Clase 16: Introducción...",
          "Clase 17: Google Analytics..."
        ]
      },
      {
        nombre: "MÓDULO 7 - Proyecto Final",
        clases: [
          "Clase 19-20: Diseño del proyecto (240 min)",
          "Clase 21-22: Implementación y deploy (240 min)"
        ]
      }
    ]
  }
];
