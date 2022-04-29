export function initWelcome(params) {
  const div = document.createElement("div");
  div.innerHTML = `
     
      <div class="welcome-page__titulo-conteiner">
          <text-el variant="title"><h1>Piedra, Papel ó Tijera</h1></text-el>
      </div>
      <div class="welcome-page__button-container">
         <boton-el class= "welcome__button-start" >Nuevo Juego</boton-el>
      </div>
      <div class="">
         <boton-el class= "welcome__button-start-id" >Numero de Sala</boton-el>
      </div>
      
      <div class="welcome-page__plays-container">
      <my-play class="welcome__play" type="piedra"></my-play>
      <my-play class="welcome__play" type="papel"></my-play>
      <my-play class="welcome__play" type="tijera"></my-play>
      </div>
  `;
  div.classList.add("welcome__main-div-container");

  const button = div.querySelector(".welcome__button-start");
  const buttonId = div.querySelector(".welcome__button-start-id");

  button.addEventListener("click", () => {
    params.goTo("/createroom");
  });
  buttonId.addEventListener("click", () => {
    params.goTo("/writeId");
  });

  return div;
}
