import { state } from "../../state";

export function initPlayGame(params) {
  const cs = state.getState();
  const countDown: number = 3; //aqui aumente a 4
  const div = document.createElement("div");
  div.classList.add("game__game-container");
  div.innerHTML = `
    <my-chronometer>${countDown}</my-chronometer>
    <div class="game__player-plays-container">
    <my-play class="welcome__play" type="piedra"></my-play>
    <my-play class="welcome__play" type="papel"></my-play>
    <my-play class="welcome__play" type="tijera"></my-play>
    </div>
    `;

  // timesUp modifica la div principal cuando termina el contador
  function timesUp() {
    div.innerHTML = `
               <text-el variant="title"><h1>Pasó el tiempo </h1></text-el>
               </div>
                <div class="instructions__titulo-conteiner">
                    <text-el variant="">Elige antes de los 3 segundos.</text-el>
                </div>
                <div class="instructions__button-container">
                <boton-el class= "instructions__button-start" >! Volver a jugar ¡</boton-el>
               </div>
               
        `;
    const goToGameButton = div.querySelector(".instructions__button-container");

    goToGameButton.addEventListener("click", () => {
      params.goTo("/play");
    });
  }

  // showBothPlays muestra ambas jugadas en la pantalla y analiza si se empató, perdió, o ganó.
  // guarda las jugadas en el state y el resultado si es ganador o perdedor, si se empata, reinicia el juego.

  function showBothPlays(playerPlayEl) {
    // console.log("me llego la juda a showBoth1", playerPlay);
    // state.listenRoomPlayer2();15/4
    state.setGame(playerPlayEl);

    state.movePlayer1Rtdb(() => {
      // console.log("mande el movimiento al db ", cs.currentGame.player1move);

      const searchMove = setInterval(() => {
        if (
          cs.currentGame.player2move != "" &&
          cs.currentGame.player1move != ""
        ) {
          clearInterval(searchMove);
          params.goTo("/playResults");
        } else {
          console.log("no tiene jugada el player2");
        }
      }, 1500); //baje el tiempo
    });
  }

  function showBothPlays2(playerPlayEl) {
    // state.listenRoomPlayer1(); 15/4
    state.setGame2(playerPlayEl);

    state.movePlayer2Rtdb(() => {
      console.log("mande el movimiento al db ", cs.currentGame.player2move);
      const searchMove2 = setInterval(() => {
        if (
          cs.currentGame.player1move != "" &&
          cs.currentGame.player2move != ""
        ) {
          clearInterval(searchMove2);
          params.goTo("/playResults");
        } else {
          console.log("no tiene jugada el player1");
        }
      }, 1500);
    });
  }

  /* aqui iria el style */
  const style = document.createElement("style");
  style.innerHTML = `
       .player-play.selected {
           animation: move-up 400ms forwards;
       }
       @keyframes move-up {
           0% {
               opacity: 0.5;
               transform: translateY(0);
           }
           100% {
               opacity: 1;
               transform: translateY(-40px);
           }
       }
       .player-play{
           position: relative;
           top: 20px;
           opacity: 0.5;
        }
       
       .game__player-plays-container{
         display: flex;
         justify-content: center;
         text-align: center;
         margin: 0 auto;
         gap: 20px;
         grid-template-columns: 1fr 1fr 1fr;
         max-width: 70vh;
      
        }
        `;
  // selleciona un div
  div.querySelector(".game__player-plays-container").appendChild(style);

  const playerPlaysArray = div.querySelector(
    ".game__player-plays-container"
  ).children;

  // Agrego los event listeners a cada una de las jugadas de el/la jugador/a,
  // y agrega la clase "selected"
  for (let p of playerPlaysArray) {
    p.classList.add("player-play");
    p.addEventListener("click", (e) => {
      const thisPlayEl: any = e.target;
      if (thisPlayEl.classList.contains("selected")) {
        thisPlayEl.classList.remove("selected");
      } else {
        for (let i of playerPlaysArray) {
          if (i.classList.contains("selected")) {
            i.classList.remove("selected");
          }
        }
        thisPlayEl.classList.add("selected");
      }
    });
  }

  /* 
  crea un nuevo cuenta regresiva despendienso si el jugador eligio o no, y realiza diferentes acciones
  podriamos hacer una funcion igual para dar tiempo a que  comunique mi page a firebase asi ya queda guaradada los move
  */
  if (cs.currentGame.player1move == "" && cs.currentGame.player2move == "") {
    setTimeout(() => {
      console.log("entre al setTimeOut");

      let timer = 2;
      let playerPlayEl: any = div.querySelector(".selected") || "none";

      const time = setInterval(() => {
        timer--;
        if (timer == 0 && playerPlayEl == "none") {
          //si es none lo manda de vuelta a elegir o a l inicio de la pagina para que elija
          clearInterval(time);
          timesUp();
        } else if (timer == 0) {
          // aqui manda a showboth lo que eligio
          //si es player1
          if (cs.userNombre) {
            showBothPlays(playerPlayEl.type);
            clearInterval(time);
          }
          // si es player2
          if (cs.usernombre) {
            showBothPlays2(playerPlayEl.type);
            clearInterval(time);
          }
        }
      }, 1000);
    }, 4000); // puse 4 segundo 12/04
  }

  return div;
}
