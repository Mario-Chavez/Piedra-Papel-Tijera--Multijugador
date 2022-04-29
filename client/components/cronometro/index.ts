import { relative } from "path";
import {} from "../../router";
export function initMyChronometer() {
  class MyChronometer extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }

    render() {
      const div = document.createElement("div");
      const style = document.createElement("style");
      let counter: number = 3;

      style.innerHTML = `
      .container{
        margin: 5vh auto;
        text-align: center;
        font-family: 'Rampart One', cursive;
        color:#009048;
      }
      .countdown{
        font-size: 35vh;
      }
      `;
      div.innerHTML = `
      <div class= "container">
      <span class="countdown">3</span>
      </div>
      `;

      const t = div.querySelector(".countdown");
      const itervalId = setInterval(() => {
        t.textContent = counter.toString();
        if (counter == 0) {
          clearInterval(itervalId);
          div.style.opacity = "0";
          div.style.position = "relative";
          div.style.border = "solid:2px";
        }
        counter--;
      }, 1000);

      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
  customElements.define("my-chronometer", MyChronometer);
}
