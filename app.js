const apiURL = "https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/217204583";
class Note {
  constructor(id, title, description, completed, priority, tag, dueDate) {
    this.id = id,
      this.title = title,
      this.description = description,
      this.completed = completed,
      this.priority = priority,
      this.tag = tag,
      this.dueDate = dueDate
  }
}

function displayTable(notes) {
  clearTable();

  showLoadingMessage();

  setTimeout(() => {
    if (notes.length === 0) {
      showNotFoundMessage();
    } else {
      hideMessage();

      const tablaBody = document.getElementById("data-body");

      notes.forEach((note) => {
        const row = document.createElement("div");
        row.className = `col`;
        row.innerHTML = `

            <div class="card shadow-sm">
              <div class="card-body prioridad-${note.priority}">
                <h5 class="d-inline-flex justify-content-between align-items-left card-title"><i class="fa-solid fa-circle-check"></i>&nbsp;
                ${note.title}</h5>
                <p class="card-text">${note.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      onclick="deleteData(${note.id})"
                    >
                      Eliminar
                    </button>
                  </div>
                  <small class="text-muted">${note.tag}</small>
                  <small class="text-muted">${note.dueDate}</small>
                </div>
              </div>

          </div>
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

  message.innerHTML = "No se encontraron Notas con el filtro proporcionado.";

  message.style.display = "block";
}

function showErrorMessage() {
  const message = document.getElementById("message");

  message.innerHTML = "Hubo un error al realizar la operación.";

  message.style.display = "block";
}

// Funcion que oculta mensaje
function hideMessage() {
  const message = document.getElementById("message");

  message.style.display = "none";
}

function initFormForEditing(id) {
  const noteInfo = searchItemData(id);
  
}

function initButtonsHandler() {
  document.getElementById("limpiar-button").addEventListener("click", () => {
    document.getElementById('noteForm').reset();
  });

  document.getElementById("add-button").addEventListener("click", (event) => {
    event.preventDefault();
    showAddSection();
    console.log("added")
  });

  document.getElementById('noteForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting as usual
    createNote(); // Call the createNote function to process the form data
  });
}

function showAddSection() {
  const currentSection = document.getElementById("current-section");
  if (currentSection.style.display === 'block') {
    currentSection.style.display = 'none';
  } else {
    currentSection.style.display = 'block';
  }

}

//#region Data Managing
function searchData() {
  const OPTIONS = {
    method: "GET",
  };

  fetch(`${apiURL}/tasks`, OPTIONS)
    .then((response) => response.json())
    .then((data) => {
      // Mapeamos los datos de modelos a objetos de la clase RealEstate.
      notesList = data.map((item) => {
        console.log(item);
        return new Note(item.id, item.title, item.description, item.completed, item.priority, item.tag, item.dueDate);
      });

      // Mostramos los datos en la vista.
      displayTable(notesList);
    })
    .catch((error) => console.log(error));
}

function searchItemData(id) {
  const OPTIONS = {
    method: "GET",
  };

  fetch(`${apiURL}/tasks/${id}`, OPTIONS)
    .then((response) => response.json())
    .then((data) => {
      // Mapeamos los datos de modelos a objetos de la clase RealEstate.
      notesList = data.map((item) => {
        return new Note(item.id, item.title, item.description, item.completed, item.priority, item.tag, item.dueDate);
      });
      // Mostramos los datos en la vista.
      displayTable(notesList);
    })
    .catch((error) => console.log(error));
}

function deleteData(id) {
  const OPTIONS = {
    method: "DELETE",
  };
  fetch(`${apiURL}/tasks/${id}`, OPTIONS)
    .then((res) => {
      if (res.ok) {
        showLoadingMessage();
        searchData();
        return res.json();
      }
      // handle error
    })
    .then((task) => {
      // Do something with deleted task
    })
    .catch((error) => {
      showErrorMessage()
    });
}

function updateData(id, title, description, completed, priority, tag, dueDate) {
  const currentNote = {
    form: form,
    title: title,
    description: description,
    completed: completed,
    priority: priority,
    tag: tag,
    dueDate: dueDate,
  }
  const OPTIONS = {
    method: "PUT",
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({currentNote})
  };
  fetch(`${apiURL}/tasks/${id}`, OPTIONS)
    .then((res) => {
      if (res.ok) {
        showLoadingMessage();
        searchData();
        return res.json();
      }
    })
    .then((task) => {
    })
    .catch((error) => {
      showErrorMessage()
    });
}

function createNote() {
  const form = document.getElementById('noteForm');
  const title = form.title.value;
  const description = form.description.value;
  const completed = form.completed.checked;
  const priority = form.priority.value;
  const tag = form.tag.value;
  const dueDate = form.dueDate.value;

  const newNote = {
    form: form,
    title: title,
    description: description,
    completed: completed,
    priority: priority,
    tag: tag,
    dueDate: dueDate,
  }

  console.log(newNote);
  fetch(`${apiURL}/tasks`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newNote)
  }).then(res => {
    if (res.ok) {
      searchData()
      return res.json();
    }
  }).then(task => {
  }).catch(error => {
    showErrorMessage()
  })

  form.reset();
  showAddSection();
}


searchData();

initButtonsHandler();
