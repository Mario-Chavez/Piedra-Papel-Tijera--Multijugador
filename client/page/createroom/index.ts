import { state } from "../../state";

export function initCreateRoom(params) {
  const div = document.createElement("div");
  div.innerHTML = `
      <div class="instructions__titulo-conteiner">
        <text-el variant="">Escribe tu nombre y Presiona Nuevo juego.</text-el>
      </div>

      <form class="createRoom__input">
      <input type="text" class="createRoom__input-nombre" placeholder="Tu Nombre" name="nombre">
      
      
      <button class= "button" >Nuevo Juego</button>
      
      </form>
    
      
      <div class="welcome-page__plays-container">
      <my-play class="welcome__play" type="piedra"></my-play>
      <my-play class="welcome__play" type="papel"></my-play>
      <my-play class="welcome__play" type="tijera"></my-play>
      </div>
  `;
  div.classList.add("welcome__main-div-container");

  const formEl = div.querySelector(".createRoom__input");

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const target = e.target as any;
    const nameValue = target.nombre.value;
    state.setNameUser1(nameValue);
    state.signUp((err) => {
      if (err) console.log(err);
      state.askNewRoom(() => {
        state.setNamePlayer1Rtdb(() => {
          params.goTo("/instructions");
          state.accessToRoom();
        });
      });
    });
  });
  const stylepush = document.createElement("style");
  stylepush.innerHTML = `
  .button{
    width: 100%;                
    padding:2px 10px;
    margin-top:3px
    border: solid 2px black;
    border-radius: 5px;
    background-color: #006CFC;
    font-family: 'Odibee Sans', cursive;
    font-size:30px;
    color: white;
    margin: 2vh auto ;
    max-width: 50vh;
  }
    
  `;
  div.appendChild(stylepush);
  return div;
}
