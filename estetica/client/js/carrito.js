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

// ---------- Día y horario ----------
var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
var MESES_ADELANTE = 3; // hasta cuántos meses a futuro se puede reservar

var mesVista = null; // primer día del mes que se muestra en el calendario
var fechaElegida = null;
var horaElegida = "";

function InicioDeHoy() {
  var hoy = new Date();
  return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
}

function MismoDia(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// "jueves 15 de octubre"
function TextoFecha(fecha) {
  return DIAS[fecha.getDay()] + " " + fecha.getDate() + " de " + MESES[fecha.getMonth()];
}

// Dibuja el mes del calendario
function DibujarCalendario() {
  var hoy = InicioDeHoy();
  var primerMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  var ultimoMes = new Date(hoy.getFullYear(), hoy.getMonth() + MESES_ADELANTE, 1);

  document.getElementById("calendario-titulo").textContent = MESES[mesVista.getMonth()] + " " + mesVista.getFullYear();
  document.getElementById("calendario-anterior").disabled = mesVista <= primerMes;
  document.getElementById("calendario-siguiente").disabled = mesVista >= ultimoMes;

  var contenedor = document.getElementById("calendario-dias");
  contenedor.innerHTML = "";
  var vacios = (mesVista.getDay() + 6) % 7; // la semana empieza en lunes
  for (var i = 0; i < vacios; i++) contenedor.appendChild(CrearElemento("span"));

  var cantidad = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 0).getDate();
  for (var dia = 1; dia <= cantidad; dia++) {
    contenedor.appendChild(CrearBotonDia(new Date(mesVista.getFullYear(), mesVista.getMonth(), dia), hoy));
  }
}

function CrearBotonDia(fecha, hoy) {
  var boton = CrearElemento("button", "calendario-dia", fecha.getDate());
  boton.type = "button";
  boton.disabled = fecha < hoy;
  boton.setAttribute("aria-label", TextoFecha(fecha));
  if (MismoDia(fecha, hoy)) boton.classList.add("hoy");
  var elegido = MismoDia(fecha, fechaElegida);
  boton.classList.toggle("elegido", elegido);
  boton.setAttribute("aria-pressed", elegido ? "true" : "false");
  boton.addEventListener("click", function () {
    fechaElegida = fecha;
    DibujarCalendario();
    DibujarHorarios();
    LimpiarError();
  });
  return boton;
}

// Dibuja los horarios disponibles (uno por hora)
function DibujarHorarios() {
  var contenedor = document.getElementById("horarios");
  contenedor.innerHTML = "";
  var ahora = new Date();
  var esHoy = MismoDia(fechaElegida, ahora);
  if (horaElegida && esHoy && parseInt(horaElegida, 10) <= ahora.getHours()) horaElegida = "";

  for (var hora = DATOS_NEGOCIO.horaApertura; hora < DATOS_NEGOCIO.horaCierre; hora++) {
    var texto = hora + ":00";
    var boton = CrearElemento("button", "horario", texto);
    boton.type = "button";
    boton.disabled = !fechaElegida || (esHoy && hora <= ahora.getHours());
    boton.classList.toggle("elegido", texto === horaElegida);
    boton.setAttribute("aria-pressed", texto === horaElegida ? "true" : "false");
    boton.addEventListener("click", ElegirHora.bind(null, texto));
    contenedor.appendChild(boton);
  }
}

function ElegirHora(texto) {
  horaElegida = texto;
  DibujarHorarios();
  LimpiarError();
}

function LimpiarError() {
  document.getElementById("carrito-error").hidden = true;
}

function MostrarError(texto, campo) {
  var error = document.getElementById("carrito-error");
  error.textContent = texto;
  error.hidden = false;
  if (campo) campo.focus();
}

// ---------- Mensaje de WhatsApp ----------
function CalcularSenia(total) {
  return Math.round((total * DATOS_NEGOCIO.seniaPorcentaje) / 100);
}

