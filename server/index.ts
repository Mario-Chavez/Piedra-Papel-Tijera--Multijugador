/* desde firebase intro (back end) */
import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";
import * as cors from "cors";
import * as path from "path";
import * as express from "express";
/////////////
const app = express();
const port = process.env.PORT || 3000;

/* back */
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

const userCollections = firestore.collection("users");
const roomCollections = firestore.collection("rooms");

//handler back

app.get("/env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
  });
});
/* solo pasamos el nombre para registrarnos en la base de datos */
app.post("/signup", (req, res) => {
  const { usernombre } = req.body;
  console.log("soy signup del back ", usernombre);
  userCollections
    .where("nombre", "==", usernombre)
    .get()
    .then((searchResponse) => {
      //empty (vacio). creamos el ususario
      if (searchResponse.empty) {
        userCollections
          .add({
            usernombre,
          })
          .then((newUser) => {
            res.json({
              message: "usuario creado",
              id: newUser.id,
            });
          });
      } else {
        /* respondemos q ya existe un ususario */
        res.status(400).json({
          /* id: searchResponse.docs[0].id, */
          message: "usuario ya existente",
        });
      }
    });
});
/* En base a su nombre nos devuelve un asuario y su id si esta vacia nos dira notfound
    sino nos volvera a dar el id del ususario registrado*/
app.post("/auth", (req, res) => {
  const { usernombre } = req.body;
  console.log("soy /auth del back ", usernombre);

  userCollections
    .where("usernombre", "==", usernombre)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        res.status(404).json({
          message: "usuario no encontrado (not found)",
        });
      } else {
        res.json({
          message: "usuasario existe",
          id: searchResponse.docs[0].id,
        });
      }
    });
});

/* este edpoint nos crea una romms primero verifica si existe el user id
nos da el id corto para poder pasar asi entre a la sala otro jugador 
Creamos el room*/

app.post("/rooms", (req, res) => {
  console.log("soy el /rooms datos que me llegan del front =", req.body);

  const { usernombre, userId } = req.body; //busca el id del usuario del body
  userCollections
    .doc(userId.toString())
    .get()
    .then((doc) => {
      //si existe...
      if (doc.exists) {
        /* crea en el rtdb un room */
        const roomsRef = rtdb.ref("rooms/" + nanoid());
        roomsRef
          .set({
            player1: {
              userId,
              usernombre,
              readyPlayer1: false,
              playRestar1: false,
              player1Online: false,
              movePlayer1: "",
              tiePlayer1: false,
            },
            player2: {
              player2Id: "",
              player2Nombre: "",
              readyPlayer2: false,
              player2Online: false,
              playRestar2: false,
              movePlayer2: "",
              tiePlayer2: false,
            },
            owner: userId,
          })
          .then(() => {
            /* cre el el firestore un documento con id mas sencillo y adentro guarda 
              el id mas complejo del rtdb*/

            const roomLongId = roomsRef.key; // id largo
            const roomId = 100 + Math.floor(Math.random() * 9999);
            roomCollections
              .doc(roomId.toString()) //agregamos un rooms con id corto
              .set({
                rtdbRoomId: roomLongId, //guardamos (set) el id complejo que hicimos en el rdtb
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                  idLargo: roomLongId,
                });
              });
          });
      } else {
        res.status(401).json({
          message: "No existis (not found)",
        });
      }
    });
});

/* accedemos al room con el id corto y el id del ususario
 rooms/roomId=>n de la room corto?userId=aqui va el id del usuario 

 */

app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query; //se usa el query
  const { roomId } = req.params; //parametro que le pasasamos por postman

  userCollections
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomCollections
          .doc(roomId)
          .get()
          .then((snap) => {
            const data = snap.data();
            res.json(data);
          });
      } else {
        res.status(401).json({
          Number: doc.data(),
          message: "No existe (not found)",
        });
      }
    });
});
// este endpoint modifica los valores guardado en el db para el player1

app.post("/rooms/:rtdbRoomId/player1", function (req, res) {
  console.log(
    "soy el back /rooms/rtdb/player1 datos que me llegan",
    req.body,
    "=reqbody"
  );

  const { rtdbRoomId } = req.params;
  const {
    readyPlayer1,
    playRestar1,
    player1Online,
    userId,
    usernombre,
    movePlayer1,
    tiePlayer1,
  } = req.body;
  const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/player1");
  roomRef.update(
    {
      readyPlayer1,
      playRestar1,
      player1Online,
      userId,
      usernombre,
      movePlayer1,
      tiePlayer1,
    },
    () => {
      res.status(200).json("player1 propiedades actualizadas");
    }
  );
});

// este endpoint modifica los valores guardado en el db para el player2

app.post("/rooms/:rtdbRoomId/player2", function (req, res) {
  const { rtdbRoomId } = req.params;
  const {
    player2Id,
    player2Nombre,
    readyPlayer2,
    player2Online,
    playRestar2,
    movePlayer2,
    tiePlayer2,
  } = req.body;
  const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/player2");
  roomRef.update(
    {
      player2Id,
      player2Nombre,
      readyPlayer2,
      player2Online,
      playRestar2,
      movePlayer2,
      tiePlayer2,
    },
    () => {
      res.status(200).json("player2 propiedades actualizadas");
    }
  );
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, "../dist/index.html")));
});

app.listen(port, () => {
  console.log("Hola soy express y estoy corriendo desde = " + port);
});
