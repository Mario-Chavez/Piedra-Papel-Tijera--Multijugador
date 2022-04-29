import { rtdb } from "./db";
import { map } from "lodash";

type Play = "piedra" | "papel" | "tijera";
type Game = {
  player1move: Play;
  player2move: Play; //en game cambie los nombres
};
const API_URL = "http://localhost:3000";
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
    console.log("soy el state del front", this.data);
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
        //this.setState(cs);

        //state.winerPlayer1Rtdb();
        return (result = "ganaste");
      }

      if (perdi) {
        //aqui pusheo en el state gano el player2
        this.data.history.push(1);
        //this.setState(cs);

        return (result = "perdiste");
      } else {
        // console.log("empate desde el player1");
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
        /* aqui solucione la no carga de la page de player2 sacando el setState */
        //this.setState(cs); estoy setendo d vuelta
        //state.winerPlayer1Rtdb();
        return (result = "ganaste");
      }

      if (perdi) {
        //aqui pusheo en el state gano el player2
        this.data.history.push(0);
        //this.setState(cs); estoy seteando de vuelta
        return (result = "perdiste");
      } else {
        // console.log("empate desde el player 2");
        return (result = "empate");
      }
    }
    //this.setState(cs); estoy seteando de vuelta
  },

  //  // Recorre el historial de jugadas y devuelve cuantas veces ganó la pc y el jugador
  returnScore() {
    // console.log("entre al score");

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

    //this.setState(lastState); //guardamos el score en el state   aquicomente probando por q no me manda a la pagina q es

    return score;
  },
  //
  //handler back

  setNameUser1(userNombre: string) {
    const cs = this.getState();
    cs.userNombre = userNombre;
    // this.setState(cs);
  },
  setNameUser2(player2Nombre: string) {
    const cs = this.getState();
    cs.player2Nombre = player2Nombre;
    // this.setState(cs);
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
    /* saque esto 26/4 */
    // const userId = cs.userId; //|| cs.player2Id aqui saque esto porq ya tiene accesToRomm2 12/4
    // cs.userId = userId;saque 26/4
    // this.setState(cs); saque por q esta setendo 2 veces 26/4

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
    /* saque 26/4 */
    // const userId = cs.player2Id;
    // cs.roomId = roomId;
    // cs.userId = userId;
    // this.setState(cs); saque 26/4

    fetch(API_URL + "/rooms/" + roomId + "?userId=" + cs.player2Id)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.listenRoomPlayer1(); //aqui lo subi antes del set al state 29/3/22
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
      console.log("esto es lo que llega desde el rtdb/player1", dataPlayer1);
      const player = map(dataPlayer1);
      cs.currentGame.player1move = player[0];
      cs.playRestar1 = player[1];
      cs.player1Online = player[2];
      cs.readyPlayer1 = player[3];
      cs.userId = player[4];
      cs.usernombre = player[5];
      cs.winer = player[8];
      this.setState(cs);
    });
  },
  listenRoomPlayer2() {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/player2");

    chatroomsRef.on("value", (snapshot) => {
      const dataPlayer2 = snapshot.val();
      console.log("esto es lo que llega desde el rtdb/player2", dataPlayer2);
      const player = map(dataPlayer2);
      cs.currentGame.player2move = player[0];
      cs.playRestar2 = player[1];
      cs.player2Id = player[2];
      cs.player2Nombre = player[3];
      cs.player2Online = player[4];
      cs.readyPlayer2 = player[5];
      cs.winer = player[8];
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
        // roomId: cs.roomId,
        // rtdbRoomId: "",
        userId: cs.userId,
        usernombre: cs.userNombre,
        // winer: "",
        movePlayer1: "",
      }),
    });
    // cs.player1Online = true; saqu 18/04
    // this.setState(cs);
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
        // roomId: "",
        // rtdbRoomId: "", //posible roblema al no tener roomId
        // winer: "",
        movePlayer2: "",
      }),
    });
    // cs.player2Online = true; saque 18/4
    //this.setState(cs);
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
        // roomId: cs.roomId,
        // rtdbRoomId: cs.rtdbRoomId,
        userId: cs.userId,
        usernombre: cs.userNombre,
        // winer: "",
        movePlayer1: "",
      }),
    });
    // cs.readyPlayer1 = true; saque 18/4
    //this.setState(cs);
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
        // roomId: "",
        // rtdbRoomId: "",
        // winer: "",
        movePlayer2: "",
      }),
    });
    // cs.readyPlayer2 = true; saque 18/4
    //this.setState(cs);
    if (callback) {
      callback();
    }
  },

  movePlayer1Rtdb(callback?) {
    const cs = this.getState();
    console.log("lo q mando al db dsd estate.ts player1 ==", cs);
    fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/player1", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playRestar1: false,
        player1Online: true,
        readyPlayer1: true,
        // roomId: cs.roomId,
        // rtdbRoomId: cs.rtdbRoomId,
        userId: cs.userId,
        usernombre: cs.userNombre,
        // winer: "",
        movePlayer1: cs.currentGame.player1move,
      }),
    });
    // cs.currentGame.player1move = cs.currentGame.player1move;
    // this.setState(cs); saque esto por q creo q el set move es suficiente 18/4

    if (callback) {
      callback();
    }
  },
  movePlayer2Rtdb(val, callback?) {
    const cs = this.getState();
    console.log("lo q mando al db state como val", val);

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
        // roomId: cs.roomId,
        // rtdbRoomId: cs.rtdbRoomId,
        // winer: "",
        movePlayer2: val,
      }),
    });
    // cs.currentGame.player2move = cs.currentGame.player2move; // probar setear en el current
    // this.setState(cs); saque esto por q creo q el set move es suficiente 18/4
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
        readyPlayer1: false, // aqui cambie a false
        // roomId: cs.roomId,
        // rtdbRoomId: cs.rtdbRoomId,
        userId: cs.userId,
        usernombre: cs.userNombre,
        // winer: "",
        movePlayer1: "",
      }),
    });
    cs.playRestar1 = true; // volvi a ponerlo 18/4
    cs.currentGame.player1move = ""; //volvi a ponerlo 18/4
    // this.setState(cs); // volvi a ponerlo el set al state 18/4
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
        readyPlayer2: false, //cambie a false
        // roomId: cs.roomId,
        // rtdbRoomId: cs.rtdbRoomId,
        // winer: "",
        movePlayer2: "",
      }),
    });
    cs.playRestar2 = true; // volvi a ponerlo 18/4
    cs.currentGame.player2move = ""; // puse de vuelta esto 18/4
    // this.setState(cs); //voli a ponerlo 18/4
    if (callback) {
      callback();
    }
  },

  /* nuevo cambio en el state m,ade uin heroku desaf */
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};
/* creo que esto no va  mirar el sstate del front de heroku */
/* (function () {
  const localState = localStorage.getItem("state");
  if (localState) {
    state.setState(JSON.parse(localState));
  }
})(); */

export { state };
