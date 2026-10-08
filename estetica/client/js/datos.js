// Datos del negocio (para cambiar el WhatsApp, editar solo acá)
var DATOS_NEGOCIO = {
  whatsappNumero: "5492617772649",
  whatsappTexto: "+54 261 777 2649",
  whatsappMensaje: "Hola! Quiero consultar por un turno en Vos Estética Integral.",
  instagramUrl: "https://www.instagram.com/vos.esteticamza/",
  instagramUsuario: "@vos.esteticamza",
  direccion: "San Lorenzo 241, Mendoza, CP 5500, Argentina",
  horarios: "De 9:00 a 21:00 h",
  horaApertura: 9, // primer horario que se puede elegir en el carrito
  horaCierre: 21, // el último turno se ofrece una hora antes
  seniaPorcentaje: 25 // porcentaje de seña sobre el costo del servicio
};

var COLUMNAS_BASE = ["Servicio", "Duración", "Precio"];
var COLUMNAS_KANEKALON = ["Servicio", "Duración", "Sin kanekalon", "Con kanekalon"];

// Servicios: cada categoría tiene su imagen de portada y sus grupos (subcategorías) con tabla de precios
var SERVICIOS = [
  {
    id: "unas", nombre: "Uñas", descripcion: "Esmaltado, capping, soft gel, esculpidas y spa de pies.", imagen: "img/cat-unas.jpg",
    grupos: [{
      id: "unas-servicios", titulo: "", columnas: COLUMNAS_BASE,
      filas: [
        ["Esmaltado semipermanente", "30 min", "$25.000"],
        ["Capping", "1 h 30 min", "$35.000"],
        ["Esculpidas*", "2 h 30 min", "Desde $40.000"],
        ["Soft Gel", "1 h 30 min", "$38.000"],
        ["Pies Express", "45 min", "$28.000"],
        ["Spa de pies", "1 h", "$38.000"],
        ["Retirado ajeno (semi, capping o soft gel)", "—", "$15.000"]
      ],
      nota: "* Esculpidas: el precio depende del largo."
    }]
  },
  {
    id: "masajes", nombre: "Masajes", descripcion: "Reductores, relajantes y maderoterapia.", imagen: "img/cat-masajes.jpg",
    grupos: [
      {
        id: "masajes-reductores", titulo: "Reductores", columnas: COLUMNAS_BASE,
        filas: [
          ["Abdomen", "30 min", "$35.000"],
          ["Abdomen + flancos", "35 min", "$38.000"],
          ["Brazos", "20 min", "$25.000"],
          ["Glúteos", "40 min", "$32.000"],
          ["Media pierna", "30 min", "$35.000"],
          ["Piernas completas", "40 min", "$60.000"],
          ["Zona corpino", "30 min", "$35.000"]
        ]
      },
      {
        id: "masajes-relajantes", titulo: "Relajantes y/o descontracturantes", columnas: COLUMNAS_BASE,
        filas: [
          ["Cuerpo completo", "50 min", "$40.000"],
          ["Medio cuerpo", "30 min", "$35.000"],
          ["Relajante de manos y pies", "20 min", "$25.000"],
          ["Cráneo, facial y cervical", "20 min", "$45.000"]
        ]
      },
      {
        id: "masajes-maderoterapia", titulo: "Masajes + maderoterapia", detalle: "Reductor / modelador", columnas: COLUMNAS_BASE,
        filas: [
          ["Cuerpo completo", "60 min", "$50.000"],
          ["Por zona", "30 min", "$30.000"],
          ["Facial", "20 min", "$25.000"]
        ]
      }
    ]
  },
  {
    id: "drenaje", nombre: "Drenaje linfático", descripcion: "Drenaje facial con radiofrecuencia o presoterapia.", imagen: "img/cat-drenaje.jpg",
    grupos: [{
      id: "drenaje-servicios", titulo: "", columnas: COLUMNAS_BASE,
      filas: [
        ["Facial", "20 min", "$35.000"],
        ["Facial + radiofrecuencia", "45 min", "$60.000"],
        ["Facial + presoterapia", "50 min", "$48.000"]
      ]
    }]
  },
  {
    id: "cejas-pestanas", nombre: "Cejas y pestañas", descripcion: "Laminado, perfilado, lifting y extensiones.", imagen: "img/cat-cejas-pestanas.jpg",
    grupos: [
      {
        id: "cejas", titulo: "Cejas", columnas: COLUMNAS_BASE,
        filas: [
          ["Laminado + perfilado + nutrición", "45 min", "$32.000"],
          ["Perfilado de cejas", "40 min", "$18.000"]
        ]
      },
      {
        id: "pestanas", titulo: "Pestañas", columnas: COLUMNAS_BASE,
        filas: [
          ["Lifting de pestañas", "1 h", "$30.000"],
          ["Extensiones de pestañas clásicas", "1 h 30 min", "$30.000"],
          ["Pestañas efecto húmedo", "2 h", "$35.000"],
          ["Pestañas volumen brasilero", "2 h", "$35.000"],
          ["Pestañas hawaianas", "2 h", "$38.000"],
          ["Pestañas volumen griego", "2 h", "$40.000"],
          ["Pestañas anime efecto", "2 h", "$48.000"],
          ["Pestañas volumen Foxy 4D", "2 h", "$40.000"],
          ["Promo lifting + laminado + perfilado", "2 h", "$50.000"]
        ]
      }
    ]
  },
  {
    id: "facial", nombre: "Estética facial", descripcion: "Limpiezas, antiage, peeling, exosomas y PDRN.", imagen: "img/cat-facial.jpg",
    grupos: [{
      id: "facial-servicios", titulo: "", columnas: COLUMNAS_BASE,
      filas: [
        ["Limpieza básica", "30 min", "$30.000"],
        ["Limpieza completa", "40 min", "$40.000"],
        ["Limpieza premium", "1 hora", "$50.000"],
        ["Tratamiento antiage", "1 hora", "$55.000"],
        ["Tratamiento de acné", "30 min", "$40.000"],
        ["Peeling facial", "1 hora", "$50.000"],
        ["Exosomas", "30 min", "$50.000"],
        ["PDRN", "30 min", "$55.000"]
      ]
    }]
  },
  {
    id: "corporal", nombre: "Corporal", descripcion: "Aparatología y tratamientos corporales.", imagen: "img/cat-corporal.jpg",
    grupos: [
      {
        id: "corporal-aparatologia", titulo: "Aparatología corporal", columnas: COLUMNAS_BASE,
        filas: [
          ["Radiofrecuencia por zona", "30 min", "$45.000"],
          ["Presoterapia", "30 min", "$40.000"],
          ["Tratamiento LED por zona", "30 min", "$30.000"]
        ]
      },
      {
        id: "corporal-tratamientos", titulo: "Tratamientos corporales", columnas: COLUMNAS_BASE,
        filas: [
          ["Masajes reductores", "1 hora", "$50.000"],
          ["Tratamiento 4 sesiones · 1 zona", "30 min por sesión", "$100.000"],
          ["Tratamiento 4 sesiones · 2 zonas", "45 min por sesión", "$150.000"],
          ["Tratamiento 4 sesiones · 3 zonas", "1 h por sesión", "$200.000"]
        ]
      }
    ]
  },
  {
    id: "trenzas", nombre: "Trenzas", descripcion: "Africanas, boho, fulani, twist y cosidas.", imagen: "img/cat-trenzas.jpg",
    grupos: [
      { id: "trenzas-box-braids", titulo: "Africanas · Box Braids", columnas: COLUMNAS_BASE, filas: [
        ["Small", "8 hs", "$60.000"], ["Medium", "8 hs", "$55.000"], ["Jumbo", "8 hs", "$50.000"] ] },
      { id: "trenzas-boho", titulo: "Africanas · Boho", columnas: COLUMNAS_BASE, filas: [
        ["Largas", "8 hs", "$70.000"], ["Cortas", "6 hs", "$65.000"], ["Con muchos rulos", "8 hs", "$85.000"] ] },
      { id: "trenzas-fulani", titulo: "Africanas · Fulani", columnas: COLUMNAS_BASE, filas: [
        ["Largas", "8 hs", "$70.000"], ["Cortas", "6 hs", "$65.000"] ] },
      { id: "trenzas-twist", titulo: "Africanas · Twist", columnas: COLUMNAS_BASE, filas: [
        ["Largas", "8 hs", "$55.000"], ["Cortas", "6 hs", "$50.000"] ] },
      { id: "trenzas-cosidas-rectas", titulo: "Cosidas rectas", columnas: COLUMNAS_KANEKALON, filas: [
        ["4 trenzas", "1 hs", "$15.000", "$20.000"],
        ["6 trenzas", "2 hs", "$20.000", "$25.000"],
        ["8 trenzas", "3 hs", "$25.000", "$30.000"],
        ["10 trenzas o más", "4 hs", "$30.000", "$35.000"] ] },
      { id: "trenzas-cosidas-diseno", titulo: "Cosidas con diseño", columnas: COLUMNAS_KANEKALON, filas: [
        ["4 trenzas", "2 hs", "$30.000", "$35.000"],
        ["6 trenzas", "3 hs", "$40.000", "$45.000"],
        ["8 trenzas", "4 hs", "$50.000", "$55.000"],
        ["10 trenzas o más", "6 hs", "$60.000", "$65.000"] ] }
    ]
  }
];

