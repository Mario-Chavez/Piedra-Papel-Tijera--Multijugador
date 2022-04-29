import { state } from "../../state";

export function initInstructions(params) {
  const div = document.createElement("div");
  const cs = state.data;
  div.innerHTML = `
     
      <div class="instructions__titulo-conteiner">
          <text-el variant="">!! Hola ${cs.userNombre} !!</text-el>
          <text-el>Invita a un amigo a jugar con este Id: ${cs.roomId}</text-el>
      </div>
      <div class="instructions__button-container">
         <boton-el class= "instructions__button-start" >! Jugar ¡</boton-el>
         <text-el class= "espera">esperando al aponente<text-el>
      </div>
      <div class="instructions__plays-container">
      <my-play class="welcome__play" type="piedra"></my-play>
      <my-play class="welcome__play" type="papel"></my-play>
      <my-play class="welcome__play" type="tijera"></my-play>
      </div>
  `;
  div.classList.add("instructions__main-div-container");

  const button = div.querySelector(".instructions__button-start");
  const starOponente = div.querySelector(".espera");

  button.setAttribute("style", "display:none");
  button.addEventListener("click", () => {
    state.readyPlayer1Rtdb(() => {
      params.goTo("/play");
    });
  });
  state.subscribe(() => {
    const cs = state.getState();
    if (cs.readyPlayer2 == true) {
      button.setAttribute("style", "display:inherit");
      starOponente.setAttribute("style", "display:none");
    }
  });
  return div;
}
