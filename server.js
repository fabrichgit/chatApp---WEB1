const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);


app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function (socket) {
    socket.on("newuser", function (user) {

        socket.broadcast.emit("update", {
            text: `${user.pseudo} is here`,
            receiver: user.receiver
        });

        socket.broadcast.emit("add-online", {
            receiver: user.receiver,
            user: user.pseudo
        });

    });

    socket.on("exituser", function (user) {
        socket.broadcast.emit("update", {
            text: `${user.pseudo} is gone`,
            receiver: user.receiver
        });

        socket.broadcast.emit("offline", {
            user: user.pseudo,
            receiver: user.receiver
        })
    });

    socket.on("chat", function (message) {
        socket.broadcast.emit("chat", message);
    });

    socket.on("upload-img", function (data) {
        socket.broadcast.emit("upload-img", data);
    })

});


server.listen(3000);