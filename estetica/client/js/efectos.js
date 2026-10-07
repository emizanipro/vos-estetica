// Efectos de todas las páginas: aparición al hacer scroll y números que suben.
// Se carga al final, cuando las tarjetas y listas ya están dibujadas.

var MENOS_MOVIMIENTO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var PAUSA_ENTRE_ELEMENTOS = 0.09; // segundos entre una tarjeta y la siguiente

// Marca como "reveal" a los hijos de cada grupo, con un retraso escalonado
function PrepararGrupos() {
  document.querySelectorAll("[data-reveal-grupo]").forEach(function (grupo) {
    Array.prototype.forEach.call(grupo.children, function (hijo, posicion) {
      hijo.classList.add("reveal");
      hijo.style.setProperty("--retraso", (Math.min(posicion, 6) * PAUSA_ENTRE_ELEMENTOS) + "s");
    });
  });
}

// Muestra un elemento y, cuando termina la animación, le saca las clases de aparición
// (así sus efectos de "hover" vuelven a ser rápidos)
function MostrarElemento(elemento) {
  elemento.classList.add("visible");
  setTimeout(function () {
    elemento.classList.remove("reveal", "reveal-izquierda", "reveal-derecha", "reveal-zoom", "visible");
    elemento.style.removeProperty("--retraso");
  }, 1600);
}

// Hace aparecer los elementos cuando entran en pantalla
function IniciarAparicion() {
  var elementos = document.querySelectorAll(".reveal");
  if (MENOS_MOVIMIENTO || !("IntersectionObserver" in window)) {
    elementos.forEach(function (elemento) { elemento.classList.add("visible"); });
    return;
  }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      MostrarElemento(entrada.target);
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  elementos.forEach(function (elemento) { observador.observe(elemento); });
}

// Hace subir un número desde 0 hasta su valor
function AnimarContador(elemento) {
  var meta = Number(elemento.dataset.contador);
  if (!meta || MENOS_MOVIMIENTO) {
    elemento.textContent = meta || 0;
    return;
  }
  var inicio = null;
  var duracion = 1600;

  function Paso(tiempo) {
    if (inicio === null) inicio = tiempo;
    var avance = Math.min((tiempo - inicio) / duracion, 1);
    var suave = 1 - Math.pow(1 - avance, 3); // frena al final
    elemento.textContent = Math.round(meta * suave);
    if (avance < 1) requestAnimationFrame(Paso);
  }
  requestAnimationFrame(Paso);
}

// Los números empiezan a subir cuando se ven
function IniciarContadores() {
  var contadores = document.querySelectorAll("[data-contador]");
  if (!("IntersectionObserver" in window)) {
    contadores.forEach(function (c) { c.textContent = c.dataset.contador; });
    return;
  }
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      AnimarContador(entrada.target);
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.6 });
  contadores.forEach(function (c) { observador.observe(c); });
}

PrepararGrupos();
IniciarAparicion();
IniciarContadores();
