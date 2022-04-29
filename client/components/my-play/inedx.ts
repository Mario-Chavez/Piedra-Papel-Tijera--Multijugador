const imgPapel = require("url:../img/papel.png");
const imgTijera = require("url:../img/tijeras.png");
const imgPiedra = require("url:../img/piedra.png");

export function initMyPlay() {
  class MyPlay extends HTMLElement {
    shadow: ShadowRoot;
    type: string;
    opponent: boolean = false;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.type = this.getAttribute("type");
      this.opponent = JSON.parse(this.getAttribute("opponent")) || false;
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const style = document.createElement("style");
      style.innerHTML = `
            .rotate{
                transform: scaleY(-1);
              }
              
              .play{
                width: 15vh;
                height: 28vh;
              }  
            `;
      const play = document.createElement("img");

      if (this.type == "tijera") {
        play.src = imgTijera;
      } else if (this.type == "papel") {
        play.src = imgPapel;
      } else {
        play.src = imgPiedra;
      }
      if (this.opponent == true) {
        play.classList.add("rotate");
      }
      play.classList.add("play");
      this.shadow.appendChild(style);
      this.shadow.appendChild(play);
    }
  }
  customElements.define("my-play", MyPlay);
}