// Preguntas frecuentes (se muestran en la página de inicio)
var PREGUNTAS = [
  {
    pregunta: "¿Cómo reservo un turno?",
    respuesta: "Elegí tus servicios en la página de Precios con el botón +, abrí el carrito, elegí el día y el horario y tocá “Enviar por WhatsApp”. Te respondemos para confirmar tu turno."
  },
  {
    pregunta: "¿Cuánto es la seña?",
    respuesta: "La seña es del " + DATOS_NEGOCIO.seniaPorcentaje + "% del costo del servicio. Cuando nos enviás tu pedido por WhatsApp te pasamos los datos para abonarla."
  },
  {
    pregunta: "¿Qué pasa si tengo que cancelar?",
    respuesta: "Si cancelás con 2 o 3 días de anticipación, te devolvemos la seña. Si cancelás el mismo día, la seña (o el abono del servicio) no se devuelve."
  },
  {
    pregunta: "¿Cuánto dura cada servicio?",
    respuesta: "Cada servicio muestra su duración en la página de Precios, así podés organizar tu día."
  },
  {
    pregunta: "¿El total del carrito es el precio final?",
    respuesta: "Es un total estimado: los precios pueden cambiar y algunos son “desde”. Te confirmamos el valor final por WhatsApp."
  },
  {
    pregunta: "¿Dónde están y en qué horario atienden?",
    respuesta: "Estamos en " + DATOS_NEGOCIO.direccion + ". Horario de atención: " + DATOS_NEGOCIO.horarios.toLowerCase() + "."
  }
];

