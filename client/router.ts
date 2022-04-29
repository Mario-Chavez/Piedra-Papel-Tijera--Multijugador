import { initWelcome } from "./page/welcome/index";
import { initWriteId } from "./page/writeid/index";
import { initCreateRoom } from "./page/createroom/index";
import { initInstructions } from "./page/instructions/index";
import { initPlayGame } from "./page/play/index";
import { initResultLose } from "./page/result-lose";
import { initResultWin } from "./page/result-win";
import { initResultEmpate } from "./page/game";
import { initPlayGameResult } from "./page/plays-results";
import { initWaitingOpp } from "./page/waitiingOp";
const routes = [
  {
    path: /\/welcome/,
    handler: initWelcome,
  },
  {
    path: /\/createroom/,
    handler: initCreateRoom,
  },
  {
    path: /\/writeId/,
    handler: initWriteId,
  },

  {
    path: /\/instructions/,
    handler: initInstructions,
  },
  {
    path: /\/play/,
    handler: initPlayGame,
  },
  {
    path: /\/waiting/,
    handler: initWaitingOpp,
  },
  {
    path: /\/playResults/,
    handler: initPlayGameResult,
  },

  {
    path: /\/game/,
    handler: initResultEmpate,
  },
  {
    path: /\/result\/lose/,
    handler: initResultLose,
  },

  {
    path: /\/result\/win/,
    handler: initResultWin,
  },
];

export function initRouter(container: Element) {
  function goTo(path: string) {
    history.pushState({}, "", path);
    handleRoute(path);
  }
  function handleRoute(route) {
    for (const r of routes) {
      if (r.path.test(route)) {
        const el = r.handler({ goTo: goTo });
        if (container.firstChild) {
          container.firstChild.remove();
        }
        container.appendChild(el);
      }
    }
  }
  goTo("/welcome");

  if (location.host.includes("github.io") || "/") {
    goTo("/welcome");
  } else {
    handleRoute(location.pathname);
  }

  window.onpopstate = function () {
    handleRoute(location.pathname);
  };
}
