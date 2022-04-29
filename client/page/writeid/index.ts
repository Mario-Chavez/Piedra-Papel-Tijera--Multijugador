import { state } from "../../state";

export function initWriteId(params) {
  const cs = state.getState(); // siempre iniciar el stado

  const div = document.createElement("div");
  div.innerHTML = `
     
      <div class="welcome-page__titulo-conteiner">
          <text-el variant="title"><h1>Piedra, Papel ó Tijera</h1></text-el>
      </div>
      
      <form class="write__input">

      <input type="text" class="writeid__input-nombre" placeholder="Escribe tu Nombre" name="nombre">
      
      <input type="text" class="writeid__input-roomId" placeholder="Escribe tu RoomId" name="roomId">
    

      <button class= "button" >Comenzar</button>
      
      </form>
      
      <div class="welcome-page__plays-container">
      <my-play class="welcome__play" type="piedra"></my-play>
      <my-play class="welcome__play" type="papel"></my-play>
      <my-play class="welcome__play" type="tijera"></my-play>
      </div>
  `;
  div.classList.add("welcome__main-div-container");

  const formEl = div.querySelector(".write__input");

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const target = e.target as any;
    const nameValue = target.nombre.value;
    const idValue = target.roomId.value;
    state.setNameUser2(nameValue);
    state.signUp2((err) => {
      if (err) console.log("este es el error del signup de writeId", err);
      state.accessToRoomPlayer2(idValue as HTMLInputElement, () => {
        state.setNamePlayer2Rtdb(() => {
          state.readyPlayer2Rtdb(() => {});
        });
      });
    });
  });
  state.subscribe(() => {
    const cs = state.getState();
    if (cs.readyPlayer1 == true) {
      if (cs.usernombre) {
        params.goTo("/play");
      }
    }
  });
  const stylepush = document.createElement("style");
  stylepush.innerHTML = `
  .button{
    width: 100%; 
    max-width: 50vh;
    padding:2px 10px;
    margin-top:3px
    border: solid 2px black;
    border-radius: 5px;
    background-color: #006CFC;
    font-family: 'Odibee Sans', cursive;
    font-size:30px;
    color: white;
    margin: 2vh auto ;
  }
    
  `;
  div.appendChild(stylepush);
  return div;
}
