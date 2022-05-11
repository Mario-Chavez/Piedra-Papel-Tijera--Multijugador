import { state } from "../../state";

export function initPlayGame(params) {
  const cs = state.getState();
  const countDown: number = 3;
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
    //player1
    if (cs.userNombre) {
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
      const goToGameButton = div.querySelector(
        ".instructions__button-container"
      );

      goToGameButton.addEventListener("click", () => {
        params.goTo("/play");
      });
    } //player2
    else {
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
      const goToGameButton = div.querySelector(
        ".instructions__button-container"
      );

      goToGameButton.addEventListener("click", () => {
        params.goTo("/play");
      });
    }
  }

  // showBothPlays se encarga de verificar si los dos player juaron para mandarlos a playResults.

  function showBothPlays() {
    const searchMove = setInterval(() => {
      if (cs.currentGame.player2move != "") {
        clearInterval(searchMove);
        params.goTo("/playResults");
      } else {
        clearInterval(searchMove);
        params.goTo("/waitingPlay");
      }
    }, 1500);
  }

  function showBothPlays2() {
    const searchMove2 = setInterval(() => {
      if (cs.currentGame.player1move != "") {
        clearInterval(searchMove2);
        params.goTo("/playResults");
      } else {
        clearInterval(searchMove2);
        params.goTo("/waitingPlay");
      }
    }, 1500);
  }

  /*  style */
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

  // Agrego los event listeners a cada una de las jugadas de el jugador
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
  crea un nuevo cuenta regresiva despendienso si el jugador eligio o no, y realiza diferentes acciones  */
  setTimeout(() => {
    let timer = 2;
    let playerPlayEl: any = div.querySelector(".selected") || "none";

    const time = setInterval(() => {
      timer--;
      if (timer == 0 && playerPlayEl == "none") {
        //si no elige manda a elegir de vuelta
        clearInterval(time);
        timesUp();
      } else if (timer == 0) {
        //si es player1
        if (cs.userNombre) {
          clearInterval(time);
          //gurdo jugada en el state
          state.setGame(playerPlayEl.type);
          //seteo en mi base de datos
          state.movePlayer1Rtdb(() => {
            showBothPlays();
          });
        }
        // si es player2
        if (cs.usernombre) {
          clearInterval(time);
          state.setGame2(playerPlayEl.type);
          //seteo en mi base de datos
          state.movePlayer2Rtdb(() => {
            showBothPlays2();
          });
        }
      }
    }, 1000);
  }, 4000);

  return div;
}
