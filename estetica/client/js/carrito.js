// Carrito de servicios: guarda los servicios elegidos y arma el mensaje de WhatsApp
// (requiere datos.js y principal.js cargados antes)

var CLAVE_CARRITO = "vos-carrito";
var carrito = [];

// ---------- Datos guardados (se mantienen al cambiar de página) ----------
function CargarCarrito() {
  try {
    var guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    if (Array.isArray(guardado)) carrito = guardado;
  } catch (error) {
    carrito = [];
  }
}

function GuardarCarrito() {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch (error) {
    // sin almacenamiento: el carrito funciona igual mientras la página esté abierta
  }
}

function CarritoTiene(id) {
  return carrito.some(function (servicio) {
    return servicio.id === id;
  });
}

// Agrega el servicio, o lo quita si ya estaba
function AlternarServicio(servicio) {
  if (CarritoTiene(servicio.id)) {
    carrito = carrito.filter(function (item) {
      return item.id !== servicio.id;
    });
  } else {
    carrito.push(servicio);
  }
  ActualizarCarrito(true);
}

function QuitarServicio(id) {
  carrito = carrito.filter(function (item) {
    return item.id !== id;
  });
  ActualizarCarrito(false);
}

function VaciarCarrito() {
  carrito = [];
  ActualizarCarrito(false);
}

// ---------- Precios ----------
// Convierte "$25.000" o "Desde $40.000" en número (25000)
function PrecioANumero(texto) {
  var numero = String(texto).match(/[\d.]+/);
  return numero ? parseInt(numero[0].replace(/\./g, ""), 10) : 0;
}

