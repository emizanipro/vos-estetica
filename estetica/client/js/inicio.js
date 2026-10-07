// Página de inicio: tarjetas de categorías (sin precios), cinta de servicios y números

// Crea la tarjeta de una categoría; lleva a su lista en la página de precios
function CrearTarjeta(servicio) {
  var tarjeta = CrearElemento("a", "tarjeta-servicio");
  tarjeta.href = EnlaceCategoria(servicio.id);

  // Banner de la categoría (el nombre está escrito dentro de la imagen)
  var contenedorImagen = CrearElemento("div", "tarjeta-servicio-imagen");
  var imagen = CrearElemento("img");
  imagen.src = servicio.imagen;
  imagen.alt = "";
  imagen.loading = "lazy";
  contenedorImagen.appendChild(imagen);

  // Etiqueta con la cantidad de servicios de la categoría
  var cantidad = CantidadServicios(servicio);
  contenedorImagen.appendChild(CrearElemento("span", "tarjeta-servicio-cantidad", cantidad + (cantidad === 1 ? " servicio" : " servicios")));
  tarjeta.appendChild(contenedorImagen);

  var texto = CrearElemento("div", "tarjeta-servicio-texto");
  texto.appendChild(CrearElemento("h3", "solo-lectores", servicio.nombre));
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

DibujarTarjetas();
DibujarCinta();
CompletarCifras();
ControlarVideo();
