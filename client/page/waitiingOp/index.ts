import { state } from "../../state";

export function initWaitingOpp(params) {
  console.log("entre a Waiting");

  const cs = state.getState();
  const div = document.createElement("div");
  if (cs.userNombre) {
    div.innerHTML = `
    <div class="welcome-page__titulo-conteiner">
            <text-el variant="title"><h2>Esperando al Oponente ...</h2></text-el>
            <text-el variant="title"><h2>${cs.player2Nombre}</h2></text-el>
            </div>
            <div class="welcome-page__plays-container">
            <my-play class="welcome__play" type="piedra"></my-play>
            <my-play class="welcome__play" type="papel"></my-play>
            <my-play class="welcome__play" type="tijera"></my-play>
            </div>
            `;
    const intId = setInterval(() => {
      if (cs.playRestar2 == true && cs.playRestar1 == true) {
        if (
          cs.currentGame.player1move == "" &&
          cs.currentGame.player2move == ""
        ) {
          // console.log("entre a restar player1 // player2 (vacio los current)");
          clearInterval(intId);
          setTimeout(() => {
            params.goTo("/play");
          }, 1000);
        } else {
          console.log("no esta el current vacio ");
        }
      } else {
        console.log("esperando a q los 2 player esten listos");
      }
    }, 2000);
  } else {
    div.innerHTML = `
            <div class="welcome-page__titulo-conteiner">
            <text-el variant="title"><h2>Esperando al Oponente ...</h2></text-el>
            <text-el variant="title"><h2>${cs.usernombre}</h2></text-el>
        </div>
    <div class="welcome-page__plays-container">
    <my-play class="welcome__play" type="piedra"></my-play>
    <my-play class="welcome__play" type="papel"></my-play>
    <my-play class="welcome__play" type="tijera"></my-play>
    </div>
            `;
    const intId = setInterval(() => {
      if (cs.playRestar2 == true && cs.playRestar1 == true) {
        if (
          cs.currentGame.player1move == "" &&
          cs.currentGame.player2move == ""
        ) {
          // puse este setTimeOut para darle tiempo despues de la segunda jugada a ver si recibe los datos del state
          // y poder jugar mas de 2 partidas
          // console.log(
          //   "entre a restar player1 // player2 (vacio los current en waiiting)"
          // );
          clearInterval(intId);
          setTimeout(() => {
            params.goTo("/play");
          }, 1500);
        } else {
          console.log("no esta el current vacio ");
        }
      } else {
        console.log("esperando a q los 2 player esten listos");
      }
    }, 2000);
  }

  return div;
}