function FormatearPrecio(numero) {
  return "$" + numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Suma los precios; "desde" es verdadero si algún precio es "Desde ..."
function CalcularTotal() {
  var total = 0;
  var desde = false;
  carrito.forEach(function (servicio) {
    total += PrecioANumero(servicio.precio);
    if (/desde/i.test(servicio.precio)) desde = true;
  });
  return { total: total, desde: desde };
}

// ---------- Mensaje de WhatsApp ----------
function CrearMensaje(nombre, preferencia) {
  var lineas = ["Hola! Soy " + nombre + ". Quiero reservar estos servicios:", ""];
  carrito.forEach(function (servicio) {
    var detalle = servicio.nombre;
    if (servicio.variante) detalle += " (" + servicio.variante + ")";
    detalle += " - " + servicio.categoria;
    if (servicio.duracion && servicio.duracion !== "—") detalle += " - " + servicio.duracion;
    lineas.push("• " + detalle + ": " + servicio.precio);
  });
  var suma = CalcularTotal();
  lineas.push("", "Total estimado: " + (suma.desde ? "desde " : "") + FormatearPrecio(suma.total));
  if (preferencia) lineas.push("Día y horario preferido: " + preferencia);
  lineas.push("", "¿Me pasan los datos para abonar la seña? Gracias!");
  return lineas.join("\n");
}

// ---------- Dibujo ----------
var ICONO_CARRITO =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>';

var ICONO_CERRAR =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

// Botón del carrito en el encabezado (celular: arriba a la derecha)
function DibujarBotonCarrito() {
  var zona = document.querySelector(".barra-acciones");
  if (!zona) return;
  var boton = CrearElemento("button", "boton-icono boton-carrito");
  boton.id = "boton-carrito";
  boton.type = "button";
  boton.setAttribute("aria-label", "Abrir carrito de servicios");
  boton.setAttribute("aria-expanded", "false");
  boton.setAttribute("aria-controls", "panel-carrito");
  boton.innerHTML = ICONO_CARRITO + '<span id="carrito-contador" class="carrito-contador" hidden>0</span>';
  zona.insertBefore(boton, zona.firstChild);
}

// Panel que se abre de derecha a izquierda
function DibujarPanelCarrito() {
  var fondo = CrearElemento("div", "fondo-carrito");
  fondo.id = "fondo-carrito";

  var panel = CrearElemento("aside", "panel-carrito");
  panel.id = "panel-carrito";
  panel.setAttribute("aria-label", "Carrito de servicios");
  panel.innerHTML =
    '<div class="carrito-cabecera">' +
      '<h2 class="carrito-titulo">Tus servicios</h2>' +
      '<button id="boton-cerrar-carrito" class="boton-icono" type="button" aria-label="Cerrar carrito">' + ICONO_CERRAR + "</button>" +
    "</div>" +
    '<div class="carrito-cuerpo">' +
      '<p id="carrito-vacio" class="carrito-vacio">Todavía no elegiste servicios. Tocá el <strong>+</strong> en los que te gusten.</p>' +
      '<ul id="carrito-lista" class="carrito-lista"></ul>' +
      '<p id="carrito-total" class="carrito-total" hidden></p>' +
    "</div>" +
    '<form id="carrito-form" class="carrito-form" novalidate>' +
      '<label class="carrito-campo">Tu nombre' +
        '<input id="carrito-nombre" type="text" autocomplete="name" placeholder="Ej: María" required>' +
      "</label>" +
      '<label class="carrito-campo">Día y horario preferido (opcional)' +
        '<input id="carrito-preferencia" type="text" placeholder="Ej: jueves por la tarde">' +
      "</label>" +
      '<p id="carrito-error" class="carrito-error" role="alert" hidden>Escribí tu nombre para continuar.</p>' +
      '<button type="submit" class="boton boton-primario carrito-enviar">Enviar por WhatsApp</button>' +
      '<button id="carrito-vaciar" class="carrito-vaciar" type="button">Vaciar carrito</button>' +
    "</form>";

  document.body.appendChild(fondo);
  document.body.appendChild(panel);
}

// Lista de servicios cargados
function DibujarLista() {
  var lista = document.getElementById("carrito-lista");
  lista.innerHTML = "";
  carrito.forEach(function (servicio) {
    var item = CrearElemento("li", "carrito-item");

    var texto = CrearElemento("div", "carrito-item-texto");
    texto.appendChild(CrearElemento("p", "carrito-item-nombre", servicio.nombre));
    var detalle = servicio.categoria;
    if (servicio.variante) detalle += " · " + servicio.variante;
    texto.appendChild(CrearElemento("p", "carrito-item-detalle", detalle));
    texto.appendChild(CrearElemento("p", "carrito-item-precio", servicio.precio));
    item.appendChild(texto);

    var quitar = CrearElemento("button", "carrito-item-quitar");
    quitar.type = "button";
    quitar.setAttribute("aria-label", "Quitar " + servicio.nombre);
    quitar.innerHTML = ICONO_CERRAR;
    quitar.addEventListener("click", function () {
      QuitarServicio(servicio.id);
    });
    item.appendChild(quitar);
    lista.appendChild(item);
  });
}

// Refresca todo: lista, total, contador y botones "+" de la página
function ActualizarCarrito(animar) {
  GuardarCarrito();
  DibujarLista();

  var cantidad = carrito.length;
  var vacio = cantidad === 0;
  document.getElementById("carrito-vacio").hidden = !vacio;
  document.getElementById("carrito-form").classList.toggle("sin-servicios", vacio);

  var total = document.getElementById("carrito-total");
  total.hidden = vacio;
  if (!vacio) {
    var suma = CalcularTotal();
    total.textContent = "Total estimado: " + (suma.desde ? "desde " : "") + FormatearPrecio(suma.total);
  }

  var contador = document.getElementById("carrito-contador");
  contador.hidden = vacio;
  contador.textContent = cantidad;
  document.getElementById("boton-carrito").setAttribute(
    "aria-label",
    "Abrir carrito de servicios" + (vacio ? "" : " (" + cantidad + ")")
  );
  if (animar) {
    contador.classList.remove("rebote");
    void contador.offsetWidth; // reinicia la animación
    contador.classList.add("rebote");
  }

  document.querySelectorAll("[data-carrito-id]").forEach(function (boton) {
    var dentro = CarritoTiene(boton.dataset.carritoId);
    boton.classList.toggle("en-carrito", dentro);
    boton.setAttribute("aria-pressed", dentro ? "true" : "false");
    boton.querySelector(".agregar-icono").textContent = dentro ? "✓" : "+";
    boton.querySelector(".agregar-texto").textContent = dentro ? "Agregado" : "Agregar";
  });

  if (vacio && document.getElementById("panel-carrito").classList.contains("abierto")) {
    // se queda abierto mostrando el aviso de carrito vacío
  }
}

// ---------- Abrir y cerrar ----------
function AbrirCarrito() {
  document.getElementById("panel-carrito").classList.add("abierto");
  document.getElementById("fondo-carrito").classList.add("abierto");
  document.getElementById("boton-carrito").setAttribute("aria-expanded", "true");
  document.body.classList.add("sin-scroll");
}

function CerrarCarrito() {
  document.getElementById("panel-carrito").classList.remove("abierto");
  document.getElementById("fondo-carrito").classList.remove("abierto");
  document.getElementById("boton-carrito").setAttribute("aria-expanded", "false");
  document.body.classList.remove("sin-scroll");
}

// Envía el pedido: abre WhatsApp con el mensaje armado
function EnviarCarrito(evento) {
  evento.preventDefault();
  var nombre = document.getElementById("carrito-nombre").value.trim();
  var preferencia = document.getElementById("carrito-preferencia").value.trim();
  var error = document.getElementById("carrito-error");

  if (carrito.length === 0) return;
  if (!nombre) {
    error.hidden = false;
    document.getElementById("carrito-nombre").focus();
    return;
  }
  error.hidden = true;
  try {
    localStorage.setItem("vos-nombre", nombre);
  } catch (errorAlmacen) {
    // no es grave
  }

  var enlace = "https://wa.me/" + DATOS_NEGOCIO.whatsappNumero + "?text=" + encodeURIComponent(CrearMensaje(nombre, preferencia));
  var ventana = window.open(enlace, "_blank", "noopener");
  if (!ventana) window.location.href = enlace;
}

function IniciarCarrito() {
  CargarCarrito();
  DibujarBotonCarrito();
  DibujarPanelCarrito();

  document.getElementById("boton-carrito").addEventListener("click", AbrirCarrito);
  document.getElementById("boton-cerrar-carrito").addEventListener("click", CerrarCarrito);
  document.getElementById("fondo-carrito").addEventListener("click", CerrarCarrito);
  document.getElementById("carrito-form").addEventListener("submit", EnviarCarrito);
  document.getElementById("carrito-vaciar").addEventListener("click", VaciarCarrito);
  document.getElementById("carrito-nombre").addEventListener("input", function () {
    document.getElementById("carrito-error").hidden = true;
  });
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") CerrarCarrito();
  });

  try {
    document.getElementById("carrito-nombre").value = localStorage.getItem("vos-nombre") || "";
  } catch (error) {
    // sin almacenamiento
  }
  ActualizarCarrito(false);
}

IniciarCarrito();
