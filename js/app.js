/** @format */

const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
  e.preventDefault();
  const terminoBusqueda = document.querySelector("#termino").value;

  if (terminoBusqueda === "") {
    mostrarAlerta("Ingrese algún término de búsqueda");
    return;
  }
  paginaActual = 1;
  buscarImagenes();
}

function mostrarAlerta(mensaje) {
  const noRepeatError = document.querySelector(".no--repeat--error");
  if (!noRepeatError) {
    const alerta = document.createElement("p");
    alerta.textContent = mensaje;
    alerta.classList.add(
      "bg-red-100",
      "border-re-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center",
      "no--repeat--error"
    );

    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function buscarImagenes() {
  const terminoBusqueda = document.querySelector("#termino").value;

  const key = "21500388-1c2641e06771623cf88905750";
  const url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&image_type=photo&per_page=${registrosPorPagina}&page=${paginaActual}`;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      totalPaginas = calcularPaginas(result.totalHits);
      console.log(url);
      mostrarImagenes(result.hits);
    });
}

// Generador que registra la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function mostrarImagenes(imagenes) {
  limpiarHTML();
  imagenes.forEach((imagen) => {
    const { previewURL, likes, views, largeImageURL } = imagen;

    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-1 mb-1">
        <div class="bg-white">
            <img class="w-full object-cover" src="${previewURL}">
            <p class="text-xs text-gray-600 p-2"><i class="fas fa-heart"></i> ${likes} | <i class="fas fa-eye"></i> ${views}
                <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" class="block p-1 mt-3 uppercase font-bold text-sm text-center bg-green-100 hover:bg-green-200">Ver Imagen</a>
        </div>
    </div>
    `;
  });

  // Limpiar el paginador anterior
  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild);
  }
  // Generar el nuevo paginador
  imprimirPaginador();
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registrosPorPagina));
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);
  while (true) {
    const { value, done } = iterador.next();

    if (done) {
      return;
    }

    // else > Que cree los botones del paginador
    const pageBtn = document.createElement("a");
    pageBtn.href = "#";
    pageBtn.dataset.pagina = value;
    pageBtn.textContent = value;
    pageBtn.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-10",
      "uppercase",
      "rounded"
    );

    pageBtn.onclick = () => {
      paginaActual = value;
      buscarImagenes();

      console.log(paginaActual);
    };

    paginacionDiv.appendChild(pageBtn);
  }
}