function CrearMensaje(nombre) {
  var lineas = ["Hola! Soy " + nombre + ". Quiero reservar estos servicios:", ""];
  carrito.forEach(function (servicio) {
    var detalle = servicio.nombre;
    if (servicio.variante) detalle += " (" + servicio.variante + ")";
    detalle += " - " + servicio.categoria;
    if (servicio.duracion && servicio.duracion !== "—") detalle += " - " + servicio.duracion;
    lineas.push("• " + detalle + ": " + servicio.precio);
  });
  var suma = CalcularTotal();
  var desde = suma.desde ? "desde " : "";
  lineas.push("", "Total estimado: " + desde + FormatearPrecio(suma.total));
  lineas.push("Seña (" + DATOS_NEGOCIO.seniaPorcentaje + "%): " + desde + FormatearPrecio(CalcularSenia(suma.total)));
  lineas.push("", "Día elegido: " + TextoFecha(fechaElegida));
  lineas.push("Horario elegido: " + horaElegida + " hs");
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

  var dias = ["L", "M", "M", "J", "V", "S", "D"].map(function (letra) {
    return "<span>" + letra + "</span>";
  }).join("");

  panel.innerHTML =
    '<div class="carrito-cabecera">' +
      '<h2 class="carrito-titulo">Tus servicios</h2>' +
      '<button id="boton-cerrar-carrito" class="boton-icono" type="button" aria-label="Cerrar carrito">' + ICONO_CERRAR + "</button>" +
    "</div>" +
    '<form id="carrito-form" class="carrito-form" novalidate>' +
      '<div class="carrito-scroll">' +
        '<p id="carrito-vacio" class="carrito-vacio">Todavía no elegiste servicios. Tocá el <strong>+</strong> en los que te gusten.</p>' +
        '<ul id="carrito-lista" class="carrito-lista"></ul>' +
        '<div id="carrito-total" class="carrito-total" hidden>' +
          '<p id="carrito-total-texto"></p>' +
          '<p id="carrito-senia" class="carrito-senia"></p>' +
        "</div>" +
        '<div id="carrito-datos" class="carrito-datos">' +
          '<label class="carrito-campo">Tu nombre' +
            '<input id="carrito-nombre" type="text" autocomplete="off" placeholder="Ej: María" required>' +
          "</label>" +
          '<div class="carrito-campo"><span id="calendario-etiqueta">Elegí el día</span>' +
            '<div class="calendario" role="group" aria-labelledby="calendario-etiqueta">' +
              '<div class="calendario-cabecera">' +
                '<button id="calendario-anterior" class="calendario-flecha" type="button" aria-label="Mes anterior">‹</button>' +
                '<p id="calendario-titulo" class="calendario-titulo" aria-live="polite"></p>' +
                '<button id="calendario-siguiente" class="calendario-flecha" type="button" aria-label="Mes siguiente">›</button>' +
              "</div>" +
              '<div class="calendario-semana" aria-hidden="true">' + dias + "</div>" +
              '<div id="calendario-dias" class="calendario-dias"></div>' +
            "</div>" +
          "</div>" +
          '<div class="carrito-campo"><span id="horarios-etiqueta">Elegí el horario</span>' +
            '<div id="horarios" class="horarios" role="group" aria-labelledby="horarios-etiqueta"></div>' +
            '<p class="carrito-ayuda">Te confirmamos el turno por WhatsApp.</p>' +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div id="carrito-pie" class="carrito-pie">' +
        '<p id="carrito-error" class="carrito-error" role="alert" hidden></p>' +
        '<button type="submit" class="boton boton-primario carrito-enviar">Enviar por WhatsApp</button>' +
        '<button id="carrito-vaciar" class="carrito-vaciar" type="button">Vaciar carrito</button>' +
      "</div>" +
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

  document.getElementById("carrito-total").hidden = vacio;
  if (!vacio) {
    var suma = CalcularTotal();
    var desde = suma.desde ? "desde " : "";
    document.getElementById("carrito-total-texto").textContent = "Total estimado: " + desde + FormatearPrecio(suma.total);
    document.getElementById("carrito-senia").textContent = "Seña (" + DATOS_NEGOCIO.seniaPorcentaje + "%): " + desde + FormatearPrecio(CalcularSenia(suma.total));
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
  if (carrito.length === 0) return;

  var campoNombre = document.getElementById("carrito-nombre");
  var nombre = campoNombre.value.trim();
  if (!nombre) return MostrarError("Escribí tu nombre para continuar.", campoNombre);
  if (!fechaElegida) return MostrarError("Elegí el día en el calendario.");
  if (!horaElegida) return MostrarError("Elegí el horario.");

  LimpiarError();
  var enlace = "https://wa.me/" + DATOS_NEGOCIO.whatsappNumero + "?text=" + encodeURIComponent(CrearMensaje(nombre));
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
  document.getElementById("carrito-nombre").addEventListener("input", LimpiarError);

  var hoy = InicioDeHoy();
  mesVista = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  document.getElementById("calendario-anterior").addEventListener("click", function () {
    mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() - 1, 1);
    DibujarCalendario();
  });
  document.getElementById("calendario-siguiente").addEventListener("click", function () {
    mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 1);
    DibujarCalendario();
  });
  DibujarCalendario();
  DibujarHorarios();
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") CerrarCarrito();
  });

  // El nombre ya no se guarda: se borra el que haya quedado de antes
  try {
    localStorage.removeItem("vos-nombre");
  } catch (error) {
    // sin almacenamiento
  }
  ActualizarCarrito(false);
}

IniciarCarrito();
