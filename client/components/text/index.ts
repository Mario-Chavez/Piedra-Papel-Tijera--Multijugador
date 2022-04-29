export function initTextComp() {
  class Textcomponent extends HTMLElement {
    constructor() {
      super();
      this.render();
    }

    render() {
      const variant = this.getAttribute("variant") || "body";
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");

      style.innerHTML = `
      .title{
        margin: 5vh auto;
        font-size: 10vh;
        text-align: center;
        font-family: 'Rampart One', cursive;
        color:#009048;

      }
      .body{
        font-size: 7vh;
        text-align: center;
        margin: 9vh auto;
        font-family: 'Odibee Sans', cursive;
      }
      
      .button-text{
        font-size: 22px;
        color: #9CBBE9;
        text-align: center;
        margin: 15px auto;
        font-family: 'Odibee Sans', cursive;
      }
      `;

      div.className = variant;
      div.textContent = this.textContent;
      shadow.appendChild(div);
      shadow.appendChild(style);
    }
  }
  customElements.define("text-el", Textcomponent);
}
