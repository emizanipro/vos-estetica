// Código común a todas las páginas: encabezado, menús, pie de página y contacto

var PAGINA_INICIO = "index.html";
var PAGINA_PRECIOS = "precios.html";

// Ícono de mensaje (se usa en los botones de turno)
var ICONO_MENSAJE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.8 7L4 20l1.1-4.6A8 8 0 1 1 21 12Z"/></svg>';

// Crea un elemento HTML con clase y texto
function CrearElemento(etiqueta, clase, texto) {
  var elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto) elemento.textContent = texto;
  return elemento;
}

// Devuelve el enlace a una categoría (siempre vive en la página de precios)
function EnlaceCategoria(id) {
  return PAGINA_PRECIOS + "#" + id;
}

// Arma el menú grande de "Servicios" (pantalla grande): una fila por categoría con miniatura
function CrearMegaMenu() {
  var items = SERVICIOS.map(function (servicio) {
    return '<a class="mega-item" href="' + EnlaceCategoria(servicio.id) + '">' +
      '<span><span class="mega-item-nombre">' + servicio.nombre + '</span>' +
      '<span class="mega-item-detalle">' + servicio.descripcion + "</span></span></a>";
  }).join("");

  return '<div class="mega-grilla">' + items +
    '<a class="mega-item mega-item-destacado" href="' + PAGINA_PRECIOS + '"><span>' +
    '<span class="mega-item-nombre">Ver todos los precios</span>' +
    '<span class="mega-item-detalle">Lista completa de servicios →</span></span></a></div>';
}

// Dibuja el encabezado: celular = hamburguesa, pantalla grande = menú horizontal con menú grande
function DibujarEncabezado() {
  var cabecera = document.getElementById("encabezado");
  cabecera.className = "encabezado";

  // Marca la página actual en el menú
  var esPrecios = location.pathname.indexOf("precios") !== -1;
  var actualInicio = esPrecios ? "" : ' aria-current="page"';
  var actualPrecios = esPrecios ? ' aria-current="page"' : "";

  cabecera.innerHTML =
    // Franja superior con datos útiles (solo pantalla grande)
    '<div class="franja-superior"><div class="contenedor contenedor-ancho franja-contenido">' +
      '<p><span data-direccion></span> · <span data-horarios></span></p>' +
      '<p class="franja-enlaces">' +
        '<a data-whatsapp data-whatsapp-texto href="#" target="_blank" rel="noopener"></a>' +
        '<a data-instagram data-instagram-texto href="#" target="_blank" rel="noopener"></a>' +
      "</p>" +
    "</div></div>" +
    // Barra principal: logo | menú centrado | botón de turnos
    '<div class="barra contenedor contenedor-ancho">' +
      '<button id="boton-menu" class="boton-icono boton-menu" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="panel-menu">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>' +
      "</button>" +
      '<a class="logo" href="' + PAGINA_INICIO + '" aria-label="Ir al inicio"><img class="logo-imagen" src="img/logo-vos-transparente.png" alt="Vos Estética Integral"></a>' +
      '<nav class="nav" aria-label="Principal">' +
        '<a class="nav-enlace" href="' + PAGINA_INICIO + '"' + actualInicio + ">Inicio</a>" +
        '<div id="contenedor-servicios" class="nav-servicios">' +
          '<button id="boton-servicios" class="nav-enlace" type="button" aria-expanded="false" aria-controls="menu-servicios">Servicios <span aria-hidden="true">▾</span></button>' +
          '<div id="menu-servicios" class="mega"><div class="mega-caja">' + CrearMegaMenu() + "</div></div>" +
        "</div>" +
        '<a class="nav-enlace" href="' + PAGINA_PRECIOS + '"' + actualPrecios + ">Precios</a>" +
        '<a class="nav-enlace" href="' + PAGINA_INICIO + '#nosotros">Nosotros</a>' +
        '<a class="nav-enlace" href="#contacto">Contacto</a>' +
      "</nav>" +
      '<div class="barra-acciones">' +
        '<a class="boton boton-primario boton-turno" data-whatsapp href="#" target="_blank" rel="noopener">' +
          ICONO_MENSAJE + "Pedir turno</a>" +
      "</div>" +
    "</div>";

  DibujarPanelMovil();
}