// Cuidados antes y después de cada categoría (recomendaciones generales)
var CUIDADOS = {
  "unas": {
    antes: [
      "Avisanos si tenés hongos, heridas o alguna infección en uñas, manos o pies: en ese caso no se puede trabajar.",
      "No te cortes ni te saques las cutículas antes del turno.",
      "Si tenés esmalte o material de otro servicio, avisanos al reservar."
    ],
    despues: [
      "Usá guantes para lavar, limpiar o usar productos químicos.",
      "No uses las uñas como herramienta (abrir latas, despegar etiquetas).",
      "Hidratá las cutículas con aceite o crema todos los días.",
      "No te arranques el material: pedí turno para retirarlo."
    ]
  },
  "masajes": {
    antes: [
      "Evitá comidas pesadas 1 o 2 horas antes.",
      "Avisanos si estás embarazada o tenés lesiones, várices o alguna condición de salud.",
      "Vení con ropa cómoda y llegá unos minutos antes para relajarte."
    ],
    despues: [
      "Tomá agua durante el día.",
      "Evitá esfuerzos intensos y el alcohol el resto del día.",
      "Descansá: es normal sentir el cuerpo muy relajado."
    ]
  },
  "drenaje": {
    antes: [
      "Avisanos si tenés problemas circulatorios, trombosis, si estás embarazada o alguna condición de salud.",
      "Vení hidratada y con ropa cómoda."
    ],
    despues: [
      "Tomá bastante agua.",
      "Evitá el exceso de sal y el alcohol durante el día.",
      "Hacé una caminata suave si podés: ayuda a la circulación."
    ]
  },
  "cejas-pestanas": {
    antes: [
      "Vení sin maquillaje en la zona de ojos y cejas.",
      "Avisanos si tenés alergias a tinturas, pegamentos o cosméticos.",
      "No te hagas otro tratamiento en esa zona los días previos."
    ],
    despues: [
      "Evitá mojar la zona, el vapor y el sauna durante las primeras 24 horas.",
      "No frotes ni te rasques los ojos o las cejas.",
      "Peiná las pestañas con el cepillito y evitá productos oleosos cerca de los ojos.",
      "Para quitar el maquillaje usá productos suaves, sin frotar."
    ]
  },
  "facial": {
    antes: [
      "Avisanos si usás ácidos, retinoides u otros tratamientos para la piel, o si estás embarazada o tenés alergias.",
      "Vení con la piel limpia, sin exfoliarla los días previos."
    ],
    despues: [
      "Usá protector solar todos los días y evitá el sol directo.",
      "No te toques ni te exfolies la piel los días siguientes.",
      "Hidratá tu piel y seguí las indicaciones que te dé la profesional."
    ]
  },
  "corporal": {
    antes: [
      "Vení hidratada y evitá comidas pesadas justo antes.",
      "Avisanos si estás embarazada o tenés alguna condición de salud, así elegimos lo mejor para vos."
    ],
    despues: [
      "Tomá agua durante el día.",
      "Evitá el sol directo en la zona tratada.",
      "Seguí las indicaciones que te dé la profesional para cuidar los resultados."
    ]
  },
  "trenzas": {
    antes: [
      "Vení con el cabello limpio, seco y bien desenredado.",
      "Avisanos si tenés el cuero cabelludo sensible o alergia al kanekalon.",
      "Reservá tiempo: algunos peinados llevan varias horas."
    ],
    despues: [
      "Mantené el cuero cabelludo limpio con shampoo suave.",
      "Secá bien las trenzas para evitar la humedad.",
      "Dormí con un pañuelo o gorro de satén para cuidarlas.",
      "Si sentís dolor o picazón intensa, consultanos."
    ]
  }
};
