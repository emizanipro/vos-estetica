// Página de precios: celular = lista en tarjeta por grupo; pantalla grande = una tarjeta por servicio
// (el cambio de aspecto lo hace css/precios.css)

// Botón "+" que agrega (o quita) un servicio del carrito
function CrearBotonAgregar(categoria, fila, nombrePrecio, precio) {
  var id = categoria + "|" + fila[0] + "|" + (nombrePrecio || "");
  var boton = CrearElemento("button", "agregar");
  boton.type = "button";
  boton.dataset.carritoId = id;
  boton.setAttribute("aria-label", "Agregar " + fila[0] + (nombrePrecio ? " (" + nombrePrecio + ")" : "") + " al carrito");
  boton.appendChild(CrearElemento("span", "agregar-icono"));
  boton.appendChild(CrearElemento("span", "agregar-texto"));
  boton.addEventListener("click", function () {
    AlternarServicio({ id: id, categoria: categoria, nombre: fila[0], duracion: fila[1], variante: nombrePrecio || "", precio: precio });
  });
  return boton;
}

// Crea la parte de precios de un servicio: uno o dos precios (con etiqueta y botón "+" cada uno)
function CrearPrecios(columnas, fila, nombreCategoria) {
  var precios = fila.slice(2);
  var caja = CrearElemento("div", "servicio-precios");
  precios.forEach(function (valor, posicion) {
    var etiqueta = precios.length > 1 ? columnas[posicion + 2] : "";
    var columna = CrearElemento("div", "servicio-precio-columna");
    if (etiqueta) columna.appendChild(CrearElemento("p", "servicio-precio-etiqueta", etiqueta));
    columna.appendChild(CrearElemento("p", "servicio-precio", valor));
    columna.appendChild(CrearBotonAgregar(nombreCategoria, fila, etiqueta, valor));
    caja.appendChild(columna);
  });
  return caja;
}

// Crea un servicio: nombre y duración, precio y botón para agregar al carrito
function CrearServicio(columnas, fila, nombreCategoria) {
  var item = CrearElemento("li", "servicio");

  var texto = CrearElemento("div", "servicio-texto");
  texto.appendChild(CrearElemento("p", "servicio-nombre", fila[0]));
  if (fila[1] && fila[1] !== "—") texto.appendChild(CrearElemento("p", "servicio-duracion", fila[1]));
  item.appendChild(texto);

  item.appendChild(CrearPrecios(columnas, fila, nombreCategoria));
  return item;
}

// Crea un grupo (subcategoría): título, detalle, servicios y nota
function CrearGrupo(grupo, nombreCategoria) {
  var bloque = CrearElemento("div", "grupo");
  bloque.id = grupo.id;
  if (grupo.titulo) bloque.appendChild(CrearElemento("h3", "grupo-titulo", grupo.titulo));
  if (grupo.detalle) bloque.appendChild(CrearElemento("p", "grupo-detalle", grupo.detalle));

  var lista = CrearElemento("ul", "servicios-lista");
  lista.setAttribute("data-reveal-grupo", ""); // efectos.js hace aparecer los servicios de a uno
  grupo.filas.forEach(function (fila) {
    lista.appendChild(CrearServicio(grupo.columnas, fila, nombreCategoria));
  });
  bloque.appendChild(lista);

  if (grupo.nota) bloque.appendChild(CrearElemento("p", "grupo-nota", grupo.nota));
  return bloque;
}

// Crea la sección de una categoría: banner, descripción y sus grupos
function CrearCategoria(servicio) {
  var seccion = CrearElemento("section", "categoria");
  seccion.id = servicio.id;
  seccion.dataset.categoria = servicio.id;

  // El nombre de la categoría está escrito dentro de la imagen del banner
  seccion.appendChild(CrearElemento("h2", "solo-lectores", servicio.nombre));
  var portada = CrearElemento("div", "categoria-portada reveal reveal-zoom");
  var imagen = CrearElemento("img");
  imagen.src = servicio.imagen;
  imagen.alt = "";
  imagen.loading = "lazy";
  portada.appendChild(imagen);
  seccion.appendChild(portada);
  seccion.appendChild(CrearElemento("p", "categoria-descripcion reveal", servicio.descripcion));

  servicio.grupos.forEach(function (grupo) {
    seccion.appendChild(CrearGrupo(grupo, servicio.nombre));
  });
  return seccion;
}

// Dibuja todas las categorías
function DibujarCategorias() {
  var contenedor = document.getElementById("servicios");
  SERVICIOS.forEach(function (servicio) {
    contenedor.appendChild(CrearCategoria(servicio));
  });
}

// Dibuja la barra de accesos a cada categoría
function DibujarAccesos() {
  var contenedor = document.getElementById("accesos");
  SERVICIOS.forEach(function (servicio) {
    var enlace = CrearElemento("a", "acceso", servicio.nombre);
    enlace.href = "#" + servicio.id;
    enlace.dataset.acceso = servicio.id;
    contenedor.appendChild(enlace);
  });
}

// Resalta el acceso de la categoría que se está viendo
function MarcarActivo(id) {
  document.querySelectorAll("[data-acceso]").forEach(function (enlace) {
    var activo = enlace.dataset.acceso === id;
    enlace.classList.toggle("activo", activo);
    if (activo) enlace.setAttribute("aria-current", "true");
    else enlace.removeAttribute("aria-current");
  });

  // Centra el acceso activo dentro de la barra deslizable
  var barra = document.getElementById("accesos");
  var acceso = barra.querySelector('[data-acceso="' + id + '"]');
  if (acceso && barra.scrollWidth > barra.clientWidth) {
    barra.scrollTo({ left: acceso.offsetLeft - (barra.clientWidth - acceso.clientWidth) / 2, behavior: "smooth" });
  }
}

// Detecta qué categoría está en pantalla
function ObservarCategorias() {
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) MarcarActivo(entrada.target.dataset.categoria);
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  document.querySelectorAll("[data-categoria]").forEach(function (seccion) {
    observador.observe(seccion);
  });
}

DibujarCategorias();
ActualizarCarrito(false);
DibujarAccesos();
ObservarCategorias();
