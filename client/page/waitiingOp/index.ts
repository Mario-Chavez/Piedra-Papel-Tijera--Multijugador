import { state } from "../../state";

export function initWaitingOpp(params) {
  const cs = state.getState();
  const div = document.createElement("div");
  //player1
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
          clearInterval(intId);
          setTimeout(() => {
            params.goTo("/play");
          }, 1000);
        }
      }
    }, 2000);
  } else {
    //player2
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
          clearInterval(intId);
          setTimeout(() => {
            params.goTo("/play");
          }, 1500);
        }
      }
    }, 2000);
  }

  return div;
}
