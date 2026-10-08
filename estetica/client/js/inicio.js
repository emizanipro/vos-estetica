// Página de inicio: tarjetas de categorías (sin precios), cinta de servicios y números

// Crea la tarjeta de una categoría; lleva a su lista en la página de precios
function CrearTarjeta(servicio) {
  var tarjeta = CrearElemento("a", "tarjeta-servicio");
  tarjeta.href = EnlaceCategoria(servicio.id);

  // Imagen de la tarjeta (img/tarjeta-<id>.jpg) con un fondo oscuro suave y el nombre encima
  var contenedorImagen = CrearElemento("div", "tarjeta-servicio-imagen");
  var imagen = CrearElemento("img");
  imagen.src = "img/tarjeta-" + servicio.id + ".jpg";
  imagen.alt = "";
  imagen.loading = "lazy";
  contenedorImagen.appendChild(imagen);

  // Etiqueta con la cantidad de servicios de la categoría
  var cantidad = CantidadServicios(servicio);
  contenedorImagen.appendChild(CrearElemento("span", "tarjeta-servicio-cantidad", cantidad + (cantidad === 1 ? " servicio" : " servicios")));
  contenedorImagen.appendChild(CrearElemento("h3", "tarjeta-servicio-nombre", servicio.nombre));
  tarjeta.appendChild(contenedorImagen);

  var texto = CrearElemento("div", "tarjeta-servicio-texto");
  texto.appendChild(CrearElemento("p", "tarjeta-servicio-descripcion", servicio.descripcion));
  texto.appendChild(CrearElemento("span", "tarjeta-servicio-enlace", "Ver precios y turnos"));
  tarjeta.appendChild(texto);
  return tarjeta;
}

// Cuenta los servicios de una categoría (suma las filas de todos sus grupos)
function CantidadServicios(servicio) {
  return servicio.grupos.reduce(function (total, grupo) { return total + grupo.filas.length; }, 0);
}

// Dibuja todas las tarjetas
function DibujarTarjetas() {
  var contenedor = document.getElementById("tarjetas-servicios");
  SERVICIOS.forEach(function (servicio) {
    contenedor.appendChild(CrearTarjeta(servicio));
  });
}

// Dibuja la cinta que se desliza con los nombres de las categorías (se repite para que el bucle no se corte)
function DibujarCinta() {
  var pista = document.getElementById("cinta-pista");
  for (var vuelta = 0; vuelta < 4; vuelta++) {
    SERVICIOS.forEach(function (servicio) {
      pista.appendChild(CrearElemento("span", "cinta-item", servicio.nombre));
    });
  }
}

// Completa los números de "Nosotros" con los datos reales (efectos.js los hace subir)
function CompletarCifras() {
  var totalServicios = SERVICIOS.reduce(function (total, servicio) { return total + CantidadServicios(servicio); }, 0);
  document.querySelector('[data-contador="categorias"]').dataset.contador = SERVICIOS.length;
  document.querySelector('[data-contador="servicios"]').dataset.contador = totalServicios;
}

// Si la persona prefiere menos movimiento, el video no se reproduce solo
function ControlarVideo() {
  var video = document.getElementById("video-local");
  if (video && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.pause();
    video.controls = true;
  }
}

// Preguntas frecuentes: una lista que se abre y cierra
function DibujarPreguntas() {
  var contenedor = document.getElementById("preguntas-lista");
  PREGUNTAS.forEach(function (item) {
    var detalle = CrearElemento("details", "pregunta");
    detalle.appendChild(CrearElemento("summary", "pregunta-titulo", item.pregunta));
    detalle.appendChild(CrearElemento("p", "pregunta-respuesta", item.respuesta));
    contenedor.appendChild(detalle);
  });
}

// Datos para Google (negocio local). Se completan solos con js/datos.js
function AgregarDatosParaGoogle() {
  var datos = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "Vos Estética Integral",
    description: "Uñas, masajes, drenaje linfático, cejas y pestañas, estética facial, tratamientos corporales y trenzas en Mendoza.",
    telephone: "+" + DATOS_NEGOCIO.whatsappNumero,
    address: {
      "@type": "PostalAddress",
      streetAddress: "San Lorenzo 241",
      addressLocality: "Mendoza",
      addressRegion: "Mendoza",
      postalCode: "5500",
      addressCountry: "AR"
    },
    sameAs: [DATOS_NEGOCIO.instagramUrl]
  };
  var script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(datos);
  document.head.appendChild(script);
}

DibujarTarjetas();
DibujarCinta();
DibujarPreguntas();
AgregarDatosParaGoogle();
CompletarCifras();
ControlarVideo();
