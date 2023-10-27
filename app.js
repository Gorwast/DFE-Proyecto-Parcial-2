const apiURL = "https://65359710c620ba9358ec9353.mockapi.io";
class Note {
  constructor(id, createdAt, content) {
    this.id = id;
    this.createdAt = createdAt;
    this.content = content;
  }
}

// Creamos objetos de modelos de casas
const note1 = new Note(
  1,
  "21/06/2023",
  "Hermosa casa con vistas panorámicas.",
);

//#region VISTA DE LOS MODELOS EN HTML (VIEW)

// Funcion que controla el despliegue de un array de Note en la tabla, asi como el mensaje a mostrar.
function displayTable(notes) {
  clearTable();

  showLoadingMessage();

  setTimeout(() => {
    if (notes.length === 0) {
      showNotFoundMessage();
    } else {
      hideMessage();

      const tablaBody = document.getElementById("data-body");

      const imagePath = `/img/notes`;

      notes.forEach((note) => {
        const row = document.createElement("tr");

        row.innerHTML = `
              <p> ${note.id} </p>
              <p>${note.createdAt}</p>
              <p>${note.content}</p>
            `;

        tablaBody.appendChild(row);
      });
    }
  }, 2000);
}

// Funcion que limpia la tabla
function clearTable() {
  const tableBody = document.getElementById("data-body");

  tableBody.innerHTML = "";
}

// Funcion que muestra mensaje de carga
function showLoadingMessage() {
  const message = document.getElementById("message");

  message.innerHTML = "Cargando...";

  message.style.display = "block";
}

// Funcion que muestra mensaje de que no se encuentraron datos
function showNotFoundMessage() {
  const message = document.getElementById("message");

  message.innerHTML = "No se encontraron Juegos con el filtro proporcionado.";

  message.style.display = "block";
}

// Funcion que oculta mensaje
function hideMessage() {
  const message = document.getElementById("message");

  message.style.display = "none";
}

//#endregion

//#region FILTROS (VIEW)

// Funcion que inicializa los eventos de los botones del filto
function initButtonsHandler() {
  document.getElementById("filter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  document.getElementById("reset-filters").addEventListener("click", () => {
    document
      .querySelectorAll("input.filter-field")
      .forEach((input) => (input.value = ""));
    applyFilters();
  });
}

// Funcion que gestiona la aplicacion del filtro a los datos y su despliegue.
function applyFilters() {
  const filterText = document.getElementById("text").value.toLowerCase();
  const filterrating = parseFloat(document.getElementById("rating").value);
  const filterMinPrice = parseFloat(document.getElementById("price-min").value);
  const filterMaxPrice = parseFloat(document.getElementById("price-max").value);

  const filterednotes = filternotes(
    noteList,
    filterText,
    filterrating,
    filterMinPrice,
    filterMaxPrice
  );

  displayTable(filterednotes);
}

// Funcion con la logica para filtrar las casas.
function filterNotes(notes, text, rating, minPrice, maxPrice) {
  return notes.filter(
    (note) =>
      (!rating || note.rating === rating) &&
      (!minPrice || note.price >= minPrice) &&
      (!maxPrice || note.price <= maxPrice) &&
      (!text ||
        note.name.toLowerCase().includes(text) ||
        note.description.toLowerCase().includes(text))
  );
}

function searchData() {
  const OPTIONS = {
    method: "GET",
  };

  fetch(`${apiURL}/note`, OPTIONS)
    .then((response) => response.json())
    .then((data) => {
      // Mapeamos los datos de modelos a objetos de la clase RealEstate.
      notesList = data.map((item) => {
        return new Note(
          item.id,
          item.createdAt,
          item.content
        );
      });

      // Mostramos los datos en la vista.
      displayTable(notesList);
    })
    .catch((error) => console.log(error));
}

searchData();

initButtonsHandler();