// Crea un enlace del panel móvil (categoría o subcategoría)
function CrearEnlaceMenu(texto, destino, clase) {
  var enlace = CrearElemento("a", clase, texto);
  enlace.href = destino;
  enlace.addEventListener("click", CerrarMenu);
  return enlace;
}

// Dibuja el panel lateral del celular: logo, categorías y datos de contacto
function DibujarPanelMovil() {
  var fondo = CrearElemento("div", "fondo-menu");
  fondo.id = "fondo-menu";

  var panel = CrearElemento("aside", "panel-movil");
  panel.id = "panel-menu";
  panel.setAttribute("aria-label", "Menú de categorías");

  var cabecera = CrearElemento("div", "panel-cabecera");
  cabecera.innerHTML =
    '<img src="img/logo-vos-transparente.png" alt="Vos Estética Integral">' +
    '<button id="boton-cerrar-menu" class="boton-icono" type="button" aria-label="Cerrar menú">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
  panel.appendChild(cabecera);

  var lista = CrearElemento("nav", "panel-lista");
  lista.appendChild(CrearElemento("p", "panel-grupo", "Servicios"));

  SERVICIOS.forEach(function (servicio) {
    if (servicio.grupos.length < 2) {
      lista.appendChild(CrearEnlaceMenu(servicio.nombre, EnlaceCategoria(servicio.id), "panel-enlace"));
      return;
    }
    var detalle = CrearElemento("details", "panel-categoria");
    var resumen = CrearElemento("summary", "panel-resumen");
    resumen.appendChild(CrearElemento("span", "", servicio.nombre));
    resumen.appendChild(CrearElemento("span", "panel-flecha", "▾"));
    detalle.appendChild(resumen);
    detalle.appendChild(CrearEnlaceMenu("Ver todo", EnlaceCategoria(servicio.id), "panel-subenlace"));
    servicio.grupos.forEach(function (grupo) {
      detalle.appendChild(CrearEnlaceMenu(grupo.titulo, EnlaceCategoria(grupo.id), "panel-subenlace"));
    });
    lista.appendChild(detalle);
  });

  lista.appendChild(CrearElemento("p", "panel-grupo panel-grupo-borde", "Más"));
  lista.appendChild(CrearEnlaceMenu("Nosotros", PAGINA_INICIO + "#nosotros", "panel-enlace"));
  lista.appendChild(CrearEnlaceMenu("Contacto", "#contacto", "panel-enlace"));
  panel.appendChild(lista);

  // Pie del panel: dirección y horarios (el turno se pide con el botón fijo)
  var pie = CrearElemento("div", "panel-pie");
  pie.innerHTML =
    '<p class="panel-horarios" data-direccion></p>' +
    '<p class="panel-horarios" data-horarios></p>';
  panel.appendChild(pie);

  document.body.appendChild(fondo);
  document.body.appendChild(panel);
}

// Dibuja el pie de página con los datos de contacto
function DibujarPie() {
  var pie = document.getElementById("pie");
  pie.id = "contacto";
  pie.className = "pie";

  var enlaces = SERVICIOS.map(function (servicio) {
    return '<li><a href="' + EnlaceCategoria(servicio.id) + '">' + servicio.nombre + "</a></li>";
  }).join("");

  pie.innerHTML =
    '<div class="contenedor pie-contenido">' +
      "<div>" +
        '<img class="pie-logo" src="img/logo-vos-transparente.png" alt="Vos Estética Integral">' +
        '<p class="pie-frase">Tu bienestar, nuestra prioridad</p>' +
      "</div>" +
      "<div>" +
        '<p class="pie-titulo">Servicios</p>' +
        '<ul class="pie-lista">' + enlaces + "</ul>" +
      "</div>" +
      "<div>" +
        '<p class="pie-titulo">Contacto</p>' +
        '<ul class="pie-lista">' +
          "<li data-direccion></li>" +
          "<li data-horarios></li>" +
          '<li><a data-whatsapp data-whatsapp-texto href="#" target="_blank" rel="noopener"></a></li>' +
          '<li><a data-instagram data-instagram-texto href="#" target="_blank" rel="noopener"></a></li>' +
          '<li><a class="pie-mapa" data-mapa href="#" target="_blank" rel="noopener">Ver en Google Maps</a></li>' +
        "</ul>" +
      "</div>" +
    "</div>" +
    '<p class="pie-derechos">© ' + new Date().getFullYear() + " Vos Estética Integral · Mendoza</p>";
}

