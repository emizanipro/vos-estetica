// Aviso de almacenamiento: informa qué guarda la web en el dispositivo y se cierra con "Entendido".
// Si más adelante se agregan estadísticas o publicidad, acá se deben sumar las opciones de aceptar o rechazar.

var CLAVE_AVISO = "vos-aviso";

function AvisoYaVisto() {
  try {
    return localStorage.getItem(CLAVE_AVISO) === "si";
  } catch (error) {
    return false;
  }
}

function DibujarAviso() {
  if (AvisoYaVisto()) return;

  var aviso = CrearElemento("div", "aviso");
  aviso.setAttribute("role", "region");
  aviso.setAttribute("aria-label", "Aviso de privacidad");
  aviso.innerHTML =
    "<p>Esta web guarda en tu dispositivo solo lo necesario para funcionar (tu carrito). " +
    'No usamos cookies de publicidad ni de seguimiento. <a href="' + PAGINA_PRIVACIDAD + '">Más información</a></p>';

  var boton = CrearElemento("button", "boton boton-primario boton-chico aviso-boton", "Entendido");
  boton.type = "button";
  boton.addEventListener("click", function () {
    try {
      localStorage.setItem(CLAVE_AVISO, "si");
    } catch (error) {
      // sin almacenamiento: el aviso vuelve a salir en la próxima visita
    }
    aviso.remove();
  });
  aviso.appendChild(boton);
  document.body.appendChild(aviso);
}

DibujarAviso();
