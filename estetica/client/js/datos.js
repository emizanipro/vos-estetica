// Datos del negocio (para cambiar el WhatsApp, editar solo acá)
var DATOS_NEGOCIO = {
  whatsappNumero: "5492616094081",
  whatsappTexto: "+54 261 609 4081",
  whatsappMensaje: "Hola! Quiero consultar por un turno en Vos Estética Integral.",
  instagramUrl: "https://www.instagram.com/vos.esteticamza/",
  instagramUsuario: "@vos.esteticamza",
  direccion: "San Lorenzo 241, Mendoza, CP 5500, Argentina",
  horarios: "De 9:00 a 21:00 h"
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