// Abre el menú del celular
function AbrirMenu() {
  document.getElementById("panel-menu").classList.add("abierto");
  document.getElementById("fondo-menu").classList.add("abierto");
  document.getElementById("boton-menu").setAttribute("aria-expanded", "true");
  document.body.classList.add("sin-scroll");
}

// Cierra el menú del celular
function CerrarMenu() {
  document.getElementById("panel-menu").classList.remove("abierto");
  document.getElementById("fondo-menu").classList.remove("abierto");
  document.getElementById("boton-menu").setAttribute("aria-expanded", "false");
  document.body.classList.remove("sin-scroll");
}

// Menú grande de "Servicios": abre con el mouse o el teclado y cierra con Escape
function IniciarMegaMenu() {
  var contenedor = document.getElementById("contenedor-servicios");
  var boton = document.getElementById("boton-servicios");
  var menu = document.getElementById("menu-servicios");

  function Abrir() {
    menu.classList.add("abierto");
    boton.setAttribute("aria-expanded", "true");
  }
  function Cerrar() {
    menu.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
  }

  contenedor.addEventListener("mouseenter", Abrir);
  contenedor.addEventListener("mouseleave", Cerrar);
  boton.addEventListener("click", function () {
    if (menu.classList.contains("abierto")) Cerrar(); else Abrir();
  });
  contenedor.addEventListener("focusout", function (evento) {
    if (!contenedor.contains(evento.relatedTarget)) Cerrar();
  });
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") Cerrar();
  });
}

// Agrega una sombra al encabezado al bajar la página
function IniciarEfectoScroll() {
  var cabecera = document.getElementById("encabezado");
  function Actualizar() {
    cabecera.classList.toggle("con-sombra", window.scrollY > 10);
  }
  window.addEventListener("scroll", Actualizar, { passive: true });
  Actualizar();
}

// Completa los enlaces y textos de contacto con los datos del negocio
function CompletarContacto() {
  var enlaceWhatsApp = "https://wa.me/" + DATOS_NEGOCIO.whatsappNumero + "?text=" + encodeURIComponent(DATOS_NEGOCIO.whatsappMensaje);
  document.querySelectorAll("[data-whatsapp]").forEach(function (el) { el.href = enlaceWhatsApp; });
  document.querySelectorAll("[data-whatsapp-texto]").forEach(function (el) { el.textContent = DATOS_NEGOCIO.whatsappTexto; });
  document.querySelectorAll("[data-instagram]").forEach(function (el) { el.href = DATOS_NEGOCIO.instagramUrl; });
  document.querySelectorAll("[data-instagram-texto]").forEach(function (el) { el.textContent = DATOS_NEGOCIO.instagramUsuario; });
  document.querySelectorAll("[data-direccion]").forEach(function (el) { el.textContent = DATOS_NEGOCIO.direccion; });
  document.querySelectorAll("[data-horarios]").forEach(function (el) { el.textContent = DATOS_NEGOCIO.horarios; });
  var mapa = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(DATOS_NEGOCIO.direccion);
  document.querySelectorAll("[data-mapa]").forEach(function (el) { el.href = mapa; });
}

// Inicia lo común a todas las páginas
function IniciarComun() {
  DibujarEncabezado();
  DibujarPie();
  CompletarContacto();
  IniciarMegaMenu();
  IniciarEfectoScroll();
  document.getElementById("boton-menu").addEventListener("click", AbrirMenu);
  document.getElementById("boton-cerrar-menu").addEventListener("click", CerrarMenu);
  document.getElementById("fondo-menu").addEventListener("click", CerrarMenu);
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") CerrarMenu();
  });
  // Si se agranda la pantalla con el menú abierto, lo cierra
  window.matchMedia("(min-width: 768px)").addEventListener("change", CerrarMenu);
}

IniciarComun();
