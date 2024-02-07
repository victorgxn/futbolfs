// ---------
// URL de las APIs / id equipo
// ---------

const urlProximoPartidos = "https://www.jaimeweb.es/medac/victorg/partidosPorJornada.json";
const urlJugadores = "https://www.jaimeweb.es/medac/victorg/plantilla.json";
const urlEquipos = "https://www.jaimeweb.es/medac/victorg/equipos.json";


function mainFunction() {
  const teamID = sessionStorage.getItem("idEquipo");
  maxStats(teamID);
  playersBoard(teamID);
  nextMatchBoard(teamID);
}


// ---------
// Mostrar todo en el apatartado del equipo
// ---------

async function findTeam(teamID) {
  try {
    const response = await fetch(urlEquipos);
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }
    const data = await response.json();
    const equipos = data.team;

    for (let i = 0; i < equipos.length; i++) {
      if (equipos[i].id == teamID) {
        return equipos[i];
      }
    }
  } catch (error) {
    console.error("Victor-g dice -->", error.message);
  }
}

async function teamBoard(arrMaximos, teamID) {
  try {
    const colgarEquipo = document.getElementById('colgar-equipo');
    const equipo = await findTeam(teamID);

    console.log(equipo);
    colgarEquipo.innerHTML = `  
      <!-- Escudo del equipo -->
      <div class="text-center">
      <img src="${equipo.shield_png}" alt="Descripción de la imagen" class="img-fluid">
    </div>
      <!-- Nombre del equipo -->
      <h3 class="text-center mt-2 mb-4">${equipo.fullName}</h3>
      <div class="center-text-fields">
        <!-- Campos de texto adicionales centrados -->
        <p class="text-left"><strong>Máximo Goleador:</strong> <span id="maxGoleador">${arrMaximos[0][0]} - ${arrMaximos[0][1]}</span></p>
        <p class="text-right"><strong>Máximo Asistente:</strong> <span id="maxAsistente">${arrMaximos[1][0]} - ${arrMaximos[1][1]} </span></p>
        <p class="text-right"><strong>Máximo Minutos Jugados:</strong> <span id="maxMinutosJugados">${arrMaximos[2][0]} - ${arrMaximos[2][1]}</span></p>
      </div>`;
  } catch (error) {
    console.error("Error en teamBoard:", error.message);
  }
}

//!Explicacion async await abajo 

// ---------
// Calcular las estadisticas maximas
// ---------

function maxStats(teamID) {
  fetch(urlJugadores)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }
      return response.json();
    })
    .then((data) => {
      const jugadores = data.players;
      const arrMaximos = [["No hay máximo goleador", 0], ["No hay máximo asistente", 0], ["No hay máximo en minutos", 0]];

      jugadores.forEach((jugador) => {
        // [nombre, goles, asistencias, minutos]
        if (parseInt(jugador.goals) > arrMaximos[0][1]) {
          arrMaximos[0][0] = jugador.nick;
          arrMaximos[0][1] = parseInt(jugador.goals);
        }

        if (parseInt(jugador.assists) > arrMaximos[1][1]) {
          arrMaximos[1][0] = jugador.nick;
          arrMaximos[1][1] = parseInt(jugador.assists);
        }

        if (parseInt(jugador.minutes) > arrMaximos[2][1]) {
          arrMaximos[2][0] = jugador.nick;
          arrMaximos[2][1] = parseInt(jugador.minutes);
        }
      });

      teamBoard(arrMaximos, teamID);
    })
    .catch((error) => {
      console.error("Victor-g dice -->", error.message);
    });
}




// ---------
// Mostrar todos los jugadores del equipo
// ---------

function playersBoard(teamID) {
  fetch(urlJugadores)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }
      return response.json();
    })
    .then((data) => {
      const jugadores = data.players;
      jugadores.forEach(jugador => {
        createPlayer(jugador);
      });
    })
    .catch((error) => {
      console.error("Victor-g dice -->", error.message);
    });
}

// ---------
// Funcion aux sacar jugador a la pagina
// ---------

function createPlayer(jugador) {
  const colgarJugadores = document.getElementById('colgar-jugadores');
  colgarJugadores.innerHTML += `<div class="col-md-4">
  <div class="card mb-3 jugador-card">
    <img src="${jugador.image}"
      class="card-img-top rounded-circle mx-auto jugador-img border mt-2" alt="Jugador 1">
    <div class="card-body text-center">
      <div class="row">
        <h6>${jugador.nick}</h6>
        <hr>
        <div class="col-md-6">
          <p class="h6 mb-2">Altura</p>
          <p id="altura" class="text-center">${jugador.height}</p>
        </div>
        <div class="col-md-6">
          <p class="h6 mb-2">Peso</p>
          <p id="peso" class="mb-2 text-center">${jugador.weight}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <p class="h6 mb-2">Minutos</p>
          <p id="minutos" class="text-center">${jugador.minutes}</p>
        </div>
        <div class="col-md-6">
          <p class="h6 mb-2">Rating</p>
          <p id="rating" class="mb-2 text-center">${jugador.rating}</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ---------
// Mostrar los datos del siguiente partido del equipo
// ---------

function nextMatchBoard(teamID) {
  fetch(urlProximoPartidos)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }
      return response.json();
    })
    .then((data) => {
      //console.log(data.match);
      const partidos = data.match;
      for (let i = 0; i < data.match.length; i++) {
        if (partidos[i].dteam1 == teamID) {
          return createMatchBoard(partidos[i]);
        }
      }
    })
    .catch((error) => {
      console.error("Victor-g dice -->", error.message);
    });
}

// ---------
// Funcion aux nextMatchBoard
// ---------

function createMatchBoard(partido) {
  //console.log(partido);
  const colgarPartido = document.getElementById('colgar-proximoPartido');
  colgarPartido.innerHTML = ` <div class="partido-container">
  <img
    src="${partido.local_shield}"
    alt="Equipo 1" class="img-fluid" width="50">
  <span class="h2">VS</span>
  <img
    src="${partido.visitor_shield}"
    alt="Equipo 2" class="img-fluid" width="50">
</div>
<hr>
<!-- Campos de texto para el próximo partido -->
<div class="row">
  <div class="col-md-6">
    <h4 class="text-center">Fecha</h4>
    <p id="fecha" class="mb-2 text-center">${partido.date}</p>
  </div>
  <div class="col-md-6">
    <h4 class="text-center">Estadio</h4>
    <p id="lugar" class="mb-2 text-center">${partido.stadium}</p>
  </div>
</div>
<div class="platform-container">
  <hr>
  <h4 class="text-center">Plataformas de visionado</h4>
  <!-- Imágenes de la plataforma -->
  <div class="jugadores-container">
    <img src="${partido.channels[0].image}" alt="Plataforma 1" class="platform-img">
    <img src="${partido.channels[1].image}" alt="Plataforma 2" class="platform-img">
    <img src="${partido.channels[2].image}" alt="Plataforma 3" class="platform-img">
    <img src="${partido.channels[3].image}" alt="Plataforma 4" class="platform-img">
  </div>
</div>`;
}

mainFunction();

//? Utilizamos async/await para hacer que findTeam sea asíncrona y, por lo tanto, espera a que la promesa se resuelva antes de continuar con la ejecución de teamBoard.