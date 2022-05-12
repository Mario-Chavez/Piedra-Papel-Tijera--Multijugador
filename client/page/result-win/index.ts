import { state } from "../../state";

export function initResultWin(params) {
  const cs = state.getState();
  const result = state.returnScore();
  const div = document.createElement("div");
  if (cs.userNombre) {
    div.innerHTML = `
          <div class="reultado-page__titulo-conteiner">
    <text-el variant="title"><h1>Ganaste</h1></text-el>
  </div>
    <text-el variant="">vos = ${result.player1}</text-el>
    <text-el variant="">${cs.player2Nombre} = ${result.player2}</text-el>
  <div class="instructions__button-container">
     <boton-el class= "instructions__button-start" >! volver a jugar ¡</boton-el>
  </div>
      `;
    div.classList.add("instructions__main-div-container");

    const button = div.querySelector(".instructions__button-container");

    button.addEventListener("click", () => {
      state.restarPlayer1Rtdb(() => {
        params.goTo("/waiting");
      });
    });
  } else {
    div.innerHTML = `
          <div class="reultado-page__titulo-conteiner">
    <text-el variant="title"><h1>Ganaste</h1></text-el>
  </div>
    <text-el variant="">vos = ${result.player2}</text-el>
    <text-el variant="">${cs.usernombre} = ${result.player1}</text-el>
  <div class="instructions__button-container2">
     <boton-el class= "instructions__button-start" >! volver a jugar ¡</boton-el>
  </div>
      `;
    div.classList.add("instructions__main-div-container");

    const button = div.querySelector(".instructions__button-container2");

    button.addEventListener("click", () => {
      state.restarPlayer2Rtdb(() => {
        params.goTo("/waiting");
      });
    });
  }

  return div;
}
