import { rtdb } from "./db";
import { map } from "lodash";

type Play = "piedra" | "papel" | "tijera";
type Game = {
  player1move: Play;
  player2move: Play;
};
const API_URL = process.env.PORT;
const state = {
  data: {
    currentGame: {
      player1move: "",
      player2move: "",
    },
    history: [],
    userNombre: "",
    player2Nombre: "",
    userId: "",
    player2Id: "",
    player1Online: false,
    player2Online: false,
    readyPlayer1: false,
    readyPlayer2: false,
    roomId: "",
    rtdbRoomId: "",
    playRestar1: false,
    playRestar2: false,
    tiePlayer1: false,
    tiePlayer2: false,
  },
  listeners: [],

  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;

    for (const cb of this.listeners) {
      cb();
    }
    sessionStorage.setItem("state", JSON.stringify(newState));
    // console.log("soy el state del front", this.data);
  },
  //Guarda ambas jugadas en el state

  setGame(playerPlay: Play) {
    const lastState = this.getState();

    lastState.currentGame.player1move = playerPlay;

    // this.setState(lastState);
  },
  /* aqui hice otro set game para el player 2 */
  setGame2(playerPlay: Play) {
    const lastState = this.getState();

    lastState.currentGame.player2move = playerPlay;
    // this.setState(lastState);
  },

  // Declara la lógica para saber quién ganó, y lo devuelve
  //tambien pushea al history
  whoWins(player1move: Play, player2move: Play) {
    const cs = state.getState();

    if (cs.userNombre) {
      const ganeConPiedra = player1move == "piedra" && player2move == "tijera";
      const ganeConTijeras = player1move == "tijera" && player2move == "papel";
      const ganeConPapel = player1move == "papel" && player2move == "piedra";

      const gane = [ganeConPapel, ganeConPiedra, ganeConTijeras].includes(true);

      const perdiConPiedra = player1move == "piedra" && player2move == "papel";
      const perdiConPapel = player1move == "papel" && player2move == "tijera";
      const perdiConTijeras =
        player1move == "tijera" && player2move == "piedra";

      const perdi = [perdiConPapel, perdiConPiedra, perdiConTijeras].includes(
        true
      );
      let result;
      if (gane) {
        //aqui pusheo en el state gano el player1
        this.data.history.push(0);

        return (result = "ganaste");
      }

      if (perdi) {
        //aqui pusheo en el state gano el player2
        this.data.history.push(1);

        return (result = "perdiste");
      } else {
        return (result = "empate");
      }
    } else {
      const ganeConPiedra = player1move == "tijera" && player2move == "piedra";
      const ganeConTijeras = player1move == "papel" && player2move == "tijera";
      const ganeConPapel = player1move == "piedra" && player2move == "papel";

      const gane = [ganeConPapel, ganeConPiedra, ganeConTijeras].includes(true);

      const perdiConPiedra = player1move == "papel" && player2move == "piedra";
      const perdiConPapel = player1move == "tijera" && player2move == "papel";
      const perdiConTijeras =
        player1move == "piedra" && player2move == "tijera";

      const perdi = [perdiConPapel, perdiConPiedra, perdiConTijeras].includes(
        true
      );
      let result;
      if (gane) {
        //aqui pusheo en el state gano el player1
        this.data.history.push(1);
        return (result = "ganaste");
      }

      if (perdi) {
        //aqui pusheo en el state gano el player2
        this.data.history.push(0);
        return (result = "perdiste");
      } else {
        return (result = "empate");
      }
    }
  },

  //  // Recorre el historial de jugadas y devuelve cuantas veces ganó la pc y el jugador
  returnScore() {
    const lastState = this.getState();
    const score = {
      player1: 0,
      player2: 0,
    };
    for (const i of lastState.history) {
      if (i == 0) {
        score.player1++;
      } else {
        score.player2++;
      }
    }

    return score;
  },
  //
  //handler back

  setNameUser1(userNombre: string) {
    const cs = this.getState();
    cs.userNombre = userNombre;
  },
  setNameUser2(player2Nombre: string) {
    const cs = this.getState();
    cs.player2Nombre = player2Nombre;
  },

  //creamos un usuario en la basede datos y nos da el userId hay que hcer otro para el usuario 2
  signUp(callback?) {
    const cs = this.getState();

    if (cs.userNombre) {
      fetch(API_URL + "/signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          usernombre: cs.userNombre,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
    } else {
      callback(true);
      console.error("usuario ya existe");
    }
  },

  signUp2(callback?) {
    const cs = this.getState();

    if (cs.player2Nombre) {
      fetch(API_URL + "/signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          usernombre: cs.player2Nombre,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.player2Id = data.id;
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
    } else {
      callback(true);
      console.error("usuario ya existe user 2 fetch from");
    }
  },

  askNewRoom(callback?) {
    const cs = this.getState();
    if ((cs.userNombre, cs.userId)) {
      fetch(API_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ usernombre: cs.userNombre, userId: cs.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.roomId = data.id;
          cs.rtdbRoomId = data.idLargo;
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
    } else {
      console.error(" no exisite el ususario con ese id");
    }
  },

  accessToRoom(callback?) {
    const cs = this.getState();

    fetch(API_URL + "/rooms/" + cs.roomId + "?userId=" + cs.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.listenRoomPlayer2();
        this.setState(cs);
        if (callback) {
          callback();
        }
      });
  },
  accessToRoomPlayer2(roomIdDelInput, callback?) {
    const cs = this.getState();
    const roomId = roomIdDelInput.toString();

    fetch(API_URL + "/rooms/" + roomId + "?userId=" + cs.player2Id)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        cs.roomId = roomId;
        this.listenRoomPlayer1();
        this.setState(cs);
        if (callback) {
          callback();
        }
      });
  },

  /* escucha los cambios de nuestra base de datos en firebase */
  listenRoomPlayer1() {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/player1");

    chatroomsRef.on("value", (snapshot) => {
      const dataPlayer1 = snapshot.val();
      const player = map(dataPlayer1);
      cs.currentGame.player1move = player[0];
      cs.playRestar1 = player[1];
      cs.player1Online = player[2];
      cs.readyPlayer1 = player[3];
      cs.tiePlayer1 = player[4];
      cs.userId = player[5];
      cs.usernombre = player[6];
      this.setState(cs);
    });
  },
  listenRoomPlayer2() {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/player2");

    chatroomsRef.on("value", (snapshot) => {
      const dataPlayer2 = snapshot.val();
      const player = map(dataPlayer2);
      cs.currentGame.player2move = player[0];
      cs.playRestar2 = player[1];
      cs.player2Id = player[2];
      cs.player2Nombre = player[3];
      cs.player2Online = player[4];
      cs.readyPlayer2 = player[5];
      cs.tiePlayer2 = player[6];
      this.setState(cs);
    });
  },
  setNamePlayer1Rtdb(callback?) {
    const cs = this.getState();
    fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/player1", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playRestar1: false,
        player1Online: true,
        readyPlayer1: false,
        userId: cs.userId,
        usernombre: cs.userNombre,
        movePlayer1: "",
        tiePlayer1: false,
      }),
    });

    if (callback) {
      callback();
    }
  },

  setNamePlayer2Rtdb(callback?) {
    const cs = this.getState();

    fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/player2", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playRestar2: false,
        player2Online: true,
        player2Id: cs.player2Id,
        player2Nombre: cs.player2Nombre,
        readyPlayer2: false,
        movePlayer2: "",
        tiePlayer2: false,
      }),
    });

    if (callback) {
      callback();
    }
  },

  readyPlayer1Rtdb(callback?) {
    const cs = this.getState();
    fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/player1", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playRestar1: false,
        player1Online: true,
        readyPlayer1: true,
        userId: cs.userId,
        usernombre: cs.userNombre,
        movePlayer1: "",
        tiePlayer1: false,
      }),
    });

    if (callback) {
      callback();
    }
  },
  readyPlayer2Rtdb(callback?) {
    const cs = this.getState();
    fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/player2", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playRestar2: false,
        player2Online: true,
        player2Id: cs.player2Id,
        player2Nombre: cs.player2Nombre,
        readyPlayer2: true,
        movePlayer2: "",
        tiePlayer2: false,
      }),
    });

    if (callback) {
      callback();
    }
  },

  movePlayer1Rtdb(callback?) {
    const cs = this.getState();
    fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/player1", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playRestar1: false,
        player1Online: true,
        readyPlayer1: false,
        userId: cs.userId,
        usernombre: cs.userNombre,
        movePlayer1: cs.currentGame.player1move,
        tiePlayer1: false,
      }),
    });
    cs.playRestar1 = false;
    cs.tiePlayer1 = false;
    state.setState(cs);

    if (callback) {
      callback();
    }
  },
  movePlayer2Rtdb(callback?) {
    const cs = this.getState();

    fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/player2", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playRestar2: false,
        player2Online: true,
        player2Id: cs.player2Id,
        player2Nombre: cs.player2Nombre,
        readyPlayer2: false,
        movePlayer2: cs.currentGame.player2move,
        tiePlayer2: false,
      }),
    });
    cs.playRestar2 = false;
    cs.tiePlayer2 = false;
    state.setState(cs);
    if (callback) {
      callback();
    }
  },
  restarPlayer1Rtdb(callback?) {
    const cs = this.getState();

    fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/player1", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playRestar1: true,
        player1Online: true,
        readyPlayer1: false,
        userId: cs.userId,
        usernombre: cs.userNombre,
        movePlayer1: "",
        tiePlayer1: false,
      }),
    });
    cs.playRestar1 = true;
    cs.currentGame.player1move = "";
    state.setState(cs);

    if (callback) {
      callback();
    }
  },

  restarPlayer2Rtdb(callback?) {
    const cs = this.getState();

    fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/player2", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playRestar2: true,
        player2Online: true,
        player2Id: cs.player2Id,
        player2Nombre: cs.player2Nombre,
        readyPlayer2: false,
        movePlayer2: "",
        tiePlayer2: false,
      }),
    });
    cs.playRestar2 = true;
    cs.currentGame.player2move = "";
    state.setState(cs);

    if (callback) {
      callback();
    }
  },
  tiePlayer1Rtdb(callback?) {
    const cs = this.getState();

    fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/player1", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playRestar1: true,
        player1Online: true,
        readyPlayer1: false,
        userId: cs.userId,
        usernombre: cs.userNombre,
        movePlayer1: "",
        tiePlayer1: true,
      }),
    });
    cs.tiePlayer1 = true;
    cs.playRestar1 = true;
    cs.currentGame.player1move = "";

    if (callback) {
      callback();
    }
  },

  tiePlayer2Rtdb(callback?) {
    const cs = this.getState();

    fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/player2", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playRestar2: true,
        player2Online: true,
        player2Id: cs.player2Id,
        player2Nombre: cs.player2Nombre,
        readyPlayer2: false,
        movePlayer2: "",
        tiePlayer2: true,
      }),
    });
    cs.tiePlayer2 = true;
    cs.playRestar2 = true;
    cs.currentGame.player2move = "";

    if (callback) {
      callback();
    }
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
