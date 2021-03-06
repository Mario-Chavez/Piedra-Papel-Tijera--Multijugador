import { state } from "../../state";

export function initPlayGameResult(params) {
  const cs = state.getState();
  const div = document.createElement("div");
  //si es el player1
  if (cs.userNombre) {
    const game = {
      movePlayer1: cs.currentGame.player1move,
      movePlayer2: cs.currentGame.player2move,
    };

    div.innerHTML = `
    <div class="game__show-both-plays-container game__fade-in-down">
    <my-play type="${game.movePlayer2}" opponent="true"></my-play>
    </div>
    <div class="game__show-both-plays-container game__fade-in-up">
    <my-play type="${game.movePlayer1}"></my-play>
    </div>
    `;

    //pasamos a whoWins la jugada para que haga la logica y me entregue al ganador
    setTimeout(() => {
      const winner = state.whoWins(
        cs.currentGame.player1move,
        cs.currentGame.player2move
      );

      if (winner == "empate") {
        params.goTo("/tie");
      } else if (winner == "ganaste") {
        params.goTo("/result/win");
      } else if (winner == "perdiste") {
        params.goTo("/result/lose");
      }
    }, 3000);
  } else {
    const game = {
      movePlayer1: cs.currentGame.player1move,
      movePlayer2: cs.currentGame.player2move,
    };

    div.innerHTML = `
    <div class="game__show-both-plays-container game__fade-in-down">
                <my-play type="${game.movePlayer1}" opponent="true"></my-play>
            </div>
            <div class="game__show-both-plays-container game__fade-in-up">
                <my-play type="${game.movePlayer2}"></my-play>
            </div>
            `;
    setTimeout(() => {
      const winner = state.whoWins(
        cs.currentGame.player1move,
        cs.currentGame.player2move
      );

      if (winner == "empate") {
        return params.goTo("/tie");
      } else if (winner == "ganaste") {
        return params.goTo("/result/win");
      } else if (winner == "perdiste") {
        return params.goTo("/result/lose");
      }
    }, 3000);
  }

  return div;
}
