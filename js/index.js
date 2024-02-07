// ---------
// URL de la API
// ---------

const rankingURL = "https://www.jaimeweb.es/medac/victorg/clasificacion.json";

function fetchAndDisplayTeams() {
  fetch(rankingURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }
      return response.json();
    })
    .then((data) => {
      createTable(data.table);
    })
    .catch((error) => {
      console.error("Victor-g dice -->", error.message);
    });
}

// -----------------
// Crear tabla
// -----------------

function createTable(data) {
  // Array de propiedades para filtrar y mostrar en la tabla
  const filterArr = [
    "shield",
    "team",
    "points",
    "round",
    "wins",
    "losses",
    "draws",
  ];

  const tbody = document.getElementById("clasificacion");

  let positionCounter = 1;
  for (let i = 0; i < data.length; i++) {
    // Objeto para almacenar datos filtrados y posición
    const filteredData = { position: positionCounter++ };

    filterArr.forEach((key) => {
      if (data[i][key] !== undefined) {
        filteredData[key] = data[i][key];
      }
    });
    //Creamos la propiedad boton al final de filteredData
    filteredData.button = "button";
    const teamData = createTeam(filteredData, data);
    tbody.appendChild(teamData);
    //Añadir evento click para todos los botones
  }
  linkEventsToButtons();
}

// -----------------
// Crear celda de cada equipo
// -----------------

function createTeam(filteredData, data) {
  const tr = document.createElement("tr");
  let numPuesto = 0;

  for (const key in filteredData) {
    const td = document.createElement("td");
    if (key === "position") {
      numPuesto = filteredData[key] - 1;
    }
    if (key === "shield") {
      const img = document.createElement("img");
      img.setAttribute("src", filteredData[key]);
      td.appendChild(img);
    } else if (key === "button") {
      const button = document.createElement("button");
      button.value = data[numPuesto].id;
      button.innerHTML = "Ver informacion";
      td.appendChild(button);
    } else {
      td.innerText = filteredData[key];
    }
    tr.appendChild(td);
  }
  return tr;
}

// -----------------
// Funcion addEventListener para cada boton
// -----------------

function linkEventsToButtons() {
  const buttons = document.querySelectorAll("tbody button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      sessionStorage.setItem("idEquipo", event.target.value);
      location.href = "equipo.html";
    });
  });
}

fetchAndDisplayTeams();
