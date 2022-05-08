import { state } from "../../state";

export function initResultEmpate(params) {
  const cs = state.getState();
  const div = document.createElement("div");
  if (cs.userNombre) {
    div.innerHTML = `
         
    <div class="rersultado-page__titulo-conteiner">
            <text-el variant="title"><h1>Empate</h1></text-el>
        </div>
        <text-el variant="">Tira de vuelta</text-el>
      <div class="instructions__button-container">
       <boton-el class= "instructions__button-start" >! Volver a jugar ¡</boton-el>
      </div>
      
  `;
    div.classList.add("instructions__main-div-container");
    div.classList.add("instructions__main-div-container");

    const button = div.querySelector(".instructions__button-start");

    button.addEventListener("click", () => {
      state.tiePlayer1Rtdb();
    });
  } else {
    div.innerHTML = `
         
    <div class="rersultado-page__titulo-conteiner">
            <text-el variant="title"><h1>Empate</h1></text-el>
        </div>
        <text-el variant="">Tira de vuelta</text-el>
      <div class="instructions__button-container">
       <boton-el class= "instructions__button-start" >! Volver a jugar ¡</boton-el>
      </div>
      
  `;
    div.classList.add("instructions__main-div-container");
    div.classList.add("instructions__main-div-container");

    const button = div.querySelector(".instructions__button-start");

    button.addEventListener("click", () => {
      state.tiePlayer2Rtdb();
    });
  }
  const search = setInterval(() => {
    if (cs.tiePlayer1 == true && cs.tiePlayer2 == true) {
      clearInterval(search);
      params.goTo("/play");
    }
  });

  return div;
}
