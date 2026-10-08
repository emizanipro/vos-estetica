// Página de cuidados: una tarjeta por categoría con lo que conviene hacer antes y después

function CrearLista(items) {
  var lista = CrearElemento("ul", "cuidado-items");
  items.forEach(function (texto) {
    lista.appendChild(CrearElemento("li", "", texto));
  });
  return lista;
}

function DibujarCuidados() {
  var contenedor = document.getElementById("cuidados-lista");
  SERVICIOS.forEach(function (servicio) {
    var datos = CUIDADOS[servicio.id];
    if (!datos) return;
    var tarjeta = CrearElemento("article", "cuidado reveal");
    tarjeta.id = "cuidados-" + servicio.id;
    tarjeta.appendChild(CrearElemento("h2", "cuidado-titulo", servicio.nombre));
    tarjeta.appendChild(CrearElemento("h3", "cuidado-subtitulo", "Antes del turno"));
    tarjeta.appendChild(CrearLista(datos.antes));
    tarjeta.appendChild(CrearElemento("h3", "cuidado-subtitulo", "Después del turno"));
    tarjeta.appendChild(CrearLista(datos.despues));
    contenedor.appendChild(tarjeta);
  });
}

DibujarCuidados();
