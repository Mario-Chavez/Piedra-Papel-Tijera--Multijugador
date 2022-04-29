export function initBotonComp() {
  class BotonEl extends HTMLElement {
    constructor() {
      super();
      this.render();
    }

    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const contenido = this.textContent;

      const style = document.createElement("style");
      style.innerHTML = `
      .root{
        max-width:50vh;
        heigth: 8vh;
        margin: 2vh auto ;
      } 
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
      }
      
      
      `;

      const div = document.createElement("div");
      div.classList.add("root");

      div.innerHTML = `
      <button class="button">${contenido}</button>  
      `;
      shadow.appendChild(style);
      shadow.appendChild(div);
    }
  }
  customElements.define("boton-el", BotonEl);
}
