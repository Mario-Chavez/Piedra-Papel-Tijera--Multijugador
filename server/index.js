"use strict";
exports.__esModule = true;
/* desde firebase intro (back end) */
var db_1 = require("./db");
var nanoid_1 = require("nanoid");
var cors = require("cors");
var path = require("path");
var express = require("express");
var app = express();
app.use(cors());
var port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static("dist"));
var userCollections = db_1.firestore.collection("users");
var roomCollections = db_1.firestore.collection("rooms");
//handler back
//prueba
app.get("/env", function (req, res) {
    res.json({
        environment: process.env.NODE_ENV
    });
});
/* solo pasamos el nombre para registrarnos en la base de datos */
app.post("/signup", function (req, res) {
    var usernombre = req.body.usernombre;
    console.log("soy signup del back ", usernombre);
    userCollections
        .where("nombre", "==", usernombre)
        .get()
        .then(function (searchResponse) {
        //empty (vacio). creamos el ususario
        if (searchResponse.empty) {
            userCollections
                .add({
                usernombre: usernombre
            })
                .then(function (newUser) {
                res.json({
                    message: "usuario creado",
                    id: newUser.id
                });
            });
        }
        else {
            /* respondemos q ya existe un ususario */
            res.status(400).json({
                /* id: searchResponse.docs[0].id, */
                message: "usuario ya existente"
            });
        }
    });
});
/* En base a su nombre nos devuelve un asuario y su id si esta vacia nos dira notfound
    sino nos volvera a dar el id del ususario registrado*/
app.post("/auth", function (req, res) {
    var usernombre = req.body.usernombre;
    console.log("soy /auth del back ", usernombre);
    userCollections
        .where("usernombre", "==", usernombre)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            res.status(404).json({
                message: "usuario no encontrado (not found)"
            });
        }
        else {
            res.json({
                message: "usuasario existe",
                id: searchResponse.docs[0].id
            });
        }
    });
});
/* este edpoint nos crea una romms primero verifica si existe el user id
nos da el id corto para poder pasar asi entre a la sala otro jugador
Creamos el room*/
app.post("/rooms", function (req, res) {
    console.log("soy el /rooms datos que me llegan del front =", req.body);
    var _a = req.body, usernombre = _a.usernombre, userId = _a.userId; //busca el id del usuario del body
    userCollections
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        //si existe...
        if (doc.exists) {
            /* crea en el rtdb un room */
            var roomsRef_1 = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
            roomsRef_1
                .set({
                player1: {
                    userId: userId,
                    usernombre: usernombre,
                    readyPlayer1: false,
                    playRestar1: false,
                    player1Online: false,
                    movePlayer1: "",
                    tiePlayer1: false
                },
                player2: {
                    player2Id: "",
                    player2Nombre: "",
                    readyPlayer2: false,
                    player2Online: false,
                    playRestar2: false,
                    movePlayer2: "",
                    tiePlayer2: false
                },
                owner: userId
            })
                .then(function () {
                /* cre el el firestore un documento con id mas sencillo y adentro guarda
                  el id mas complejo del rtdb*/
                var roomLongId = roomsRef_1.key; // id largo
                var roomId = 100 + Math.floor(Math.random() * 9999);
                roomCollections
                    .doc(roomId.toString()) //agregamos un rooms con id corto
                    .set({
                    rtdbRoomId: roomLongId
                })
                    .then(function () {
                    res.json({
                        id: roomId.toString(),
                        idLargo: roomLongId
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "No existis (not found)"
            });
        }
    });
});
/* accedemos al room con el id corto y el id del ususario
 rooms/roomId=>n de la room corto?userId=aqui va el id del usuario

 */
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId; //se usa el query
    var roomId = req.params.roomId; //parametro que le pasasamos por postman
    userCollections
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            roomCollections
                .doc(roomId)
                .get()
                .then(function (snap) {
                var data = snap.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                Number: doc.data(),
                message: "No existe (not found)"
            });
        }
    });
});
// este endpoint modifica los valores guardado en el db para el player1
app.post("/rooms/:rtdbRoomId/player1", function (req, res) {
    console.log("soy el back /rooms/rtdb/player1 datos que me llegan", req.body, "=reqbody");
    var rtdbRoomId = req.params.rtdbRoomId;
    var _a = req.body, readyPlayer1 = _a.readyPlayer1, playRestar1 = _a.playRestar1, player1Online = _a.player1Online, userId = _a.userId, usernombre = _a.usernombre, movePlayer1 = _a.movePlayer1, tiePlayer1 = _a.tiePlayer1;
    var roomRef = db_1.rtdb.ref("/rooms/" + rtdbRoomId + "/player1");
    roomRef.update({
        readyPlayer1: readyPlayer1,
        playRestar1: playRestar1,
        player1Online: player1Online,
        userId: userId,
        usernombre: usernombre,
        movePlayer1: movePlayer1,
        tiePlayer1: tiePlayer1
    }, function () {
        res.status(200).json("player1 propiedades actualizadas");
    });
});
// este endpoint modifica los valores guardado en el db para el player2
app.post("/rooms/:rtdbRoomId/player2", function (req, res) {
    var rtdbRoomId = req.params.rtdbRoomId;
    var _a = req.body, player2Id = _a.player2Id, player2Nombre = _a.player2Nombre, readyPlayer2 = _a.readyPlayer2, player2Online = _a.player2Online, playRestar2 = _a.playRestar2, movePlayer2 = _a.movePlayer2, tiePlayer2 = _a.tiePlayer2;
    var roomRef = db_1.rtdb.ref("/rooms/" + rtdbRoomId + "/player2");
    roomRef.update({
        player2Id: player2Id,
        player2Nombre: player2Nombre,
        readyPlayer2: readyPlayer2,
        player2Online: player2Online,
        playRestar2: playRestar2,
        movePlayer2: movePlayer2,
        tiePlayer2: tiePlayer2
    }, function () {
        res.status(200).json("player2 propiedades actualizadas");
    });
});
app.get("*", function (req, res) {
    res.sendFile(path.resolve(path.join(__dirname, "../dist/index.html")));
});
app.listen(port, function () {
    console.log("Hola soy express y estoy corriendo desde = " + port);
});
